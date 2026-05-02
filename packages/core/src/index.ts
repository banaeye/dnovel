// @novel-engine/core — Public API

export { NovelApp } from './components/NovelApp';
export type { NovelAppProps, NovelAppConfig } from './components/NovelApp';

export { parseMasterData } from './loaders/dataLoader';
export type { MasterData, RawYamlInputs } from './loaders/dataLoader';

export { AssetProvider, useAssets } from './context/AssetContext';
export { GameStoreContext, useGameStore } from './context/GameStoreContext';

export { createGameStore } from './store/gameStore';
export type { GameStoreApi, GameStore, DebugStartConfig, GameStoreOptions } from './store/gameStore';

export type { EngineTransitionSpec } from './types/scene';
