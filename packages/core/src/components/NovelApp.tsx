import { useCallback, useEffect, useRef, useState } from 'react';
import { createGameStore } from '../store/gameStore';
import type { DebugStartConfig, GameStoreApi } from '../store/gameStore';
import { GameStoreContext, useGameStore } from '../context/GameStoreContext';
import { AssetProvider } from '../context/AssetContext';
import { useAudioStore } from '../store/audioStore';
import type { MasterData } from '../loaders/dataLoader';
import type { EngineTransitionSpec } from '../types/scene';
import { TitleScreen } from './system/TitleScreen';
import { GameScreen } from './game/GameScreen';
import './NovelApp.css';

const DEBUG_KEY = '__novel_debug_start__';

export interface NovelAppConfig {
  initialSceneId: string;
  initialLocationId: string;
}

export interface NovelAppProps {
  masterData: MasterData;
  assetsBaseUrl: string;
  config: NovelAppConfig;
  initialFlags?: Record<string, boolean | number | string>;
  initialInventory?: string[];
  /** true のときタイトル画面をスキップして initialSceneId から直接開始する */
  autoStart?: boolean;
  onEngineTransition?: (
    flags: Record<string, boolean | number | string>,
    inventory: string[],
    spec: EngineTransitionSpec,
  ) => void;
}

function useGameScale() {
  const getScale = () => {
    const fit = Math.min(window.innerWidth / 800, window.innerHeight / 600);
    return document.fullscreenElement ? fit : Math.min(1, fit);
  };
  const [scale, setScale] = useState(getScale);
  useEffect(() => {
    const update = () => setScale(getScale());
    window.addEventListener('resize', update);
    document.addEventListener('fullscreenchange', update);
    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('fullscreenchange', update);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return scale;
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  return { isFullscreen, toggle };
}

function GameContent({ onEngineTransition, autoStart }: {
  onEngineTransition?: (
    flags: Record<string, boolean | number | string>,
    inventory: string[],
    spec: EngineTransitionSpec,
  ) => void;
  autoStart?: boolean;
}) {
  const { state, startNewGame, startDebugGame, loadGame } = useGameStore();
  const { loadSettings } = useAudioStore();
  const scale = useGameScale();
  const { isFullscreen, toggle } = useFullscreen();

  const onEngineTransitionRef = useRef(onEngineTransition);
  onEngineTransitionRef.current = onEngineTransition;

  useEffect(() => {
    loadSettings();
    if (autoStart) {
      startNewGame();
      return;
    }
    const raw = localStorage.getItem(DEBUG_KEY);
    if (raw) {
      localStorage.removeItem(DEBUG_KEY);
      try {
        const config: DebugStartConfig = JSON.parse(raw);
        startDebugGame(config);
      } catch { /* ignore malformed */ }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.phase === 'engine_transition' && state.pendingEngineTransition) {
      onEngineTransitionRef.current?.(state.flags, state.inventory, state.pendingEngineTransition);
    }
  }, [state.phase, state.pendingEngineTransition]);

  return (
    <div className="app-wrapper">
      <div className="game-container" style={{ transform: `scale(${scale})` }}>
        {state.phase === 'title' ? (
          <TitleScreen onNewGame={startNewGame} onLoad={loadGame} />
        ) : (
          <GameScreen />
        )}
      </div>
      <button
        className="fullscreen-btn"
        onClick={toggle}
        title={isFullscreen ? '全画面解除' : '全画面表示'}
      >
        {isFullscreen ? '⊠' : '⛶'}
      </button>
    </div>
  );
}

export function NovelApp({
  masterData,
  assetsBaseUrl,
  config,
  initialFlags,
  initialInventory,
  autoStart,
  onEngineTransition,
}: NovelAppProps) {
  const storeRef = useRef<GameStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createGameStore(
      masterData,
      config.initialSceneId,
      config.initialLocationId,
      { initialFlags, initialInventory },
    );
  }

  const handleEngineTransition = useCallback(
    (
      flags: Record<string, boolean | number | string>,
      inventory: string[],
      spec: EngineTransitionSpec,
    ) => {
      onEngineTransition?.(flags, inventory, spec);
    },
    [onEngineTransition],
  );

  return (
    <AssetProvider assetsBaseUrl={assetsBaseUrl}>
      <GameStoreContext.Provider value={storeRef.current}>
        <GameContent onEngineTransition={handleEngineTransition} autoStart={autoStart} />
      </GameStoreContext.Provider>
    </AssetProvider>
  );
}
