import type { Enemy, MazeEnemyConfig } from './types.js';

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
  ghost:      { id: 'ghost',      name: 'ゴースト', hp: 10, atk: 4, def: 1 },
  bat:        { id: 'bat',        name: 'コウモリ', hp:  6, atk: 3, def: 0 },
  wanderingFlame: { id: 'wandering_flame', name: '迷い火',   hp:  8, atk: 3, def: 1 },
  wraith:     { id: 'wraith',     name: 'レイス',   hp: 14, atk: 5, def: 2 },
  skeleton:   { id: 'skeleton',   name: 'スケルトン', hp: 16, atk: 6, def: 3 },
  zombie:     { id: 'zombie',     name: 'ゾンビ',     hp: 20, atk: 7, def: 2 },
  slime:      { id: 'slime',      name: 'スライム',   hp: 12, atk: 5, def: 1 },
};

export const MAP_ENEMIES: Record<string, EnemyTemplate[]> = {
  dungeon_02: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wraith!],
  dungeon_03: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wraith!],
  ichibangai_abyss_5f: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
  ichibangai_abyss_final_13f: [TEMPLATES.skeleton!, TEMPLATES.zombie!, TEMPLATES.slime!, TEMPLATES.wraith!],
};

export const MAP_FLOOR_ENEMIES: Record<string, Record<number, EnemyTemplate[]>> = {
  ichibangai_abyss_5f: {
    0: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!],
    1: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!],
    2: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
    3: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
    4: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
  },
  ichibangai_abyss_final_13f: {
    0: [TEMPLATES.skeleton!, TEMPLATES.slime!, TEMPLATES.wraith!],
    1: [TEMPLATES.skeleton!, TEMPLATES.zombie!, TEMPLATES.slime!],
    2: [TEMPLATES.skeleton!, TEMPLATES.zombie!, TEMPLATES.wraith!],
    3: [TEMPLATES.zombie!, TEMPLATES.slime!, TEMPLATES.wraith!],
    4: [TEMPLATES.skeleton!, TEMPLATES.zombie!, TEMPLATES.slime!, TEMPLATES.wraith!],
    5: [TEMPLATES.skeleton!, TEMPLATES.zombie!, TEMPLATES.slime!, TEMPLATES.wraith!],
    6: [TEMPLATES.zombie!, TEMPLATES.wraith!],
  },
};

export const MAP_BOSS: Record<string, EnemyTemplate> = {
  dungeon_02: { id: 'maze_boss', name: '迷宮の主', hp: 22, atk: 7, def: 2 },
  dungeon_03: { id: 'maze_boss', name: '迷宮の主', hp: 22, atk: 7, def: 2 },
  ichibangai_abyss_5f: { id: 'maze_boss', name: '迷宮の主', hp: 22, atk: 7, def: 2 },
  ichibangai_abyss_final_13f: { id: 'abyss_boss', name: '一番街の深淵', hp: 42, atk: 10, def: 4 },
};

const DROP_TABLE: Record<string, { itemId: string; itemName: string; rate: number }> = {
  skeleton: { itemId: 'item_small_ofuda', itemName: 'ちいさなおふだ', rate: 0.35 },
  zombie:   { itemId: 'item_onigiri', itemName: 'お握り', rate: 0.35 },
  slime:    { itemId: 'item_fushigi_candy', itemName: '不思議なアメ', rate: 0.35 },
};

export function bossEnemy(mapId: string, override?: MazeEnemyConfig): Enemy | null {
  const t = override ?? MAP_BOSS[mapId];
  if (!t) return null;
  return spawn(t);
}

export function randomEnemy(mapId: string, floor = 0): Enemy | null {
  const pool = MAP_FLOOR_ENEMIES[mapId]?.[floor] ?? MAP_ENEMIES[mapId];
  if (!pool || pool.length === 0) return null;
  return spawn(pool[Math.floor(Math.random() * pool.length)]!);
}

export function rollEnemyDrop(enemyId: string, inventory: string[]): { itemId: string; itemName: string } | null {
  const drop = DROP_TABLE[enemyId];
  if (!drop || inventory.includes(drop.itemId)) return null;
  if (Math.random() >= drop.rate) return null;
  return { itemId: drop.itemId, itemName: drop.itemName };
}
