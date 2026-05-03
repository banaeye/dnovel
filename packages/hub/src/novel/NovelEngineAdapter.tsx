import { useCallback } from 'react';
import { NovelApp } from '@novel-engine/core';
import type { MasterData, ChapterConfig } from '@novel-engine/core';
import type { EngineTransitionSpec } from '@novel-engine/core';
import type { IGameEngine, EngineProps, GameContext, EngineTransition } from '../types';

export interface NovelAdapterConfig {
  masterData: MasterData;
  assetsBaseUrl: string;
  chapterId?: string;
  initialSceneId: string;
  initialLocationId: string;
  chapters?: ChapterConfig[];
  /** 別エンジンから戻った際に true を渡すとタイトルをスキップして直接開始する */
  autoStart?: boolean;
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
      chapterId?: string,
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
          ? { ...config, chapterId, initialSceneId: spec.return_scene, autoStart: true }
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
        chapterId: config.chapterId,
        chapters: config.chapters,
      }}
      initialFlags={context.flags}
      initialInventory={context.inventory}
      autoStart={config.autoStart}
      onEngineTransition={handleEngineTransition}
    />
  );
}

export const NovelEngineAdapter: IGameEngine<NovelAdapterConfig> = {
  component: NovelEngineComponent,
};
