import { getMasterData } from './loaders/demoLoader';
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';
import { MazeRpgEngine } from '@novel-engine/maze-rpg';

const masterData = getMasterData();
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
          initialSceneId: 'scene_danchi_morning',
          initialLocationId: 'loc_danchi',
        },
      }}
      initialContext={{ flags: {}, inventory: [], playerStats: {} }}
    />
  );
}
