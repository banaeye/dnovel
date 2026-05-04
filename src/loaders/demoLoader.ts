// Demo-app only: loads YAML files bundled with the game via Vite ?raw imports.
// Library consumers should call parseMasterData() with their own YAML strings.
import scenesCh1Raw from '../data/scenes_ch1.yaml?raw';
import scenesCh2Raw from '../data/scenes_ch2.yaml?raw';
import scenesCh3Raw from '../data/scenes_ch3.yaml?raw';
import flagsRaw from '../data/flags.yaml?raw';
import itemsRaw from '../data/items.yaml?raw';
import locationsRaw from '../data/locations.yaml?raw';
import charactersRaw from '../data/characters.yaml?raw';
import commandsRaw from '../data/commands.yaml?raw';
import { parseMasterData } from '@novel-engine/core';
import type { MasterData } from '@novel-engine/core';

export type ChapterId = 'chapter1' | 'chapter2' | 'chapter3';

const sceneSources: Record<ChapterId, string> = {
  chapter1: scenesCh1Raw,
  chapter2: scenesCh2Raw,
  chapter3: scenesCh3Raw,
};

const cached: Partial<Record<ChapterId, MasterData>> = {};

export function getMasterData(chapterId: ChapterId = 'chapter1'): MasterData {
  cached[chapterId] ??= parseMasterData({
    scenes: sceneSources[chapterId],
    flags: flagsRaw,
    items: itemsRaw,
    locations: locationsRaw,
    characters: charactersRaw,
    commands: commandsRaw,
  });
  return cached[chapterId];
}
