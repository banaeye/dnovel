import { useEffect } from 'react';
import scenesRaw    from './data/scenes.yaml?raw';
import flagsRaw     from './data/flags.yaml?raw';
import itemsRaw     from './data/items.yaml?raw';
import locationsRaw from './data/locations.yaml?raw';
import charsRaw     from './data/characters.yaml?raw';
import cmdsRaw      from './data/commands.yaml?raw';

import { parseMasterData } from '@novel-engine/core';
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';
import type { IGameEngine, EngineProps, GameContext } from '@novel-engine/hub';

const masterData = parseMasterData({
  scenes:     scenesRaw,
  flags:      flagsRaw,
  items:      itemsRaw,
  locations:  locationsRaw,
  characters: charsRaw,
  commands:   cmdsRaw,
});

interface MazeConfig {
  map: string;
}

function StubMazeComponent({ context, config, onExit }: EngineProps<MazeConfig>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedContext: GameContext = {
        ...context,
        flags: { ...context.flags, flag_explored_dungeon: true },
      };
      onExit(updatedContext);
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      width: 800,
      height: 600,
      background: '#0a0a0a',
      color: '#aaffaa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: 20,
    }}>
      <div style={{ marginBottom: 16 }}>⚔ 迷宮RPG — {config.map}</div>
      <div style={{ fontSize: 13, color: '#668866' }}>3秒後にノベルへ戻ります…</div>
    </div>
  );
}

const StubMazeEngine: IGameEngine<MazeConfig> = {
  component: StubMazeComponent,
};

const ASSETS_BASE = `${import.meta.env.BASE_URL}assets`;

export default function App() {
  return (
    <GameHub
      engines={{
        novel: NovelEngineAdapter,
        maze_rpg: StubMazeEngine,
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
