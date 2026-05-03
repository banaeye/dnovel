import { useCallback, useEffect, useRef, useState } from 'react';
import { createGameStore } from '../store/gameStore';
import type { DebugStartConfig, GameStoreApi } from '../store/gameStore';
import { GameStoreContext, useGameStore } from '../context/GameStoreContext';
import { AssetProvider } from '../context/AssetContext';
import { useAudioStore } from '../store/audioStore';
import type { MasterData } from '../loaders/dataLoader';
import type { SaveData } from '../storage/StorageInterface';
import type { EngineTransitionSpec } from '../types/scene';
import type { ChapterConfig } from '../types/chapter';
import { TitleScreen } from './system/TitleScreen';
import { GameScreen } from './game/GameScreen';
import './NovelApp.css';

const DEBUG_KEY = '__novel_debug_start__';

export interface NovelAppConfig {
  chapterId?: string;
  initialSceneId: string;
  initialLocationId: string;
  chapters?: ChapterConfig[];
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
    chapterId?: string,
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

function GameContent({
  onEngineTransition,
  autoStart,
  chapters,
  onNewGame,
  onStartChapter,
  onLoadGame,
  chapterId,
}: {
  onEngineTransition?: (
    flags: Record<string, boolean | number | string>,
    inventory: string[],
    spec: EngineTransitionSpec,
    chapterId?: string,
  ) => void;
  autoStart?: boolean;
  chapters?: ChapterConfig[];
  onNewGame: () => void;
  onStartChapter: (chapter: ChapterConfig) => void;
  onLoadGame: (saveData: SaveData) => void;
  chapterId: string;
}) {
  const { state, startNewGame, startDebugGame } = useGameStore();
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
      onEngineTransitionRef.current?.(state.flags, state.inventory, state.pendingEngineTransition, chapterId);
    }
  }, [state.phase, state.pendingEngineTransition, chapterId]);

  return (
    <div className="app-wrapper">
      <div className="game-container" style={{ transform: `scale(${scale})` }}>
        {state.phase === 'title' ? (
          <TitleScreen
            onNewGame={onNewGame}
            onLoad={onLoadGame}
            chapters={chapters}
            onStartChapter={onStartChapter}
          />
        ) : (
          <GameScreen onLoadGame={onLoadGame} />
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
  const chapters = config.chapters ?? [];
  const defaultChapter: ChapterConfig = chapters.find((chapter) => chapter.id === (config.chapterId ?? 'chapter1'))
    ?? chapters[0]
    ?? {
      id: config.chapterId ?? 'chapter1',
      title: '本編',
      masterData,
      initialSceneId: config.initialSceneId,
      initialLocationId: config.initialLocationId,
      initialFlags,
    };

  function createStoreForChapter(
    chapter: ChapterConfig,
    flags?: Record<string, boolean | number | string>,
    inventory?: string[],
  ): GameStoreApi {
    return createGameStore(
      chapter.masterData,
      chapter.initialSceneId,
      chapter.initialLocationId,
      {
        chapterId: chapter.id,
        initialFlags: flags,
        initialInventory: inventory,
      },
    );
  }

  const [storeEntry, setStoreEntry] = useState(() => ({
    key: 0,
    chapter: defaultChapter,
    store: createStoreForChapter(defaultChapter, initialFlags, initialInventory),
  }));

  function startChapter(chapter: ChapterConfig) {
    const flags = {
      ...(chapter.unlockFlag ? { [chapter.unlockFlag]: true } : {}),
      ...(chapter.initialFlags ?? {}),
    };
    const store = createStoreForChapter(chapter, flags, []);
    store.getState().startNewGame();
    setStoreEntry((prev) => ({ key: prev.key + 1, chapter, store }));
  }

  function startDefaultChapter() {
    startChapter(defaultChapter);
  }

  function loadGameByChapter(saveData: SaveData) {
    const chapterId = saveData.chapterId ?? 'chapter1';
    const chapter = chapters.find((candidate) => candidate.id === chapterId) ?? defaultChapter;
    const store = createStoreForChapter(chapter, saveData.flags, saveData.inventory);
    store.getState().loadGame({ ...saveData, chapterId: chapter.id });
    setStoreEntry((prev) => ({ key: prev.key + 1, chapter, store }));
  }

  const handleEngineTransition = useCallback(
    (
      flags: Record<string, boolean | number | string>,
      inventory: string[],
      spec: EngineTransitionSpec,
      chapterId?: string,
    ) => {
      onEngineTransition?.(flags, inventory, spec, chapterId);
    },
    [onEngineTransition],
  );

  return (
    <AssetProvider assetsBaseUrl={assetsBaseUrl}>
      <GameStoreContext.Provider value={storeEntry.store}>
        <GameContent
          key={storeEntry.key}
          onEngineTransition={handleEngineTransition}
          autoStart={autoStart}
          chapters={chapters}
          onNewGame={startDefaultChapter}
          onStartChapter={startChapter}
          onLoadGame={loadGameByChapter}
          chapterId={storeEntry.chapter.id}
        />
      </GameStoreContext.Provider>
    </AssetProvider>
  );
}
