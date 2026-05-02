import scenesRaw    from './data/scenes.yaml?raw';
import flagsRaw     from './data/flags.yaml?raw';
import itemsRaw     from './data/items.yaml?raw';
import locationsRaw from './data/locations.yaml?raw';
import charsRaw     from './data/characters.yaml?raw';
import cmdsRaw      from './data/commands.yaml?raw';

import { NovelApp, parseMasterData } from '@novel-engine/core';

const masterData = parseMasterData({
  scenes:     scenesRaw,
  flags:      flagsRaw,
  items:      itemsRaw,
  locations:  locationsRaw,
  characters: charsRaw,
  commands:   cmdsRaw,
});

export default function App() {
  return (
    <NovelApp
      masterData={masterData}
      assetsBaseUrl={`${import.meta.env.BASE_URL}assets`}
      config={{
        initialSceneId:    'scene_start',
        initialLocationId: 'loc_shop',
      }}
    />
  );
}
