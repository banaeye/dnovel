---
name: adjust-novel-scenario
description: Edit and validate YAML scenarios for this React/TypeScript novel game engine. Use when Codex is asked to adjust story flow, move characters between locations, add scenes, fix progression bugs, validate scenes_ch*.yaml, inspect talkable/characters mismatches, update location connections, flags/items, or check scenario references in this novel repository.
---

# Adjust Novel Scenario

## Workflow

1. Identify the target chapter file, usually `src/data/scenes_chN.yaml`.
2. Read the relevant files before editing:
   - `src/data/locations.yaml`
   - target `src/data/scenes_ch*.yaml`
   - `src/data/flags.yaml`
   - `src/data/items.yaml`
   - `src/data/characters.yaml`
   - `packages/core/src/types/scene.ts` if schema behavior is uncertain
3. Preserve chapter standalone behavior: every `locations.yaml` `entry_scene` must exist in every chapter scenes file.
4. After editing, run:
   ```bash
   node .codex/skills/adjust-novel-scenario/scripts/validate_scenario.mjs src/data/scenes_ch4.yaml
   npx tsc --noEmit
   npm run build
   ```

## Editing Rules

- Keep changes scoped to story, data, and the minimum engine support needed for the request.
- For location movement, update both the relevant location connections and the chapter entry scenes.
- If a visible character should be talkable, make sure the command-phase scene has matching `characters` and `talkable`.
- If a scene is only flavor text and should not allow talking, set `characters: []` to clear prior display state.
- Avoid putting BGM only on dispatcher scenes (`messages: []` + `branches.type: auto`). Put BGM on the actual displayed scenes too.
- Prefer data-driven branching. Add engine schema only when YAML cannot safely express the requested condition.
- When using `next_engine`, verify `return_scene` exists in the same chapter file and the return scene restores the expected location, characters, and rewards.

## Common Checks

- References: scene IDs, location IDs, character IDs, item IDs, flag IDs.
- Flow: `next_scene`, branch choices, talkable scene targets, clickable area targets, `next_engine.return_scene`.
- Chapter entry coverage: all shared location `entry_scene` IDs exist in the target chapter.
- Command screen consistency: visible characters should not be left over from a previous scene when no one is talkable.

## References

Read `references/novel-scenario-rules.md` when a request involves new locations, chapter-level flow, multi-engine transitions, or a progression bug.

Use `scripts/validate_scenario.mjs` for deterministic validation after scenario edits.
