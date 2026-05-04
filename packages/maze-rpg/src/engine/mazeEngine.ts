import type { Dir, Vec2, MazeState } from './types.js';
import { BUILT_IN_MAPS } from './maps.js';
import { MAP_ENEMIES } from './enemies.js';
import { startBattle, startBossBattle, handleBattleKey } from './battleEngine.js';

const ENCOUNTER_RATE = 0.2;

const DELTAS: Record<Dir, { fwd: Vec2; left: Vec2; right: Vec2; back: Vec2 }> = {
  N: { fwd: { x: 0, y: -1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, back: { x: 0, y: 1 } },
  E: { fwd: { x: 1, y: 0 }, left: { x: 0, y: -1 }, right: { x: 0, y: 1 }, back: { x: -1, y: 0 } },
  S: { fwd: { x: 0, y: 1 }, left: { x: 1, y: 0 }, right: { x: -1, y: 0 }, back: { x: 0, y: -1 } },
  W: { fwd: { x: -1, y: 0 }, left: { x: 0, y: 1 }, right: { x: 0, y: -1 }, back: { x: 1, y: 0 } },
};

const TURN_LEFT: Record<Dir, Dir>  = { N: 'W', W: 'S', S: 'E', E: 'N' };
const TURN_RIGHT: Record<Dir, Dir> = { N: 'E', E: 'S', S: 'W', W: 'N' };

export function getCell(map: string[], x: number, y: number): string {
  if (y < 0 || y >= map.length) return '#';
  if (x < 0 || x >= (map[y]?.length ?? 0)) return '#';
  return map[y][x] ?? '#';
}

function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

function scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function findStart(map: string[]): Vec2 {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf('S');
    if (x >= 0) return { x, y };
  }
  return { x: 1, y: 1 };
}

export interface InitMazeOptions {
  initialPos?: Vec2;
  initialDir?: Dir;
  initialVisited?: string[];
  initialTriggeredEvents?: string[];
}

export function initMaze(
  mapId: string,
  playerStats?: Record<string, number>,
  inventory?: string[],
  options?: InitMazeOptions,
): MazeState {
  const map = BUILT_IN_MAPS[mapId] ?? BUILT_IN_MAPS['dungeon_01']!;
  const pos = options?.initialPos ?? findStart(map);
  const dir: Dir = options?.initialDir ?? 'N';
  const playerMaxHp = playerStats?.maxHp ?? 20;
  const visited = options?.initialVisited
    ? new Set(options.initialVisited)
    : new Set([`${pos.x},${pos.y}`]);
  const triggeredEvents = options?.initialTriggeredEvents
    ? new Set(options.initialTriggeredEvents)
    : new Set<string>();
  return {
    pos,
    dir,
    map,
    mapId,
    visited,
    atExit: false,
    steps: 0,
    playerHp: playerMaxHp,
    playerMaxHp,
    playerAtk: playerStats?.atk ?? 5,
    playerDef: playerStats?.def ?? 2,
    battle: null,
    inventory: inventory ?? [],
    pendingEvent: null,
    triggeredEvents,
    pendingDeath: false,
    pendingBossTilePos: null,
  };
}

export interface ItemEffect {
  healHp?: 'full' | number;
  /** バトル中に敵へ与えるダメージ（バトル外では使用不可） */
  attackEnemy?: number;
}

export function useItemInMaze(
  state: MazeState,
  itemId: string,
  itemName: string,
  effect?: ItemEffect,
): MazeState {
  const idx = state.inventory.indexOf(itemId);
  if (idx === -1) return state;

  // 敵攻撃専用アイテムはバトル外では使えない
  if (effect?.attackEnemy !== undefined && !state.battle) return state;

  const inventory = [...state.inventory.slice(0, idx), ...state.inventory.slice(idx + 1)];
  const msgs = [`${itemName}を使った！`];
  let playerHp = state.playerHp;

  if (effect?.healHp === 'full') {
    playerHp = state.playerMaxHp;
    msgs.push('HPが全回復した！');
  } else if (typeof effect?.healHp === 'number') {
    playerHp = Math.min(state.playerMaxHp, state.playerHp + effect.healHp);
    msgs.push(`HPが ${effect.healHp} 回復した！`);
  }

  // 敵へのダメージ（バトル中のみ）
  if (state.battle && effect?.attackEnemy !== undefined) {
    const enemy = state.battle.enemy;
    const dmg = Math.min(effect.attackEnemy, enemy.hp);
    const newEnemyHp = Math.max(0, enemy.hp - effect.attackEnemy);
    msgs.push(`${enemy.name} に ${dmg} の大ダメージ！`);
    const newEnemy = { ...enemy, hp: newEnemyHp };
    if (newEnemyHp <= 0) {
      msgs.push(`${enemy.name} を倒した！`);
      return {
        ...state,
        inventory,
        playerHp,
        battle: { ...state.battle, enemy: newEnemy, phase: 'win', log: [...state.battle.log, ...msgs] },
      };
    }
    return {
      ...state,
      inventory,
      playerHp,
      battle: { ...state.battle, enemy: newEnemy, log: [...state.battle.log, ...msgs] },
    };
  }

  if (state.battle) {
    const log = [...state.battle.log, ...msgs];
    return { ...state, inventory, playerHp, battle: { ...state.battle, log } };
  }
  return { ...state, inventory, playerHp };
}

const EVENT_PASSTHROUGH = new Set(['.', 'S', 'X', '#']);

function step(state: MazeState, delta: Vec2): MazeState {
  const next = add(state.pos, delta);
  const cell = getCell(state.map, next.x, next.y);
  if (cell === '#') return state;
  const posKey = `${next.x},${next.y}`;
  const visited = new Set(state.visited);
  visited.add(posKey);
  const atExit = cell === 'X';
  const moved: MazeState = { ...state, pos: next, visited, atExit, steps: state.steps + 1 };
  // ボスタイル検出（one-shot: 未撃破座標のみ）
  if (!atExit && cell === 'B' && !state.triggeredEvents.has(posKey)) {
    return startBossBattle({ ...moved, pendingBossTilePos: posKey });
  }
  // イベントタイル検出（one-shot: 未発火座標のみ。Bタイルは除外）
  if (!atExit && !EVENT_PASSTHROUGH.has(cell) && cell !== 'B' && !state.triggeredEvents.has(posKey)) {
    return { ...moved, pendingEvent: cell };
  }
  if (!atExit && cell !== 'B' && MAP_ENEMIES[state.mapId] && Math.random() < ENCOUNTER_RATE) {
    return startBattle(moved);
  }
  return moved;
}

export function moveForward(state: MazeState): MazeState {
  return step(state, DELTAS[state.dir].fwd);
}

export function moveBackward(state: MazeState): MazeState {
  return step(state, DELTAS[state.dir].back);
}

export function turnLeft(state: MazeState): MazeState {
  return { ...state, dir: TURN_LEFT[state.dir] };
}

export function turnRight(state: MazeState): MazeState {
  return { ...state, dir: TURN_RIGHT[state.dir] };
}

export function handleKey(state: MazeState, key: string): MazeState {
  if (state.pendingDeath) return state;           // 全滅遷移待ち中は入力無視
  if (state.battle) return handleBattleKey(state, key);
  if (state.pendingEvent !== null) return state;  // イベント待機中は入力無視
  if (state.atExit) return state;
  switch (key) {
    case 'ArrowUp':    case 'w': case 'W': return moveForward(state);
    case 'ArrowDown':  case 's': case 'S': return moveBackward(state);
    case 'ArrowLeft':  case 'a': case 'A': return turnLeft(state);
    case 'ArrowRight': case 'd': case 'D': return turnRight(state);
    default: return state;
  }
}

export interface ViewData {
  front: boolean[];
  left:  boolean[];
  right: boolean[];
}

export function getViewData(state: MazeState, maxDepth: number): ViewData {
  const { fwd, left, right } = DELTAS[state.dir];
  const front: boolean[] = [false];
  const leftW: boolean[] = [false];
  const rightW: boolean[] = [false];

  for (let d = 1; d <= maxDepth; d++) {
    const fwdPos = add(state.pos, scale(fwd, d));
    front.push(getCell(state.map, fwdPos.x, fwdPos.y) === '#');

    const prevPos = add(state.pos, scale(fwd, d - 1));
    leftW.push(getCell(state.map, add(prevPos, left).x, add(prevPos, left).y) === '#');
    rightW.push(getCell(state.map, add(prevPos, right).x, add(prevPos, right).y) === '#');
  }

  return { front, left: leftW, right: rightW };
}
