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
      // '__return__' は迷路内イベントからの帰還専用センチネル
      if (spec.id === '__return__') {
        onExit(updatedContext);
        return;
      }
      // 遷移先エンジンに assetsBaseUrl・アイテム一覧・_novelReturn を自動注入
      const itemDefs = Object.values(config.masterData.items).map(item => ({
        id: item.id,
        name: item.name,
        usable: item.usable,
      }));
      const _novelReturn = {
        masterData:        config.masterData,
        assetsBaseUrl:     config.assetsBaseUrl,
        chapterId,
        initialLocationId: config.initialLocationId,
        chapters:          config.chapters,
        exitSceneId:          spec.return_scene,
        gameoverSceneId:      spec.gameover_scene,
        gameoverBossSceneId:  spec.gameover_boss_scene,
      };
      const transition: EngineTransition = {
        engineId: spec.id,
        config: {
          assetsBaseUrl: config.assetsBaseUrl,
          items: itemDefs,
          ...(spec.config as object ?? {}),
          _novelReturn,
        },
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
