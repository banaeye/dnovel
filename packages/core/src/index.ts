// @novel-engine/core — Public API

export { NovelApp } from '@engine-src/components/NovelApp';
export type { NovelAppProps, NovelAppConfig } from '@engine-src/components/NovelApp';

export { parseMasterData } from '@engine-src/loaders/dataLoader';
export type { MasterData, RawYamlInputs } from '@engine-src/loaders/dataLoader';

export { AssetProvider, useAssets } from '@engine-src/context/AssetContext';
export { GameStoreContext, useGameStore } from '@engine-src/context/GameStoreContext';

export { createGameStore } from '@engine-src/store/gameStore';
export type { GameStoreApi, DebugStartConfig } from '@engine-src/store/gameStore';
