import type { Dir, Vec2, MazeState } from './types.js';
import { BUILT_IN_MAPS } from './maps.js';
import { MAP_ENEMIES } from './enemies.js';
import { startBattle, handleBattleKey } from './battleEngine.js';

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

export function initMaze(mapId: string, playerStats?: Record<string, number>): MazeState {
  const map = BUILT_IN_MAPS[mapId] ?? BUILT_IN_MAPS['dungeon_01']!;
  const pos = findStart(map);
  const playerMaxHp = playerStats?.maxHp ?? 20;
  return {
    pos,
    dir: 'N',
    map,
    mapId,
    visited: new Set([`${pos.x},${pos.y}`]),
    atExit: false,
    steps: 0,
    playerHp: playerMaxHp,
    playerMaxHp,
    playerAtk: playerStats?.atk ?? 5,
    playerDef: playerStats?.def ?? 2,
    battle: null,
  };
}

function step(state: MazeState, delta: Vec2): MazeState {
  const next = add(state.pos, delta);
  if (getCell(state.map, next.x, next.y) === '#') return state;
  const key = `${next.x},${next.y}`;
  const visited = new Set(state.visited);
  visited.add(key);
  const atExit = getCell(state.map, next.x, next.y) === 'X';
  const moved: MazeState = { ...state, pos: next, visited, atExit, steps: state.steps + 1 };
  if (!atExit && MAP_ENEMIES[state.mapId] && Math.random() < ENCOUNTER_RATE) {
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
  if (state.battle) return handleBattleKey(state, key);
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
