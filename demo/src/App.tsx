import scenesRaw    from './data/scenes.yaml?raw';
import flagsRaw     from './data/flags.yaml?raw';
import itemsRaw     from './data/items.yaml?raw';
import locationsRaw from './data/locations.yaml?raw';
import charsRaw     from './data/characters.yaml?raw';
import cmdsRaw      from './data/commands.yaml?raw';

import { parseMasterData } from '@novel-engine/core';
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';
import { MazeRpgEngine } from '@novel-engine/maze-rpg';

const masterData = parseMasterData({
  scenes:     scenesRaw,
  flags:      flagsRaw,
  items:      itemsRaw,
  locations:  locationsRaw,
  characters: charsRaw,
  commands:   cmdsRaw,
});

const ASSETS_BASE = `${import.meta.env.BASE_URL}assets`;

export default function App() {
  return (
    <GameHub
      engines={{
        novel: NovelEngineAdapter,
        maze_rpg: MazeRpgEngine,
      }}
      initial={{
        engineId: 'novel',
        config: {
          masterData,
          assetsBaseUrl: ASSETS_BASE,
          initialSceneId: 'scene_start',
          initialLocationId: 'loc_shop',
        },
      }}
      initialContext={{ flags: {}, inventory: [], playerStats: {} }}
    />
  );
}
