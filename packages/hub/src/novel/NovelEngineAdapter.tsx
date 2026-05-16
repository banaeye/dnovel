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
        description: item.description,
        category: item.category,
      }));

      // playerCharacterId / opponentCharacterId をキャラクター定義から自動解決
      const specConfig = (spec.config as Record<string, unknown>) ?? {};

      // 迷路マップ ID が分かれば、以前の探索済みセットをフラグから復元する
      const mapId = typeof specConfig.map === 'string' ? specConfig.map : null;
      const parseJsonArray = (raw: unknown): string[] | undefined => {
        if (typeof raw !== 'string' || !raw) return undefined;
        try { return JSON.parse(raw) as string[]; } catch { return undefined; }
      };
      const parseSavedPos = (raw: unknown): { x: number; y: number } | undefined => {
        if (typeof raw !== 'string' || !raw) return undefined;
        try {
          const parsed = JSON.parse(raw) as { x?: unknown; y?: unknown };
          return typeof parsed.x === 'number' && typeof parsed.y === 'number'
            ? { x: parsed.x, y: parsed.y }
            : undefined;
        } catch {
          return undefined;
        }
      };
      const parseSavedDir = (raw: unknown): 'N' | 'E' | 'S' | 'W' | undefined => (
        raw === 'N' || raw === 'E' || raw === 'S' || raw === 'W' ? raw : undefined
      );
      const savedVisited  = mapId ? parseJsonArray(flags[`maze_visited_${mapId}`])  : undefined;
      const savedTriggered = mapId ? parseJsonArray(flags[`maze_triggered_${mapId}`]) : undefined;
      const savedOpenedSeals = mapId ? parseJsonArray(flags[`maze_opened_seals_${mapId}`]) : undefined;
      const savedOpenedTreasures = mapId ? parseJsonArray(flags[`maze_opened_treasures_${mapId}`]) : undefined;
      const savedPos = mapId ? parseSavedPos(flags[`maze_pos_${mapId}`]) : undefined;
      const savedDir = mapId ? parseSavedDir(flags[`maze_dir_${mapId}`]) : undefined;
      const savedFloor = mapId && typeof flags[`maze_floor_${mapId}`] === 'number'
        ? flags[`maze_floor_${mapId}`] as number
        : undefined;
      const resolvedCharFields: Record<string, unknown> = {};
      const resolveChar = (charId: unknown, prefix: 'player' | 'opponent') => {
        if (typeof charId !== 'string') return;
        const char = config.masterData.characters[charId];
        if (!char) return;
        resolvedCharFields[`${prefix}Name`] = char.name;
        const sprite = char.sprites?.normal ?? (char.sprites ? Object.values(char.sprites)[0] : undefined);
        if (sprite) resolvedCharFields[`${prefix}FaceImage`] = sprite;
        if (char.voicevox_speaker_id) resolvedCharFields[`${prefix}VoicevoxSpeakerId`] = char.voicevox_speaker_id;
      };
      resolveChar(specConfig.playerCharacterId, 'player');
      resolveChar(specConfig.opponentCharacterId, 'opponent');

      const _novelReturn = {
        masterData:        config.masterData,
        assetsBaseUrl:     config.assetsBaseUrl,
        chapterId,
        initialLocationId: config.initialLocationId,
        chapters:          config.chapters,
        exitSceneId:          spec.return_scene,
        gameoverSceneId:      spec.gameover_scene,
        gameoverBossSceneId:  spec.gameover_boss_scene,
        gameoverLandingSceneId: spec.gameover_landing_scene,
      };
      const transition: EngineTransition = {
        engineId: spec.id,
        transition: spec.transition,
        config: {
          assetsBaseUrl: config.assetsBaseUrl,
          items: itemDefs,
          ...resolvedCharFields,          // キャラ定義から解決した値（YAMLで明示すれば上書き可）
          // 以前の探索済みセットを自動復元（YAML側で明示すれば上書き可）
          ...(savedFloor !== undefined ? { initialFloor: savedFloor } : {}),
          ...(savedPos ? { initialPos: savedPos } : {}),
          ...(savedDir ? { initialDir: savedDir } : {}),
          ...(savedVisited   ? { initialVisited:         savedVisited   } : {}),
          ...(savedTriggered ? { initialTriggeredEvents: savedTriggered } : {}),
          ...(savedOpenedSeals ? { initialOpenedSeals: savedOpenedSeals } : {}),
          ...(savedOpenedTreasures ? { initialOpenedTreasures: savedOpenedTreasures } : {}),
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
