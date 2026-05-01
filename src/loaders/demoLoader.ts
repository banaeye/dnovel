// Demo-app only: loads YAML files bundled with the game via Vite ?raw imports.
// Library consumers should call parseMasterData() with their own YAML strings.
import scenesRaw from '../data/scenes.yaml?raw';
import flagsRaw from '../data/flags.yaml?raw';
import itemsRaw from '../data/items.yaml?raw';
import locationsRaw from '../data/locations.yaml?raw';
import charactersRaw from '../data/characters.yaml?raw';
import commandsRaw from '../data/commands.yaml?raw';
import { parseMasterData } from './dataLoader';
import type { MasterData } from './dataLoader';

let cached: MasterData | null = null;

export function getMasterData(): MasterData {
  if (!cached) {
    cached = parseMasterData({
      scenes: scenesRaw,
      flags: flagsRaw,
      items: itemsRaw,
      locations: locationsRaw,
      characters: charactersRaw,
      commands: commandsRaw,
    });
  }
  return cached;
}
