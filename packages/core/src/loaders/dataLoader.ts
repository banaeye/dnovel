import yaml from 'js-yaml';
import type { Scene } from '../types/scene';
import type { FlagDefinition } from '../types/flag';
import type { ItemDefinition } from '../types/item';
import type { LocationDefinition } from '../types/location';
import type { CharacterDefinition } from '../types/character';
import type { CommandDefinition } from '../types/command';

export interface MasterData {
  scenes: Record<string, Scene>;
  flags: FlagDefinition[];
  items: Record<string, ItemDefinition>;
  locations: Record<string, LocationDefinition>;
  characters: Record<string, CharacterDefinition>;
  commands: Record<string, CommandDefinition>;
}

export interface RawYamlInputs {
  scenes: string;
  flags: string;
  items: string;
  locations: string;
  characters: string;
  commands: string;
}

function toRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  return Object.fromEntries(arr.map((item) => [item.id, item]));
}

function flattenScenes(raw: any[], parentDefaults: Partial<Scene> = {}): Scene[] {
  const result: Scene[] = [];
  for (const s of raw) {
    const { child_scenes, ...rest } = s;
    const merged = { ...parentDefaults, ...rest } as Scene;
    result.push(merged);
    if (child_scenes?.length) {
      result.push(...flattenScenes(child_scenes, {
        location_id: merged.location_id,
        background: merged.background,
        bgm: merged.bgm,
      }));
    }
  }
  return result;
}

export function parseMasterData(inputs: RawYamlInputs): MasterData {
  const scenesData = yaml.load(inputs.scenes) as { scenes: any[] };
  const flagsData = yaml.load(inputs.flags) as { flags: FlagDefinition[] };
  const itemsData = yaml.load(inputs.items) as { items: ItemDefinition[] };
  const locationsData = yaml.load(inputs.locations) as { locations: LocationDefinition[] };
  const charactersData = yaml.load(inputs.characters) as { characters: CharacterDefinition[] };
  const commandsData = yaml.load(inputs.commands) as { commands: CommandDefinition[] };

  return {
    scenes: toRecord(flattenScenes(scenesData.scenes)),
    flags: flagsData.flags,
    items: toRecord(itemsData.items),
    locations: toRecord(locationsData.locations),
    characters: toRecord(charactersData.characters),
    commands: toRecord(commandsData.commands),
  };
}

