import { useCallback } from 'react';
import { NovelApp } from '@novel-engine/core';
import type { MasterData } from '@novel-engine/core';
import type { EngineTransitionSpec } from '@novel-engine/core';
import type { IGameEngine, EngineProps, GameContext, EngineTransition } from '../types';

export interface NovelAdapterConfig {
  masterData: MasterData;
  assetsBaseUrl: string;
  initialSceneId: string;
  initialLocationId: string;
}

function NovelEngineComponent({
  context,
  config,
  onExit,
}: EngineProps<NovelAdapterConfig>) {
  const handleEngineTransition = useCallback(
    (
      flags: Record<string, boolean | number | string>,
      inventory: string[],
      spec: EngineTransitionSpec,
    ) => {
      const updatedContext: GameContext = {
        flags,
        inventory,
        playerStats: context.playerStats,
      };
      const transition: EngineTransition = {
        engineId: spec.id,
        config: spec.config,
        returnEngineId: spec.return_scene ? 'novel' : undefined,
        returnConfig: spec.return_scene
          ? { ...config, initialSceneId: spec.return_scene }
          : undefined,
      };
      onExit(updatedContext, transition);
    },
    [context.playerStats, config, onExit],
  );

  return (
    <NovelApp
      masterData={config.masterData}
      assetsBaseUrl={config.assetsBaseUrl}
      config={{
        initialSceneId: config.initialSceneId,
        initialLocationId: config.initialLocationId,
      }}
      initialFlags={context.flags}
      initialInventory={context.inventory}
      onEngineTransition={handleEngineTransition}
    />
  );
}

export const NovelEngineAdapter: IGameEngine<NovelAdapterConfig> = {
  component: NovelEngineComponent,
};
