import { getMasterData } from './loaders/demoLoader';
import { NovelApp } from './components/NovelApp';

const masterData = getMasterData();

export default function App() {
  return (
    <NovelApp
      masterData={masterData}
      assetsBaseUrl={`${import.meta.env.BASE_URL}assets`}
      config={{
        initialSceneId: 'scene_danchi_morning',
        initialLocationId: 'loc_danchi',
      }}
    />
  );
}
