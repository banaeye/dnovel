import { useCallback, useEffect, useRef, useState } from 'react';
import type { IGameEngine, EngineProps, GameContext, EngineTransition } from '@novel-engine/hub';
import { initMaze, handleKey, useItemInMaze } from './engine/mazeEngine.js';
import type { ItemEffect } from './engine/mazeEngine.js';
import type { Vec2, Dir } from './engine/types.js';
import { MazeView } from './components/MazeView.js';
import { MiniMap } from './components/MiniMap.js';
import { BattleView } from './components/BattleView.js';
import { EnemySprite } from './components/EnemySprite.js';
import { ItemPanel } from './components/ItemPanel.js';
import type { MazeItemDef } from './components/ItemPanel.js';

export type { MazeItemDef };

export interface MazeTheme {
  /** 天井グラデーション上端色 @default '#020213' */
  ceilTop?: string;
  /** 天井グラデーション下端色 @default '#0d0d25' */
  ceilBottom?: string;
  /** 床グラデーション上端色 @default '#130a02' */
  floorTop?: string;
  /** 床グラデーション下端色 @default '#060300' */
  floorBottom?: string;
  /** 前面壁の基本色 (hex) @default '#9a7420' */
  wallFront?: string;
  /** 側面壁の基本色 (hex) @default '#5a420a' */
  wallSide?: string;
  /** メインフレーム背景色 @default '#080504' */
  uiBg?: string;
  /** テキスト・UI のアクセントカラー @default '#ccaa66' */
  uiAccent?: string;
  /** ボーダー色 @default '#443322' */
  uiBorder?: string;
}

const DEFAULT_THEME: Required<MazeTheme> = {
  ceilTop:    '#020213',
  ceilBottom: '#0d0d25',
  floorTop:   '#130a02',
  floorBottom:'#060300',
  wallFront:  '#9a7420',
  wallSide:   '#5a420a',
  uiBg:       '#080504',
  uiAccent:   '#ccaa66',
  uiBorder:   '#443322',
};

function mergeTheme(t?: MazeTheme): Required<MazeTheme> {
  if (!t) return DEFAULT_THEME;
  return { ...DEFAULT_THEME, ...t };
}

export interface MazeRpgConfig {
  map: string;
  /** タイトルバーに表示する名前（省略時は map ID） */
  name?: string;
  theme?: MazeTheme;
  /** 敵画像などのアセットベース URL（省略時は '/assets'） */
  assetsBaseUrl?: string;
  /** インベントリに表示するアイテム情報（NovelEngineAdapter が自動注入） */
  items?: MazeItemDef[];
  /** イベントタイル文字 → novel scene ID（例: { E: 'scene_maze_event_01' }） */
  events?: Record<string, string>;
  /** resume 用: 再開座標・向き・探索済みセット・発火済みイベント */
  initialPos?: Vec2;
  initialDir?: Dir;
  initialVisited?: string[];
  initialTriggeredEvents?: string[];
  /** アイテム効果定義（例: { item_candy: { healHp: 'full' } }） */
  itemEffects?: Record<string, ItemEffect>;
  /** NovelEngineAdapter が注入するオペーク型。出口帰還・イベント遷移に使用 */
  _novelReturn?: unknown;
}

const DIR_LABEL: Record<string, string> = { N: '北', E: '東', S: '南', W: '西' };

function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / 800, window.innerHeight / 600));
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const update = () => setScale(get());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return scale;
}

function navBtnStyle(theme: Required<MazeTheme>): React.CSSProperties {
  return {
    background: '#1a1008',
    border: `1px solid ${theme.uiBorder}`,
    color: theme.uiAccent,
    fontFamily: 'monospace',
    fontSize: 12,
    padding: '6px 8px',
    cursor: 'pointer',
    borderRadius: 2,
    userSelect: 'none',
    flex: 1,
    textAlign: 'center',
  };
}

function MazeAppComponent({ context, config, onExit }: EngineProps<MazeRpgConfig>) {
  const scale = useGameScale();
  const [state, setState] = useState(() =>
    initMaze(config.map, context.playerStats, context.inventory, {
      initialPos:             config.initialPos,
      initialDir:             config.initialDir,
      initialVisited:         config.initialVisited,
      initialTriggeredEvents: config.initialTriggeredEvents,
    }),
  );
  const theme = mergeTheme(config.theme);
  const assetsBaseUrl = config.assetsBaseUrl ?? '/assets';

  // アイテム使用時の探索モード通知（バトル中は battle.log に入るので不要）
  const [itemNotice, setItemNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useCallback((key: string) => {
    setState(prev => handleKey(prev, key));
  }, []);

  const handleUseItem = useCallback((itemId: string, itemName: string) => {
    const effect = config.itemEffects?.[itemId];
    // 敵攻撃専用アイテムはバトル外では使えない
    if (effect?.attackEnemy !== undefined && !state.battle) return;
    setState(prev => useItemInMaze(prev, itemId, itemName, effect));
    if (!state.battle) {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      const notice = effect?.healHp === 'full'
        ? `${itemName}を使った！ HP全回復！`
        : typeof effect?.healHp === 'number'
          ? `${itemName}を使った！ HP+${effect.healHp}！`
          : `${itemName}を使った！`;
      setItemNotice(notice);
      noticeTimerRef.current = setTimeout(() => setItemNotice(null), 2500);
    }
  }, [config.itemEffects, state.battle]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
      }
      setState(prev => handleKey(prev, e.key));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const buildUpdatedContext = useCallback((): GameContext => ({
    ...context,
    flags: { ...context.flags, [`explored_${config.map}`]: true },
    inventory: state.inventory,
    playerStats: {
      ...context.playerStats,
      hp: state.playerHp,
      maxHp: state.playerMaxHp,
      atk: state.playerAtk,
      def: state.playerDef,
    },
  }), [context, config.map, state.inventory, state.playerHp, state.playerMaxHp, state.playerAtk, state.playerDef]);

  const triggerExit = useCallback(() => {
    const updatedContext = buildUpdatedContext();
    const nr = config._novelReturn as Record<string, unknown> | undefined;
    if (nr?.exitSceneId) {
      onExit(updatedContext, {
        engineId: 'novel',
        config: { ...nr, initialSceneId: nr.exitSceneId, autoStart: true },
      } as EngineTransition);
    } else {
      onExit(updatedContext);
    }
  }, [buildUpdatedContext, config._novelReturn, onExit]);

  // 全滅時にノベルの gameover シーンへ遷移（ボス死亡と通常死亡で分岐）
  useEffect(() => {
    if (!state.pendingDeath) return;
    const nr = config._novelReturn as Record<string, unknown> | undefined;
    if (!nr) return;

    const updatedContext: GameContext = {
      ...context,
      inventory: state.inventory,
      playerStats: {
        ...context.playerStats,
        hp: 0,
        maxHp: state.playerMaxHp,
        atk: state.playerAtk,
        def: state.playerDef,
      },
    };

    if (state.pendingBossTilePos && nr.gameoverBossSceneId) {
      // ボス戦死亡 → ボスの直前座標から再開できる retry config
      const [bx, by] = state.pendingBossTilePos.split(',').map(Number);
      const bossRetryConfig: MazeRpgConfig = {
        map:          config.map,
        name:         config.name,
        theme:        config.theme,
        assetsBaseUrl: config.assetsBaseUrl,
        items:        config.items,
        events:       config.events,
        itemEffects:  config.itemEffects,
        _novelReturn: config._novelReturn,
        initialPos:             { x: (bx ?? 0) - 1, y: by ?? 0 },
        initialDir:             'E',
        initialVisited:         [...state.visited],
        initialTriggeredEvents: [...state.triggeredEvents],
      };
      onExit(updatedContext, {
        engineId: 'novel',
        config: { ...nr, initialSceneId: nr.gameoverBossSceneId, autoStart: true },
        returnEngineId: 'maze_rpg',
        returnConfig: bossRetryConfig,
      } as EngineTransition);
    } else if (nr.gameoverSceneId) {
      // 通常死亡 → 最初からの retry config
      const retryConfig: MazeRpgConfig = {
        map:          config.map,
        name:         config.name,
        theme:        config.theme,
        assetsBaseUrl: config.assetsBaseUrl,
        items:        config.items,
        events:       config.events,
        itemEffects:  config.itemEffects,
        _novelReturn: config._novelReturn,
      };
      onExit(updatedContext, {
        engineId: 'novel',
        config: { ...nr, initialSceneId: nr.gameoverSceneId, autoStart: true },
        returnEngineId: 'maze_rpg',
        returnConfig: retryConfig,
      } as EngineTransition);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pendingDeath]);

  // イベントタイルを踏んだときにノベルシーンへ遷移
  useEffect(() => {
    if (!state.pendingEvent) return;
    const sceneId = config.events?.[state.pendingEvent];
    const nr = config._novelReturn as Record<string, unknown> | undefined;
    if (!sceneId || !nr) return;

    const updatedContext = buildUpdatedContext();
    const posKey = `${state.pos.x},${state.pos.y}`;
    const resumeConfig: MazeRpgConfig = {
      ...config,
      initialPos:             state.pos,
      initialDir:             state.dir,
      initialVisited:         [...state.visited],
      initialTriggeredEvents: [...state.triggeredEvents, posKey],
    };
    onExit(updatedContext, {
      engineId: 'novel',
      config: { ...nr, initialSceneId: sceneId, autoStart: true },
      returnEngineId: 'maze_rpg',
      returnConfig: resumeConfig,
    } as EngineTransition);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pendingEvent]);

  const handleExitKey = useCallback(
    (e: KeyboardEvent) => {
      if (!state.atExit) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      triggerExit();
    },
    [state.atExit, triggerExit],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleExitKey);
    return () => window.removeEventListener('keydown', handleExitKey);
  }, [handleExitKey]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.uiBg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 800,
          height: 600,
          flexShrink: 0,
          transformOrigin: 'center center',
          transform: `scale(${scale})`,
          background: theme.uiBg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'monospace',
          color: theme.uiAccent,
          userSelect: 'none',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* タイトルバー */}
        <div
          style={{
            background: theme.uiBorder,
            borderBottom: `1px solid ${theme.uiBorder}`,
            padding: '4px 12px',
            fontSize: 13,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span>⚔ {config.name ?? config.map}</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>歩数: {state.steps}</span>
        </div>

        {/* メインエリア */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* 左: 3D ビューのみ */}
          <div
            style={{
              flex: '0 0 488px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* 3D ビュー — 常に表示 */}
              <div
                style={{
                  border: `2px solid ${theme.uiBorder}`,
                  boxShadow: '0 0 12px rgba(100,60,10,0.4)',
                  position: 'relative',
                }}
              >
                <MazeView state={state} theme={theme} />

                {/* 敵グラフィックオーバーレイ（バトル中） */}
                {state.battle && <EnemySprite enemy={state.battle.enemy} assetsBaseUrl={assetsBaseUrl} />}

                {/* クリックゾーン（探索中のみ） */}
                {!state.battle && !state.atExit && (
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                    <div title="左回転" style={{ cursor: 'w-resize' }} onClick={() => dispatch('ArrowLeft')} />
                    <div title="前進"   style={{ cursor: 'n-resize' }} onClick={() => dispatch('ArrowUp')} />
                    <div title="右回転" style={{ cursor: 'e-resize' }} onClick={() => dispatch('ArrowRight')} />
                    <div title="左回転" style={{ cursor: 'w-resize' }} onClick={() => dispatch('ArrowLeft')} />
                    <div title="後退"   style={{ cursor: 's-resize' }} onClick={() => dispatch('ArrowDown')} />
                    <div title="右回転" style={{ cursor: 'e-resize' }} onClick={() => dispatch('ArrowRight')} />
                  </div>
                )}
              </div>

              {/* 出口パネル */}
              {state.atExit && (
                <div
                  onClick={triggerExit}
                  style={{
                    marginTop: 8,
                    background: '#1a2a0a',
                    border: '1px solid #44aa22',
                    borderRadius: 4,
                    padding: '8px 16px',
                    color: '#88ff44',
                    fontSize: 14,
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  階段を見つけた！ [Enter] / クリックで地上へ戻る
                </div>
              )}
            </div>
          </div>

          {/* 右: コントロールパネル */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${theme.uiBorder}`,
              padding: '10px 10px 8px',
              gap: 8,
              overflow: 'hidden',
            }}
          >
            {/* コンパス */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 24px 24px',
                  gridTemplateRows: '24px 24px 24px',
                  gap: 2,
                  textAlign: 'center',
                }}
              >
                {['', 'N', ''].map((d, i) => <CompassCell key={`t${i}`} label={d} dir={state.dir} theme={theme} />)}
                {['W', '', 'E'].map((d, i) => <CompassCell key={`m${i}`} label={d} dir={state.dir} theme={theme} />)}
                {['', 'S', ''].map((d, i) => <CompassCell key={`b${i}`} label={d} dir={state.dir} theme={theme} />)}
              </div>
              <div style={{ fontSize: 11, color: theme.uiAccent }}>
                向き: {DIR_LABEL[state.dir]}
              </div>
            </div>

            {/* ミニマップ */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ border: `1px solid ${theme.uiBorder}` }}>
                <MiniMap state={state} />
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>
                ({state.pos.x}, {state.pos.y})
              </div>
            </div>

            {/* セパレーター */}
            <div style={{ borderTop: `1px solid ${theme.uiBorder}`, flexShrink: 0 }} />

            {/* コマンド: バトル中 = バトルパネル / 探索中 = 方向ボタン */}
            {state.battle ? (
              <BattleView
                state={state}
                theme={theme}
                onSelectCommand={i => setState(prev => {
                  if (!prev.battle || prev.battle.phase !== 'select') return prev;
                  return { ...prev, battle: { ...prev.battle, cursorIndex: i } };
                })}
                onCommand={i => setState(prev => {
                  if (!prev.battle || prev.battle.phase !== 'select') return prev;
                  const withCursor = { ...prev, battle: { ...prev.battle, cursorIndex: i } };
                  return handleKey(withCursor, 'Enter');
                })}
                onAdvance={() => dispatch('Enter')}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex' }}>
                  <button onClick={() => dispatch('ArrowUp')} style={{ ...navBtnStyle(theme) }}>↑ 前進</button>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => dispatch('ArrowLeft')}  style={navBtnStyle(theme)}>← 左</button>
                  <button onClick={() => dispatch('ArrowDown')}  style={navBtnStyle(theme)}>↓ 後退</button>
                  <button onClick={() => dispatch('ArrowRight')} style={navBtnStyle(theme)}>→ 右</button>
                </div>
              </div>
            )}

            {/* アイテムパネル */}
            <ItemPanel
              inventory={state.inventory}
              itemDefs={config.items ?? []}
              theme={theme}
              onUse={handleUseItem}
              notification={itemNotice ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompassCell({ label, dir, theme }: { label: string; dir: string; theme: Required<MazeTheme> }) {
  const active = label === dir;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? theme.uiBorder : label ? theme.uiBg : 'transparent',
        border: label ? `1px solid ${active ? theme.uiAccent : theme.uiBorder}` : 'none',
        borderRadius: 2,
        color: active ? theme.uiAccent : theme.uiBorder,
        fontWeight: active ? 'bold' : 'normal',
        fontSize: 10,
      }}
    >
      {label}
    </div>
  );
}

export const MazeRpgEngine: IGameEngine<MazeRpgConfig> = {
  component: MazeAppComponent,
};
