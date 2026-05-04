import type { Enemy } from './types.js';

interface EnemyTemplate {
  id: string;
  name: string;
  hp: number;
  atk: number;
  def: number;
}

function spawn(t: EnemyTemplate): Enemy {
  return { ...t, maxHp: t.hp };
}

const TEMPLATES: Record<string, EnemyTemplate> = {
  ghost:  { id: 'ghost',  name: 'ゴースト',   hp: 10, atk: 4, def: 1 },
  bat:    { id: 'bat',    name: 'コウモリ',   hp:  6, atk: 3, def: 0 },
  wraith: { id: 'wraith', name: 'レイス',     hp: 14, atk: 5, def: 2 },
};

export const MAP_ENEMIES: Record<string, EnemyTemplate[]> = {
  dungeon_02: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wraith!],
};

export const MAP_BOSS: Record<string, EnemyTemplate> = {
  dungeon_02: { id: 'maze_boss', name: '迷宮の主', hp: 22, atk: 7, def: 2 },
};

export function bossEnemy(mapId: string): Enemy | null {
  const t = MAP_BOSS[mapId];
  if (!t) return null;
  return spawn(t);
}

export function randomEnemy(mapId: string): Enemy | null {
  const pool = MAP_ENEMIES[mapId];
  if (!pool || pool.length === 0) return null;
  return spawn(pool[Math.floor(Math.random() * pool.length)]!);
}
