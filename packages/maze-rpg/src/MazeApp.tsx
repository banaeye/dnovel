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

const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";

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

function HpRow({ hp, maxHp, theme }: { hp: number; maxHp: number; theme: Required<MazeTheme> }) {
  const pct = Math.max(0, Math.min(1, maxHp > 0 ? hp / maxHp : 0));
  const barColor = pct > 0.5 ? '#50c050' : pct > 0.25 ? '#c0a020' : '#e03030';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: theme.uiAccent }}>
        <span style={{ letterSpacing: '0.06em' }}>HP</span>
        <span style={{ opacity: 0.8 }}>{hp} / {maxHp}</span>
      </div>
      <div style={{ height: 6, background: '#2a2020', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: barColor, transition: 'width 0.3s', borderRadius: 3 }} />
      </div>
    </div>
  );
}

function NavButton({ label, theme, onClick }: { label: string; theme: Required<MazeTheme>; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        flex: 1,
        background: hover ? theme.uiBorder : '#1a1008',
        border: `1px solid ${hover ? theme.uiAccent : theme.uiBorder}`,
        color: theme.uiAccent,
        fontFamily: FONT,
        fontSize: 12,
        padding: '8px 4px',
        cursor: 'pointer',
        borderRadius: 3,
        userSelect: 'none',
        textAlign: 'center',
        transition: 'background 0.1s, border-color 0.1s',
      }}
    >
      {label}
    </button>
  );
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

  const [itemNotice, setItemNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useCallback((key: string) => {
    setState(prev => handleKey(prev, key));
  }, []);

  const handleUseItem = useCallback((itemId: string, itemName: string) => {
    const effect = config.itemEffects?.[itemId];
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

  useEffect(() => {
    if (!state.pendingDeath) return;
    const nr = config._novelReturn as Record<string, unknown> | undefined;
    if (!nr) return;

    if (state.pendingBossTilePos && nr.gameoverBossSceneId) {
      const updatedContext: GameContext = {
        ...context,
        flags: {
          ...context.flags,
          flag_maze_defeated: true,
          flag_boss_challenged: true,
        },
        inventory: state.inventory,
        playerStats: {
          ...context.playerStats,
          hp: 0,
          maxHp: state.playerMaxHp,
          atk: state.playerAtk,
          def: state.playerDef,
        },
      };
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
        config: {
          ...nr,
          initialSceneId: nr.gameoverLandingSceneId ?? nr.gameoverBossSceneId,
          autoStart: true,
        },
        returnEngineId: 'maze_rpg',
        returnConfig: bossRetryConfig,
      } as EngineTransition);
    } else if (nr.gameoverSceneId) {
      const updatedContext: GameContext = {
        ...context,
        flags: {
          ...context.flags,
          flag_maze_defeated: true,
        },
        inventory: state.inventory,
        playerStats: {
          ...context.playerStats,
          hp: 0,
          maxHp: state.playerMaxHp,
          atk: state.playerAtk,
          def: state.playerDef,
        },
      };
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
        config: {
          ...nr,
          initialSceneId: nr.gameoverLandingSceneId ?? nr.gameoverSceneId,
          autoStart: true,
        },
        returnEngineId: 'maze_rpg',
        returnConfig: retryConfig,
      } as EngineTransition);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pendingDeath]);

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
          fontFamily: FONT,
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
            letterSpacing: '0.06em',
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
              {/* 3D ビュー */}
              <div
                style={{
                  border: `2px solid ${theme.uiBorder}`,
                  boxShadow: '0 0 12px rgba(100,60,10,0.4)',
                  position: 'relative',
                }}
              >
                <MazeView state={state} theme={theme} />

                {state.battle && <EnemySprite enemy={state.battle.enemy} assetsBaseUrl={assetsBaseUrl} />}

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
                    fontFamily: FONT,
                    letterSpacing: '0.04em',
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
            {/* HP バー — 常時表示 */}
            <HpRow hp={state.playerHp} maxHp={state.playerMaxHp} theme={theme} />

            <div style={{ borderTop: `1px solid ${theme.uiBorder}`, flexShrink: 0 }} />

            {/* ミニマップ + コンパス — 横並び */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ border: `1px solid ${theme.uiBorder}` }}>
                <MiniMap state={state} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
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
                <div style={{ fontSize: 11, color: theme.uiAccent, letterSpacing: '0.05em' }}>
                  {DIR_LABEL[state.dir]}
                </div>
                <div style={{ fontSize: 9, color: theme.uiBorder, letterSpacing: '0.04em' }}>
                  ({state.pos.x},{state.pos.y})
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${theme.uiBorder}`, flexShrink: 0 }} />

            {/* バトル中 → BattleView / 探索中 → 方向ボタン */}
            {state.battle ? (
              <BattleView
                state={state}
                theme={theme}
                font={FONT}
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
                  <NavButton label="↑ 前進" theme={theme} onClick={() => dispatch('ArrowUp')} />
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <NavButton label="← 左"  theme={theme} onClick={() => dispatch('ArrowLeft')} />
                  <NavButton label="↓ 後退" theme={theme} onClick={() => dispatch('ArrowDown')} />
                  <NavButton label="→ 右"  theme={theme} onClick={() => dispatch('ArrowRight')} />
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
              font={FONT}
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
        fontFamily: FONT,
      }}
    >
      {label}
    </div>
  );
}

export const MazeRpgEngine: IGameEngine<MazeRpgConfig> = {
  component: MazeAppComponent,
};
