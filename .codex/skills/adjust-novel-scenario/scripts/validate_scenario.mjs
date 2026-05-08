#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const args = process.argv.slice(2);
if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node .codex/skills/adjust-novel-scenario/scripts/validate_scenario.mjs <src/data/scenes_chN.yaml> [repo-root]');
  process.exit(args.length < 1 ? 1 : 0);
}

const scenesPath = path.resolve(args[0]);
const root = path.resolve(args[1] ?? process.cwd());
const dataDir = path.join(root, 'src', 'data');

function readYaml(filePath) {
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to read YAML ${filePath}: ${err.message}`);
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function collectScenes(sceneList, out = []) {
  for (const scene of toArray(sceneList)) {
    out.push(scene);
    if (scene.child_scenes) collectScenes(scene.child_scenes, out);
  }
  return out;
}

function idSet(data, key) {
  return new Set(toArray(data?.[key]).map((entry) => entry.id).filter(Boolean));
}

const scenesData = readYaml(scenesPath);
const locationsData = readYaml(path.join(dataDir, 'locations.yaml'));
const flagsData = readYaml(path.join(dataDir, 'flags.yaml'));
const itemsData = readYaml(path.join(dataDir, 'items.yaml'));
const charactersData = readYaml(path.join(dataDir, 'characters.yaml'));
const commandsData = readYaml(path.join(dataDir, 'commands.yaml'));

const scenes = collectScenes(scenesData?.scenes);
const sceneIds = new Set();
const locationIds = idSet(locationsData, 'locations');
const flagIds = idSet(flagsData, 'flags');
const itemIds = idSet(itemsData, 'items');
const characterIds = idSet(charactersData, 'characters');
const commandIds = idSet(commandsData, 'commands');

const errors = [];
const warnings = [];

function error(where, message) {
  errors.push(`${where}: ${message}`);
}

function warn(where, message) {
  warnings.push(`${where}: ${message}`);
}

function isDynamicFlag(flagId) {
  return (
    flagId.startsWith('memory_game_') ||
    flagId.startsWith('flash_calc_') ||
    flagId.startsWith('runner_action_') ||
    flagId.startsWith('cleared_runner_action') ||
    flagId.startsWith('explored_')
  );
}

function checkCondition(condition, where) {
  if (!condition) return;
  if (condition.and) toArray(condition.and).forEach((child, i) => checkCondition(child, `${where}.and[${i}]`));
  if (condition.or) toArray(condition.or).forEach((child, i) => checkCondition(child, `${where}.or[${i}]`));

  if (condition.flag && !flagIds.has(condition.flag) && !isDynamicFlag(condition.flag)) {
    error(where, `missing flag '${condition.flag}'`);
  }
  if (condition.has_item && !itemIds.has(condition.has_item)) {
    error(where, `missing item '${condition.has_item}'`);
  }
  if (condition.item_count) {
    for (const itemId of toArray(condition.item_count.items)) {
      if (!itemIds.has(itemId)) error(where, `missing item_count item '${itemId}'`);
    }
    if (condition.item_count.min === undefined && condition.item_count.max === undefined) {
      warn(where, 'item_count has no min or max');
    }
  }
  if (condition.location_id && !locationIds.has(condition.location_id)) {
    error(where, `missing location '${condition.location_id}'`);
  }
}

function checkSceneRef(sceneId, where, field) {
  if (sceneId !== undefined && sceneId !== null && !sceneIds.has(sceneId)) {
    error(where, `missing ${field} '${sceneId}'`);
  }
}

function missingSceneWarning(sceneId, where, field) {
  if (sceneId !== undefined && sceneId !== null && !sceneIds.has(sceneId)) {
    warn(where, `missing ${field} '${sceneId}' (engine-specific config may be intentional)`);
  }
}

function canReachCommand(scene) {
  if (!scene || scene.game_end || scene.next_engine) return false;
  const choices = toArray(scene.branches?.choices);
  if (choices.length > 0) return choices.some((choice) => choice.next_scene === null || choice.next_scene === undefined);
  if (scene.next_scene !== undefined) return scene.next_scene === null;
  return true;
}

for (const scene of scenes) {
  if (!scene?.id) {
    error('<scene>', 'scene missing id');
    continue;
  }
  if (sceneIds.has(scene.id)) error(scene.id, 'duplicate scene id');
  sceneIds.add(scene.id);
}

for (const location of toArray(locationsData?.locations)) {
  if (location.entry_scene && !sceneIds.has(location.entry_scene)) {
    error(`locations.${location.id}`, `entry_scene '${location.entry_scene}' is not defined in ${path.basename(scenesPath)}`);
  }
  for (const [i, conn] of toArray(location.connections).entries()) {
    if (conn.location_id && !locationIds.has(conn.location_id)) {
      error(`locations.${location.id}.connections[${i}]`, `missing target location '${conn.location_id}'`);
    }
    checkCondition(conn.condition, `locations.${location.id}.connections[${i}].condition`);
  }
}

for (const scene of scenes) {
  const where = scene.id ?? '<scene>';
  if (scene.location_id && !locationIds.has(scene.location_id)) error(where, `missing location '${scene.location_id}'`);
  checkSceneRef(scene.next_scene, where, 'next_scene');

  for (const commandId of toArray(scene.commands)) {
    if (!commandIds.has(commandId)) error(where, `missing command '${commandId}'`);
  }

  for (const [i, flagSet] of toArray(scene.flags_set).entries()) {
    if (!flagIds.has(flagSet.flag)) error(`${where}.flags_set[${i}]`, `missing flag '${flagSet.flag}'`);
  }

  for (const [i, give] of toArray(scene.item_give).entries()) {
    if (!itemIds.has(give.item_id)) error(`${where}.item_give[${i}]`, `missing item '${give.item_id}'`);
    checkCondition(give.condition, `${where}.item_give[${i}].condition`);
  }

  for (const [i, itemId] of toArray(scene.item_remove).entries()) {
    if (!itemIds.has(itemId)) error(`${where}.item_remove[${i}]`, `missing item '${itemId}'`);
  }

  for (const [i, display] of toArray(scene.characters).entries()) {
    if (!characterIds.has(display.character_id)) error(`${where}.characters[${i}]`, `missing character '${display.character_id}'`);
  }

  for (const [i, message] of toArray(scene.messages).entries()) {
    if (message.voice_character_id && !characterIds.has(message.voice_character_id)) {
      error(`${where}.messages[${i}]`, `missing voice character '${message.voice_character_id}'`);
    }
    for (const [j, display] of toArray(message.characters).entries()) {
      if (!characterIds.has(display.character_id)) error(`${where}.messages[${i}].characters[${j}]`, `missing character '${display.character_id}'`);
    }
  }

  for (const [i, talkable] of toArray(scene.talkable).entries()) {
    if (!characterIds.has(talkable.character_id)) error(`${where}.talkable[${i}]`, `missing character '${talkable.character_id}'`);
    checkSceneRef(talkable.scene_id, `${where}.talkable[${i}]`, 'scene_id');
    checkCondition(talkable.condition, `${where}.talkable[${i}].condition`);
  }

  for (const [i, area] of toArray(scene.clickable_areas).entries()) {
    checkSceneRef(area.next_scene, `${where}.clickable_areas[${i}]`, 'next_scene');
    checkCondition(area.condition, `${where}.clickable_areas[${i}].condition`);
  }

  for (const [i, choice] of toArray(scene.branches?.choices).entries()) {
    checkSceneRef(choice.next_scene, `${where}.branches.choices[${i}]`, 'next_scene');
    checkCondition(choice.condition, `${where}.branches.choices[${i}].condition`);
  }

  if (scene.next_engine) {
    const spec = scene.next_engine;
    checkSceneRef(spec.return_scene, `${where}.next_engine`, 'return_scene');
    missingSceneWarning(spec.gameover_scene, `${where}.next_engine`, 'gameover_scene');
    missingSceneWarning(spec.gameover_boss_scene, `${where}.next_engine`, 'gameover_boss_scene');
    missingSceneWarning(spec.gameover_landing_scene, `${where}.next_engine`, 'gameover_landing_scene');
    for (const [tile, sceneId] of Object.entries(spec.config?.events ?? {})) {
      missingSceneWarning(sceneId, `${where}.next_engine.config.events.${tile}`, 'event scene');
    }
  }

  const visibleCharacters = toArray(scene.characters).map((display) => display.character_id);
  const talkableCharacters = new Set(toArray(scene.talkable).map((entry) => entry.character_id));
  if (visibleCharacters.length > 0 && scene.messages?.length === 0 && canReachCommand(scene)) {
    const notTalkable = visibleCharacters.filter((characterId) => !talkableCharacters.has(characterId));
    if (notTalkable.length > 0) {
      warn(where, `visible character(s) not talkable in a command-capable scene: ${notTalkable.join(', ')}`);
    }
  }

  for (const [i, choice] of toArray(scene.branches?.choices).entries()) {
    if (!choice.next_scene || !sceneIds.has(choice.next_scene)) continue;
    const target = scenes.find((candidate) => candidate.id === choice.next_scene);
    if (
      visibleCharacters.length > 0 &&
      target?.characters === undefined &&
      toArray(target?.talkable).length === 0 &&
      canReachCommand(target)
    ) {
      warn(
        `${where}.branches.choices[${i}]`,
        `target '${choice.next_scene}' may inherit visible character(s) ${visibleCharacters.join(', ')} but has no talkable; add characters: [] if intentional`,
      );
    }
  }
}

if (errors.length) {
  console.error(`Scenario validation failed: ${errors.length} error(s), ${warnings.length} warning(s)`);
  for (const message of errors) console.error(`ERROR ${message}`);
  for (const message of warnings) console.error(`WARN  ${message}`);
  process.exit(1);
}

console.log(`Scenario validation passed: ${scenes.length} scene(s), ${warnings.length} warning(s)`);
for (const message of warnings) console.log(`WARN  ${message}`);
