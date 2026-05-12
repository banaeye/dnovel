import type { Dir, Vec2, MazeSealConfig, MazeState, MazeTreasureConfig } from './types.js';
import { BUILT_IN_MAPS } from './maps.js';
import type { BuiltInMaze } from './maps.js';
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

function normalizeFloors(maze: BuiltInMaze | undefined): string[][] {
  const fallback = BUILT_IN_MAPS['dungeon_01'] as string[];
  const raw = maze ?? fallback;
  return typeof raw[0] === 'string' ? [raw as string[]] : raw as string[][];
}

function floorKey(floor: number, pos: Vec2): string {
  return `${floor}:${pos.x},${pos.y}`;
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
  initialFloor?: number;
  initialVisited?: string[];
  initialTriggeredEvents?: string[];
  initialOpenedSeals?: string[];
  initialOpenedTreasures?: string[];
  seals?: Record<string, MazeSealConfig>;
  treasures?: Record<string, MazeTreasureConfig>;
}

export function initMaze(
  mapId: string,
  playerStats?: Record<string, number>,
  inventory?: string[],
  options?: InitMazeOptions,
): MazeState {
  const floors = normalizeFloors(BUILT_IN_MAPS[mapId]);
  const floor = Math.max(0, Math.min(floors.length - 1, options?.initialFloor ?? 0));
  const map = floors[floor] ?? floors[0]!;
  const pos = options?.initialPos ?? findStart(map);
  const dir: Dir = options?.initialDir ?? 'N';
  const playerMaxHp = playerStats?.maxHp ?? 20;
  const playerHp = Math.min(playerMaxHp, Math.max(1, playerStats?.hp ?? playerMaxHp));
  const visited = options?.initialVisited
    ? new Set(options.initialVisited)
    : new Set([floorKey(floor, pos)]);
  const triggeredEvents = options?.initialTriggeredEvents
    ? new Set(options.initialTriggeredEvents)
    : new Set<string>();
  const openedSeals = options?.initialOpenedSeals
    ? new Set(options.initialOpenedSeals)
    : new Set<string>();
  const openedTreasures = options?.initialOpenedTreasures
    ? new Set(options.initialOpenedTreasures)
    : new Set<string>();
  return {
    pos,
    dir,
    map,
    floors,
    floor,
    mapId,
    seals: options?.seals ?? {},
    treasures: options?.treasures ?? {},
    openedSeals,
    openedTreasures,
    visited,
    atExit: false,
    steps: 0,
    playerHp,
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
  /** 迷宮からノベルシーンへ一時脱出する（再開位置は MazeApp 側で保持） */
  escapeToNovelScene?: string;
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

const EVENT_PASSTHROUGH = new Set(['.', 'S', 'X', '#', 'U', 'D']);

function sealIdForDoor(state: MazeState, tile: string): string | null {
  for (const [sealId, seal] of Object.entries(state.seals)) {
    if (seal.doorTile === tile) return sealId;
  }
  return null;
}

function sealIdForSwitch(state: MazeState, tile: string): string | null {
  for (const [sealId, seal] of Object.entries(state.seals)) {
    if (seal.switchTile === tile) return sealId;
  }
  return null;
}

function treasureKey(floor: number, pos: Vec2): string {
  return floorKey(floor, pos);
}

function treasureForTile(state: MazeState, tile: string): MazeTreasureConfig | null {
  return state.treasures[tile] ?? null;
}

export function isSealDoor(state: MazeState, tile: string): boolean {
  return sealIdForDoor(state, tile) !== null;
}

export function isSealSwitch(state: MazeState, tile: string): boolean {
  return sealIdForSwitch(state, tile) !== null;
}

export function isSealDoorOpen(state: MazeState, tile: string): boolean {
  const sealId = sealIdForDoor(state, tile);
  return sealId !== null && state.openedSeals.has(sealId);
}

export function isTreasureTile(state: MazeState, tile: string): boolean {
  return treasureForTile(state, tile) !== null;
}

export function isTreasureOpen(state: MazeState, floor: number, pos: Vec2): boolean {
  return state.openedTreasures.has(treasureKey(floor, pos));
}

function isBlocked(state: MazeState, x: number, y: number): boolean {
  const cell = getCell(state.map, x, y);
  if (cell === '#') return true;
  const sealId = sealIdForDoor(state, cell);
  if (sealId !== null && !state.openedSeals.has(sealId)) return true;
  if (treasureForTile(state, cell) && !isTreasureOpen(state, state.floor, { x, y })) return true;
  return false;
}

export function getForwardPos(state: MazeState, distance = 1): Vec2 {
  const delta = DELTAS[state.dir].fwd;
  return { x: state.pos.x + delta.x * distance, y: state.pos.y + delta.y * distance };
}

export function getFacingTreasure(state: MazeState): { pos: Vec2; tile: string; treasure: MazeTreasureConfig } | null {
  const pos = getForwardPos(state);
  const tile = getCell(state.map, pos.x, pos.y);
  const treasure = treasureForTile(state, tile);
  if (!treasure || isTreasureOpen(state, state.floor, pos)) return null;
  return { pos, tile, treasure };
}

export function openFacingTreasure(state: MazeState, itemName?: string): MazeState {
  const target = getFacingTreasure(state);
  if (!target) return state;
  const openedTreasures = new Set(state.openedTreasures);
  openedTreasures.add(treasureKey(state.floor, target.pos));
  const inventory = [...state.inventory, target.treasure.itemId];
  const label = target.treasure.label ?? itemName ?? target.treasure.itemId;
  return {
    ...state,
    inventory,
    openedTreasures,
    lastNotice: `宝箱を開けた。${label}を手に入れた。`,
    lastTreasureOpened: target.tile,
  };
}

function findCell(map: string[], target: string, fallback: Vec2): Vec2 {
  for (let y = 0; y < map.length; y++) {
    const x = map[y]?.indexOf(target) ?? -1;
    if (x >= 0) return { x, y };
  }
  return fallback;
}

export function getStairDirection(state: MazeState): 'up' | 'down' | null {
  const cell = getCell(state.map, state.pos.x, state.pos.y);
  if (cell === 'U' && state.floor > 0) return 'up';
  if (cell === 'D' && state.floor < state.floors.length - 1) return 'down';
  return null;
}

export function useStairs(state: MazeState): MazeState {
  const direction = getStairDirection(state);
  if (!direction) return state;
  const nextFloor = direction === 'down' ? state.floor + 1 : state.floor - 1;
  const nextMap = state.floors[nextFloor] ?? state.map;
  const targetCell = direction === 'down' ? 'U' : 'D';
  const sameCell = getCell(nextMap, state.pos.x, state.pos.y);
  const pos = sameCell === targetCell ? state.pos : findCell(nextMap, targetCell, state.pos);
  const visited = new Set(state.visited);
  visited.add(floorKey(nextFloor, pos));
  return {
    ...state,
    pos,
    map: nextMap,
    floor: nextFloor,
    visited,
    atExit: getCell(nextMap, pos.x, pos.y) === 'X',
    steps: state.steps + 1,
  };
}

function step(state: MazeState, delta: Vec2): MazeState {
  const next = add(state.pos, delta);
  const cell = getCell(state.map, next.x, next.y);
  if (isBlocked(state, next.x, next.y)) return state;
  const posKey = floorKey(state.floor, next);
  const visited = new Set(state.visited);
  visited.add(posKey);
  const openedSeals = new Set(state.openedSeals);
  const switchSealId = sealIdForSwitch(state, cell);
  let lastNotice: string | undefined;
  let lastSealOpened: string | undefined;
  if (switchSealId && !openedSeals.has(switchSealId)) {
    openedSeals.add(switchSealId);
    const label = state.seals[switchSealId]?.label ?? '霊符';
    lastNotice = `${label}が光り、どこかの封印扉が開いた。`;
    lastSealOpened = switchSealId;
  }
  const atExit = cell === 'X';
  const moved: MazeState = { ...state, pos: next, visited, openedSeals, lastNotice, lastSealOpened, atExit, steps: state.steps + 1 };
  const legacyPosKey = `${next.x},${next.y}`;
  if (switchSealId) return moved;
  // ボスタイル検出（one-shot: 未撃破座標のみ）
  if (!atExit && cell === 'B' && !state.triggeredEvents.has(posKey) && !state.triggeredEvents.has(legacyPosKey)) {
    return startBossBattle({ ...moved, pendingBossTilePos: posKey });
  }
  // イベントタイル検出（one-shot: 未発火座標のみ。Bタイルは除外）
  if (!atExit && !EVENT_PASSTHROUGH.has(cell) && cell !== 'B' && !isSealDoor(state, cell) && !isTreasureTile(state, cell) && !state.triggeredEvents.has(posKey) && !state.triggeredEvents.has(legacyPosKey)) {
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
    case 'Enter': case ' ': return useStairs(state);
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
    front.push(isBlocked(state, fwdPos.x, fwdPos.y));

    const prevPos = add(state.pos, scale(fwd, d - 1));
    leftW.push(isBlocked(state, add(prevPos, left).x, add(prevPos, left).y));
    rightW.push(isBlocked(state, add(prevPos, right).x, add(prevPos, right).y));
  }

  return { front, left: leftW, right: rightW };
}
