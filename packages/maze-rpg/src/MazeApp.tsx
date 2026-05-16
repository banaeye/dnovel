import { useCallback, useEffect, useRef, useState } from 'react';
import type { IGameEngine, EngineProps, GameContext, EngineTransition } from '@novel-engine/hub';
import { getFacingTreasure, getStairDirection, initMaze, handleKey, openFacingTreasure, useItemInMaze } from './engine/mazeEngine.js';
import type { ItemEffect } from './engine/mazeEngine.js';
import type { Vec2, Dir, MazeEnemyConfig, MazeSealConfig, MazeTreasureConfig } from './engine/types.js';
import { MazeView } from './components/MazeView.js';
import { MiniMap } from './components/MiniMap.js';
import { BattleView } from './components/BattleView.js';
import { EnemySprite } from './components/EnemySprite.js';
import { ItemPanel } from './components/ItemPanel.js';
import type { MazeItemDef } from './components/ItemPanel.js';
import type { MiniMapMode } from './components/MiniMap.js';

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
  /** 壁の朽ち具合。0 = きれい, 1 = かなり朽ちている @default 0 */
  wallDamage?: number;
  /** 壁の染み・苔・霊気の色 @default '#1b1208' */
  wallStain?: string;
  /** 霧の色 @default '#d8e8ff' */
  mistColor?: string;
  /** 霧の濃さ。0 = なし, 1 = 濃い霧 @default 0 */
  mistDensity?: number;
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
  wallDamage: 0,
  wallStain:  '#1b1208',
  mistColor:  '#d8e8ff',
  mistDensity: 0,
};

function mergeTheme(t?: MazeTheme): Required<MazeTheme> {
  if (!t) return DEFAULT_THEME;
  return { ...DEFAULT_THEME, ...t };
}

function floorThemeKey(floor: number): string[] {
  const oneBased = floor + 1;
  return [String(oneBased), `${oneBased}F`, `B${oneBased}F`, String(floor)];
}

function mergeFloorTheme(base: MazeTheme | undefined, floorThemes: Record<string, MazeTheme> | undefined, floor: number): Required<MazeTheme> {
  const floorTheme = floorThemeKey(floor)
    .map(key => floorThemes?.[key])
    .find((theme): theme is MazeTheme => !!theme);
  return mergeTheme({ ...base, ...floorTheme });
}

function mazeResumePositionFlags(mapId: string, pos: Vec2, dir: Dir): Record<string, string> {
  return {
    [`maze_pos_${mapId}`]: JSON.stringify(pos),
    [`maze_dir_${mapId}`]: dir,
  };
}

export interface MazeRpgConfig {
  map: string;
  /** タイトルバーに表示する名前（省略時は map ID） */
  name?: string;
  /** 表示上の階層開始番号。7なら内部0階を7Fとして表示する */
  floorLabelStart?: number;
  /** 階層表示の接頭辞。省略時は 'B' */
  floorLabelPrefix?: string;
  theme?: MazeTheme;
  /** 階層ごとのテーマ。キーは "1" / "1F" / "B1F" のいずれも可 */
  floorThemes?: Record<string, MazeTheme>;
  /** 敵画像などのアセットベース URL（省略時は '/assets'） */
  assetsBaseUrl?: string;
  /** 探索中に流れる BGM（assetsBaseUrl 相対パス, 例: 'audio/bgm/dungeon.mp3'） */
  bgm?: string;
  /** バトル中に流れる BGM（省略時は bgm を継続） */
  battleBgm?: string;
  /** ミニマップ表示。'visited' なら通ったマスだけを表示する（省略時は 'full'） */
  minimapMode?: MiniMapMode;
  /** インベントリに表示するアイテム情報（NovelEngineAdapter が自動注入） */
  items?: MazeItemDef[];
  /** イベントタイル文字 → novel scene ID（例: { E: 'scene_maze_event_01' }） */
  events?: Record<string, string>;
  /** ボスをマップ既定値から上書きする */
  boss?: MazeEnemyConfig;
  /** 指定フラグが true のときに使う弱体化ボス */
  weakenedBoss?: MazeEnemyConfig;
  weakenedBossFlag?: string;
  /** 指定フラグが true のとき、迷宮開始時の主人公能力を上書きする */
  boostedStatsFlag?: string;
  boostedPlayerStats?: Record<string, number>;
  /** 複数段階の能力上書き。後ろの段階ほど優先される */
  boostedStatStages?: Array<{ flag: string; stats: Record<string, number> }>;
  /** 封印ギミック定義: switchTile を踏むと doorTile が通行可能になる */
  seals?: Record<string, MazeSealConfig>;
  /** 宝箱定義: タイル文字 → 入手アイテム */
  treasures?: Record<string, MazeTreasureConfig>;
  /** resume 用: 再開座標・向き・探索済みセット・発火済みイベント */
  initialPos?: Vec2;
  initialDir?: Dir;
  initialFloor?: number;
  initialVisited?: string[];
  initialTriggeredEvents?: string[];
  initialOpenedSeals?: string[];
  initialOpenedTreasures?: string[];
  /** アイテム効果定義（例: { item_candy: { healHp: 'full' } }） */
  itemEffects?: Record<string, ItemEffect>;
  /** NovelEngineAdapter が注入するオペーク型。出口帰還・イベント遷移に使用 */
  _novelReturn?: unknown;
}

const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";

const DIR_LABEL: Record<string, string> = { N: '北', E: '東', S: '南', W: '西' };

function floorLabel(config: MazeRpgConfig, floor: number): string {
  const n = (config.floorLabelStart ?? 1) + floor;
  const prefix = config.floorLabelPrefix ?? 'B';
  return `${prefix}${n}F`;
}

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

function useMazeBgm(assetsBaseUrl: string, bgm: string | undefined, battleBgm: string | undefined, inBattle: boolean) {
  const activeBgm = inBattle && battleBgm ? battleBgm : bgm;

  useEffect(() => {
    if (!activeBgm) return;
    const url = `${assetsBaseUrl.replace(/\/$/, '')}/${activeBgm}`;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(() => {/* autoplay policy or file not found */});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  // activeBgm が bgm/battleBgm/inBattle の変化を集約する
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBgm, assetsBaseUrl]);
}

function selectBoss(config: MazeRpgConfig, flags: GameContext['flags']): MazeEnemyConfig | undefined {
  if (config.weakenedBoss && config.weakenedBossFlag && flags[config.weakenedBossFlag] === true) {
    return config.weakenedBoss;
  }
  return config.boss;
}

function selectPlayerStats(config: MazeRpgConfig, context: GameContext): Record<string, number> {
  const matchedStage = config.boostedStatStages
    ?.filter(stage => context.flags[stage.flag] === true)
    .at(-1);
  if (matchedStage) {
    return { ...context.playerStats, ...matchedStage.stats };
  }
  if (config.boostedPlayerStats && config.boostedStatsFlag && context.flags[config.boostedStatsFlag] === true) {
    return { ...context.playerStats, ...config.boostedPlayerStats };
  }
  return context.playerStats;
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

function HealSparkleEffect() {
  const sparkles = [
    { left: '22%', top: '62%', delay: '0ms', size: 8 },
    { left: '33%', top: '36%', delay: '90ms', size: 5 },
    { left: '46%', top: '68%', delay: '170ms', size: 7 },
    { left: '57%', top: '32%', delay: '40ms', size: 6 },
    { left: '70%', top: '56%', delay: '130ms', size: 9 },
    { left: '39%', top: '48%', delay: '230ms', size: 5 },
    { left: '62%', top: '72%', delay: '280ms', size: 6 },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 6,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '56%',
          width: 250,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(180,255,190,0.45) 0%, rgba(120,255,170,0.16) 45%, transparent 72%)',
          boxShadow: '0 0 36px rgba(150,255,190,0.6)',
          transform: 'translate(-50%, -50%)',
          animation: 'maze-heal-aura 900ms ease-out forwards',
        }}
      />
      {sparkles.map((sparkle, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            transform: 'translate(-50%, -50%) rotate(45deg)',
            background: '#f4ffe1',
            boxShadow: '0 0 10px #d8ff95, 0 0 18px rgba(120,255,170,0.9)',
            animation: `maze-heal-sparkle 780ms ease-out ${sparkle.delay} forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

function sealColor(sealId?: string): string {
  switch (sealId) {
    case 'red': return '#ff6b6b';
    case 'green': return '#66f08a';
    case 'purple': return '#c080ff';
    default: return '#ffd86b';
  }
}

function SealUnlockEffect({ sealId, label }: { sealId?: string; label?: string }) {
  const color = sealColor(sealId);
  const title = label ?? '霊符';
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${color}55 0%, ${color}22 25%, transparent 58%)`,
          animation: 'maze-seal-screen-flash 1150ms ease-out forwards',
        }}
      />
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 92 + i * 34,
            height: 92 + i * 34,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            boxShadow: `0 0 18px ${color}`,
            animation: `maze-seal-ring 1050ms ease-out ${i * 90}ms forwards`,
            opacity: 0,
          }}
        />
      ))}
      <div
        style={{
          position: 'relative',
          width: 118,
          height: 156,
          borderRadius: 6,
          border: `2px solid ${color}`,
          background: `linear-gradient(180deg, rgba(255,255,230,0.94), ${color}33)`,
          boxShadow: `0 0 28px ${color}, inset 0 0 22px ${color}55`,
          color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          animation: 'maze-seal-card 1150ms ease-out forwards',
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>封</div>
        <div style={{ fontSize: 12, color: '#201020', fontWeight: 700, letterSpacing: '0.08em' }}>{title}</div>
        <div style={{ position: 'absolute', left: 14, right: 14, top: 18, height: 2, background: color }} />
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 18, height: 2, background: color }} />
      </div>
      {[...Array(14)].map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const x = Math.cos(angle) * 140;
        const y = Math.sin(angle) * 92;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: color,
              boxShadow: `0 0 12px ${color}`,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              animation: `maze-seal-spark 900ms ease-out ${i * 28}ms forwards`,
              ['--seal-x' as string]: `${x}px`,
              ['--seal-y' as string]: `${y}px`,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}

function MazeItemGetEffect({ itemName }: { itemName: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(255,218,112,0.34) 0%, rgba(255,170,60,0.14) 34%, transparent 66%)',
          animation: 'maze-item-get-screen 1450ms ease-out forwards',
        }}
      />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${24 + i * 10}%`,
            top: `${34 + (i % 2) * 30}%`,
            width: 8 + (i % 3) * 3,
            height: 8 + (i % 3) * 3,
            background: '#fff2b8',
            boxShadow: '0 0 14px rgba(255,230,140,0.95)',
            transform: 'rotate(45deg)',
            animation: `maze-item-get-spark 1250ms ease-out ${i * 80}ms forwards`,
            opacity: 0,
          }}
        />
      ))}
      <div
        style={{
          position: 'relative',
          width: 236,
          minHeight: 128,
          borderRadius: 6,
          border: '2px solid #f4d37a',
          background: 'linear-gradient(145deg, rgba(70,34,7,0.98), rgba(20,8,2,0.98))',
          boxShadow: '0 0 32px rgba(244,186,74,0.58), inset 0 0 22px rgba(255,224,154,0.18)',
          color: '#ffe8aa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          padding: '18px 20px',
          overflow: 'hidden',
          textAlign: 'center',
          animation: 'maze-item-get-card 1450ms ease-out forwards',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,248,194,0.36), transparent)',
            transform: 'translateX(-100%)',
            animation: 'maze-item-get-shine 1400ms ease-out 120ms forwards',
          }}
        />
        <div style={{ position: 'relative', fontSize: 11, color: '#f6c45f', letterSpacing: '0.14em' }}>ITEM GET</div>
        <div style={{ position: 'relative', fontSize: 28, lineHeight: 1, color: '#fff2c2', textShadow: '0 0 16px rgba(255,220,120,0.72)' }}>宝</div>
        <div style={{ position: 'relative', fontSize: 17, lineHeight: 1.3, maxWidth: 196, overflowWrap: 'anywhere' }}>
          {itemName}
        </div>
        <div style={{ position: 'relative', fontSize: 11, opacity: 0.72 }}>持ち物に入りました</div>
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
    initMaze(config.map, selectPlayerStats(config, context), context.inventory, {
      initialPos:             config.initialPos,
      initialDir:             config.initialDir,
      initialFloor:           config.initialFloor,
      initialVisited:         config.initialVisited,
      initialTriggeredEvents: config.initialTriggeredEvents,
      initialOpenedSeals:     config.initialOpenedSeals,
      initialOpenedTreasures: config.initialOpenedTreasures,
      boss:                   selectBoss(config, context.flags),
      seals:                  config.seals,
      treasures:              config.treasures,
    }),
  );
  const theme = mergeFloorTheme(config.theme, config.floorThemes, state.floor);
  const assetsBaseUrl = config.assetsBaseUrl ?? '/assets';

  useMazeBgm(assetsBaseUrl, config.bgm, config.battleBgm, !!state.battle);

  const [itemPanelMode, setItemPanelMode] = useState<'explore' | 'battle'>('explore');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemNotice, setItemNotice] = useState<string | null>(null);
  const [attackFlash, setAttackFlash] = useState(false);
  const [defeatEffect, setDefeatEffect] = useState(false);
  const [healSparkleKey, setHealSparkleKey] = useState(0);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousBattleRef = useRef(state.battle);
  const showingBattleItems = !!state.battle && itemPanelMode === 'battle';
  const stairDirection = getStairDirection(state);
  const facingTreasure = getFacingTreasure(state);
  const lastTreasure = state.lastNotice?.startsWith('宝箱') && state.lastTreasureOpened
    ? state.treasures[state.lastTreasureOpened]
    : undefined;
  const lastTreasureItemName = lastTreasure
    ? lastTreasure.label ?? config.items?.find(item => item.id === lastTreasure.itemId)?.name ?? lastTreasure.itemId
    : undefined;

  const dispatch = useCallback((key: string) => {
    setState(prev => handleKey(prev, key));
  }, []);

  const closeBattleItems = useCallback(() => {
    setItemPanelMode('explore');
    setSelectedItemId(null);
  }, []);

  const attackEnemy = useCallback(() => {
    if (!state.battle || state.battle.phase !== 'select') return;
    setAttackFlash(true);
    window.setTimeout(() => setAttackFlash(false), 180);
    setState(prev => {
      if (!prev.battle || prev.battle.phase !== 'select') return prev;
      return handleKey({ ...prev, battle: { ...prev.battle, cursorIndex: 0 } }, 'Enter');
    });
  }, [state.battle]);

  const openTreasure = useCallback(() => {
    if (state.battle || state.atExit) return;
    setState(prev => {
      const target = getFacingTreasure(prev);
      const itemName = target
        ? config.items?.find(item => item.id === target.treasure.itemId)?.name
        : undefined;
      return openFacingTreasure(prev, itemName);
    });
  }, [config.items, state.atExit, state.battle]);

  const handleUseItem = useCallback((itemId: string, itemName: string) => {
    const effect = config.itemEffects?.[itemId];
    if (effect?.attackEnemy !== undefined && !state.battle) return;
    if (effect?.escapeToNovelScene && state.battle) return;
    if (effect?.escapeToNovelScene && !state.battle) {
      const nr = config._novelReturn as Record<string, unknown> | undefined;
      if (!nr) return;
      const idx = state.inventory.indexOf(itemId);
      if (idx === -1) return;
      const inventory = [...state.inventory.slice(0, idx), ...state.inventory.slice(idx + 1)];
      const resumeConfig: MazeRpgConfig = {
        ...config,
        initialPos:             state.pos,
        initialDir:             state.dir,
        initialFloor:           state.floor,
        initialVisited:         [...state.visited],
        initialTriggeredEvents: [...state.triggeredEvents],
        initialOpenedSeals:     [...state.openedSeals],
        initialOpenedTreasures: [...state.openedTreasures],
      };
      const updatedContext: GameContext = {
        ...context,
        flags: {
          ...context.flags,
          [`explored_${config.map}`]: true,
          [`maze_floor_${config.map}`]: state.floor,
          ...mazeResumePositionFlags(config.map, state.pos, state.dir),
          [`maze_visited_${config.map}`]:  JSON.stringify([...state.visited]),
          [`maze_triggered_${config.map}`]: JSON.stringify([...state.triggeredEvents]),
          [`maze_opened_seals_${config.map}`]: JSON.stringify([...state.openedSeals]),
          [`maze_opened_treasures_${config.map}`]: JSON.stringify([...state.openedTreasures]),
        },
        inventory,
        playerStats: {
          ...context.playerStats,
          hp: state.playerHp,
          maxHp: state.playerMaxHp,
          atk: state.playerAtk,
          def: state.playerDef,
        },
      };
      onExit(updatedContext, {
        engineId: 'novel',
        transition: 'rift',
        config: { ...nr, initialSceneId: effect.escapeToNovelScene, autoStart: true },
        returnEngineId: 'maze_rpg',
        returnConfig: resumeConfig,
        returnTransition: 'rift',
      } as EngineTransition);
      return;
    }
    if (effect?.healHp !== undefined) {
      setHealSparkleKey(prev => prev + 1);
    }
    setState(prev => useItemInMaze(prev, itemId, itemName, effect));
    setSelectedItemId(null);
    if (state.battle) {
      setItemPanelMode('explore');
    } else {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      const notice = effect?.healHp === 'full'
        ? `${itemName}を使った！ HP全回復！`
        : typeof effect?.healHp === 'number'
          ? `${itemName}を使った！ HP+${effect.healHp}！`
          : `${itemName}を使った！`;
      setItemNotice(notice);
      noticeTimerRef.current = setTimeout(() => setItemNotice(null), 2500);
    }
  }, [config, context, onExit, state]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (itemPanelMode === 'battle') {
        if (e.key === 'Escape') closeBattleItems();
        return;
      }
      const confirm = e.key === 'Enter' || e.key === ' ';
      setState(prev => {
        if (prev.battle?.phase === 'select' && prev.battle.cursorIndex === 2 && confirm) {
          setItemPanelMode('battle');
          return prev;
        }
        return handleKey(prev, e.key);
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeBattleItems, itemPanelMode]);

  useEffect(() => {
    if (!state.battle) setItemPanelMode('explore');
    if (!state.battle || state.battle.phase !== 'select') {
      setSelectedItemId(null);
    }
  }, [state.battle]);

  useEffect(() => {
    if (selectedItemId && !state.inventory.includes(selectedItemId)) {
      setSelectedItemId(null);
    }
  }, [selectedItemId, state.inventory]);

  useEffect(() => {
    const prev = previousBattleRef.current;
    const current = state.battle;
    if (current?.phase === 'win' && prev?.phase !== 'win') {
      setDefeatEffect(true);
      const timer = window.setTimeout(() => setDefeatEffect(false), 900);
      previousBattleRef.current = current;
      return () => window.clearTimeout(timer);
    }
    if (!current || current.phase === 'select') setDefeatEffect(false);
    previousBattleRef.current = current;
    return undefined;
  }, [state.battle]);

  useEffect(() => {
    if (state.battle?.phase !== 'win' && state.battle?.phase !== 'lose') return;
    const delay = state.battle.phase === 'win' ? 850 : 1050;
    const timer = window.setTimeout(() => {
      setState(prev => {
        if (prev.battle?.phase !== 'win' && prev.battle?.phase !== 'lose') return prev;
        return handleKey(prev, 'Enter');
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [state.battle?.phase]);

  const buildUpdatedContext = useCallback((): GameContext => ({
    ...context,
    flags: {
      ...context.flags,
      [`explored_${config.map}`]: true,
      [`maze_floor_${config.map}`]: state.floor,
      ...mazeResumePositionFlags(config.map, state.pos, state.dir),
      [`maze_visited_${config.map}`]:  JSON.stringify([...state.visited]),
      [`maze_triggered_${config.map}`]: JSON.stringify([...state.triggeredEvents]),
      [`maze_opened_seals_${config.map}`]: JSON.stringify([...state.openedSeals]),
      [`maze_opened_treasures_${config.map}`]: JSON.stringify([...state.openedTreasures]),
    },
    inventory: state.inventory,
    playerStats: {
      ...context.playerStats,
      hp: state.playerHp,
      maxHp: state.playerMaxHp,
      atk: state.playerAtk,
      def: state.playerDef,
    },
  }), [context, config.map, state.dir, state.floor, state.inventory, state.openedSeals, state.openedTreasures, state.playerHp, state.playerMaxHp, state.playerAtk, state.playerDef, state.pos, state.visited, state.triggeredEvents]);

  const triggerExit = useCallback(() => {
    const baseContext = buildUpdatedContext();
    const updatedContext: GameContext = {
      ...baseContext,
      playerStats: {
        ...baseContext.playerStats,
        hp: state.playerMaxHp,
      },
    };
    const nr = config._novelReturn as Record<string, unknown> | undefined;
    if (nr?.exitSceneId) {
      onExit(updatedContext, {
        engineId: 'novel',
        config: { ...nr, initialSceneId: nr.exitSceneId, autoStart: true },
      } as EngineTransition);
    } else {
      onExit(updatedContext);
    }
  }, [buildUpdatedContext, config._novelReturn, onExit, state.playerMaxHp]);

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
          [`maze_floor_${config.map}`]: state.floor,
          [`maze_visited_${config.map}`]:  JSON.stringify([...state.visited]),
          [`maze_triggered_${config.map}`]: JSON.stringify([...state.triggeredEvents]),
          [`maze_opened_seals_${config.map}`]: JSON.stringify([...state.openedSeals]),
          [`maze_opened_treasures_${config.map}`]: JSON.stringify([...state.openedTreasures]),
        },
        inventory: state.inventory,
        playerStats: {
          ...context.playerStats,
          hp: state.playerMaxHp,
          maxHp: state.playerMaxHp,
          atk: state.playerAtk,
          def: state.playerDef,
        },
      };
      const [, coord = state.pendingBossTilePos] = state.pendingBossTilePos.split(':');
      const [bx, by] = coord.split(',').map(Number);
      const bossRetryConfig: MazeRpgConfig = {
        map:          config.map,
        name:         config.name,
        theme:        config.theme,
        floorThemes:  config.floorThemes,
        assetsBaseUrl: config.assetsBaseUrl,
        bgm:          config.bgm,
        battleBgm:    config.battleBgm,
        floorLabelStart: config.floorLabelStart,
        floorLabelPrefix: config.floorLabelPrefix,
        items:        config.items,
        events:       config.events,
        boss:         config.boss,
        weakenedBoss: config.weakenedBoss,
        weakenedBossFlag: config.weakenedBossFlag,
        boostedStatsFlag: config.boostedStatsFlag,
        boostedPlayerStats: config.boostedPlayerStats,
        boostedStatStages: config.boostedStatStages,
        seals:        config.seals,
        treasures:    config.treasures,
        itemEffects:  config.itemEffects,
        _novelReturn: config._novelReturn,
        initialFloor:           state.floor,
        initialPos:             { x: (bx ?? 0) - 1, y: by ?? 0 },
        initialDir:             'E',
        initialTriggeredEvents: [...state.triggeredEvents],
        initialOpenedSeals:     [...state.openedSeals],
        initialOpenedTreasures: [...state.openedTreasures],
      };
      onExit(updatedContext, {
        engineId: 'novel',
        transition: 'rift',
        config: {
          ...nr,
          initialSceneId: nr.gameoverLandingSceneId ?? nr.gameoverBossSceneId,
          autoStart: true,
        },
        returnEngineId: 'maze_rpg',
        returnConfig: bossRetryConfig,
        returnTransition: 'rift',
      } as EngineTransition);
    } else if (nr.gameoverSceneId) {
      const updatedContext: GameContext = {
        ...context,
        flags: {
          ...context.flags,
          flag_maze_defeated: true,
          [`maze_floor_${config.map}`]: state.floor,
          [`maze_visited_${config.map}`]:  JSON.stringify([...state.visited]),
          [`maze_triggered_${config.map}`]: JSON.stringify([...state.triggeredEvents]),
          [`maze_opened_seals_${config.map}`]: JSON.stringify([...state.openedSeals]),
          [`maze_opened_treasures_${config.map}`]: JSON.stringify([...state.openedTreasures]),
        },
        inventory: state.inventory,
        playerStats: {
          ...context.playerStats,
          hp: state.playerMaxHp,
          maxHp: state.playerMaxHp,
          atk: state.playerAtk,
          def: state.playerDef,
        },
      };
      const retryConfig: MazeRpgConfig = {
        map:          config.map,
        name:         config.name,
        theme:        config.theme,
        floorThemes:  config.floorThemes,
        assetsBaseUrl: config.assetsBaseUrl,
        bgm:          config.bgm,
        battleBgm:    config.battleBgm,
        floorLabelStart: config.floorLabelStart,
        floorLabelPrefix: config.floorLabelPrefix,
        items:        config.items,
        events:       config.events,
        boss:         config.boss,
        weakenedBoss: config.weakenedBoss,
        weakenedBossFlag: config.weakenedBossFlag,
        boostedStatsFlag: config.boostedStatsFlag,
        boostedPlayerStats: config.boostedPlayerStats,
        boostedStatStages: config.boostedStatStages,
        seals:        config.seals,
        treasures:    config.treasures,
        itemEffects:  config.itemEffects,
        _novelReturn: config._novelReturn,
        initialFloor: state.floor,
        initialTriggeredEvents: [...state.triggeredEvents],
        initialOpenedSeals:     [...state.openedSeals],
        initialOpenedTreasures: [...state.openedTreasures],
      };
      onExit(updatedContext, {
        engineId: 'novel',
        transition: 'rift',
        config: {
          ...nr,
          initialSceneId: nr.gameoverLandingSceneId ?? nr.gameoverSceneId,
          autoStart: true,
        },
        returnEngineId: 'maze_rpg',
        returnConfig: retryConfig,
        returnTransition: 'rift',
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
    const posKey = `${state.floor}:${state.pos.x},${state.pos.y}`;
    const resumeConfig: MazeRpgConfig = {
      ...config,
      initialPos:             state.pos,
      initialDir:             state.dir,
      initialFloor:           state.floor,
      initialVisited:         [...state.visited],
      initialTriggeredEvents: [...state.triggeredEvents, posKey],
      initialOpenedSeals:     [...state.openedSeals],
      initialOpenedTreasures: [...state.openedTreasures],
    };
    onExit(updatedContext, {
      engineId: 'novel',
      transition: 'rift',
      config: { ...nr, initialSceneId: sceneId, autoStart: true },
      returnEngineId: 'maze_rpg',
      returnConfig: resumeConfig,
      returnTransition: 'rift',
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
        <style>{`
          @keyframes maze-enemy-burst {
            0% { opacity: 0; transform: scale(0.45); }
            32% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.75); }
          }
          @keyframes maze-hit-slash {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(-18deg) scaleX(0.2); }
            35% { opacity: 1; transform: translate(-50%, -50%) rotate(-18deg) scaleX(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(-18deg) scaleX(1.15); }
          }
          @keyframes maze-heal-aura {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.55); filter: blur(1px); }
            22% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
            100% { opacity: 0; transform: translate(-50%, -62%) scale(1.28); filter: blur(4px); }
          }
          @keyframes maze-heal-sparkle {
            0% { opacity: 0; transform: translate(-50%, 18px) rotate(45deg) scale(0.25); }
            28% { opacity: 1; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -70px) rotate(45deg) scale(0.2); }
          }
          @keyframes maze-item-drop-card {
            0% { opacity: 0; transform: translateY(12px) scale(0.92); filter: blur(2px); }
            36% { opacity: 1; transform: translateY(-2px) scale(1.03); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes maze-item-drop-shine {
            0% { transform: translateX(-100%); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes maze-item-get-screen {
            0% { opacity: 0; }
            18% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes maze-item-get-card {
            0% { opacity: 0; transform: translateY(28px) scale(0.72); filter: blur(3px); }
            24% { opacity: 1; transform: translateY(-4px) scale(1.04); filter: blur(0); }
            74% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
            100% { opacity: 0; transform: translateY(-34px) scale(0.88); filter: blur(3px); }
          }
          @keyframes maze-item-get-shine {
            0% { transform: translateX(-100%); opacity: 0; }
            18% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes maze-item-get-spark {
            0% { opacity: 0; transform: translateY(22px) rotate(45deg) scale(0.2); }
            30% { opacity: 1; transform: translateY(0) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translateY(-68px) rotate(45deg) scale(0.1); }
          }
          @keyframes maze-seal-screen-flash {
            0% { opacity: 0; }
            16% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes maze-seal-ring {
            0% { opacity: 0; transform: scale(0.25); }
            28% { opacity: 0.95; transform: scale(0.75); }
            100% { opacity: 0; transform: scale(1.8); }
          }
          @keyframes maze-seal-card {
            0% { opacity: 0; transform: translateY(30px) scale(0.45) rotate(-8deg); filter: blur(2px); }
            24% { opacity: 1; transform: translateY(0) scale(1.05) rotate(1deg); filter: blur(0); }
            72% { opacity: 1; transform: translateY(-4px) scale(1) rotate(0); filter: blur(0); }
            100% { opacity: 0; transform: translateY(-42px) scale(0.82) rotate(4deg); filter: blur(3px); }
          }
          @keyframes maze-seal-spark {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) scale(0.2); }
            30% { opacity: 1; transform: translate(calc(-50% + var(--seal-x) * 0.35), calc(-50% + var(--seal-y) * 0.35)) rotate(45deg) scale(1); }
            100% { opacity: 0; transform: translate(calc(-50% + var(--seal-x)), calc(-50% + var(--seal-y))) rotate(45deg) scale(0.1); }
          }
        `}</style>
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
          <span style={{ fontSize: 11, opacity: 0.7 }}>{floorLabel(config, state.floor)} / 歩数: {state.steps}</span>
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

                {healSparkleKey > 0 && <HealSparkleEffect key={healSparkleKey} />}
                {state.lastSealOpened && (
                  <SealUnlockEffect
                    key={`${state.lastSealOpened}-${state.steps}`}
                    sealId={state.lastSealOpened}
                    label={state.seals[state.lastSealOpened]?.label}
                  />
                )}
                {lastTreasureItemName && (
                  <MazeItemGetEffect
                    key={`${state.lastTreasureOpened}-${state.openedTreasures.size}`}
                    itemName={lastTreasureItemName}
                  />
                )}

                {state.battle && (
                  <>
                    <EnemySprite
                      enemy={state.battle.enemy}
                      assetsBaseUrl={assetsBaseUrl}
                      defeated={defeatEffect || state.battle.phase === 'win'}
                      onClick={state.battle.phase === 'select' ? attackEnemy : undefined}
                    />
                    {attackFlash && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '45%',
                          width: 240,
                          height: 18,
                          borderRadius: 10,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.98), rgba(180,90,255,0.7), transparent)',
                          boxShadow: '0 0 18px rgba(220,180,255,0.9)',
                          pointerEvents: 'none',
                          animation: 'maze-hit-slash 180ms ease-out forwards',
                        }}
                      />
                    )}
                  </>
                )}

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

                {!state.battle && !state.atExit && facingTreasure && (
                  <button
                    type="button"
                    onClick={openTreasure}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: 22,
                      transform: 'translateX(-50%)',
                      zIndex: 8,
                      minWidth: 168,
                      padding: '9px 18px',
                      borderRadius: 4,
                      border: '1px solid #f2c96d',
                      background: 'linear-gradient(180deg, #40220a, #1a0902)',
                      color: '#ffe09a',
                      boxShadow: '0 0 18px rgba(255,190,80,0.45), inset 0 0 12px rgba(255,220,140,0.2)',
                      fontFamily: FONT,
                      fontSize: 14,
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    宝箱を開ける
                  </button>
                )}
              </div>

              {/* 迷宮内通知 */}
              {!state.battle && !state.atExit && state.lastNotice && (
                <div
                  style={{
                    marginTop: 8,
                    background: '#20102a',
                    border: `1px solid ${theme.uiAccent}`,
                    borderRadius: 4,
                    padding: '8px 16px',
                    color: theme.uiAccent,
                    fontSize: 13,
                    textAlign: 'center',
                    fontFamily: FONT,
                    letterSpacing: '0.04em',
                  }}
                >
                  {state.lastNotice}
                </div>
              )}

              {/* 階段パネル */}
              {!state.battle && !state.atExit && stairDirection && (
                <div
                  onClick={() => dispatch('Enter')}
                  style={{
                    marginTop: 8,
                    background: '#0a1f2a',
                    border: '1px solid #3388cc',
                    borderRadius: 4,
                    padding: '8px 16px',
                    color: '#77ccff',
                    fontSize: 14,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontFamily: FONT,
                    letterSpacing: '0.04em',
                  }}
                >
                  {stairDirection === 'down' ? '下り階段' : '上り階段'}を見つけた！ [Enter] / クリックで移動
                </div>
              )}

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

            {!showingBattleItems && (
              <>
                <div style={{ borderTop: `1px solid ${theme.uiBorder}`, flexShrink: 0 }} />

                {/* ミニマップ + コンパス — 横並び */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'center' }}>
                  <div style={{ border: `1px solid ${theme.uiBorder}` }}>
                    <MiniMap state={state} mode={config.minimapMode} />
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
                      {floorLabel(config, state.floor)} ({state.pos.x},{state.pos.y})
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
                    onCommand={i => {
                      if (i === 2) {
                        setItemPanelMode('battle');
                        return;
                      }
                      setItemPanelMode('explore');
                      setState(prev => {
                        if (!prev.battle || prev.battle.phase !== 'select') return prev;
                        const withCursor = { ...prev, battle: { ...prev.battle, cursorIndex: i } };
                        return handleKey(withCursor, 'Enter');
                      });
                    }}
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
              </>
            )}

            {/* アイテムパネル — 探索中は常時表示、バトル中はアイテムメニューを開いたときのみ表示 */}
            {(!state.battle || showingBattleItems) && (
              <ItemPanel
                inventory={state.inventory}
                itemDefs={config.items ?? []}
                theme={theme}
                mode={state.battle ? 'battle' : 'explore'}
                expanded={showingBattleItems}
                itemEffects={config.itemEffects}
                selectedItemId={selectedItemId}
                onSelect={setSelectedItemId}
                onUse={handleUseItem}
                onClose={showingBattleItems ? closeBattleItems : undefined}
                notification={itemNotice ?? undefined}
                font={FONT}
              />
            )}
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
