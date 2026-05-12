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
  ghost:      { id: 'ghost',      name: 'ゴースト', hp: 10, atk: 4, def: 1 },
  bat:        { id: 'bat',        name: 'コウモリ', hp:  6, atk: 3, def: 0 },
  wanderingFlame: { id: 'wandering_flame', name: '迷い火',   hp:  8, atk: 3, def: 1 },
  wraith:     { id: 'wraith',     name: 'レイス',   hp: 14, atk: 5, def: 2 },
};

export const MAP_ENEMIES: Record<string, EnemyTemplate[]> = {
  dungeon_02: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wraith!],
  dungeon_03: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wraith!],
  ichibangai_abyss_5f: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
};

export const MAP_FLOOR_ENEMIES: Record<string, Record<number, EnemyTemplate[]>> = {
  ichibangai_abyss_5f: {
    0: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!],
    1: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!],
    2: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
    3: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
    4: [TEMPLATES.ghost!, TEMPLATES.bat!, TEMPLATES.wanderingFlame!, TEMPLATES.wraith!],
  },
};

export const MAP_BOSS: Record<string, EnemyTemplate> = {
  dungeon_02: { id: 'maze_boss', name: '迷宮の主', hp: 22, atk: 7, def: 2 },
  dungeon_03: { id: 'maze_boss', name: '迷宮の主', hp: 22, atk: 7, def: 2 },
  ichibangai_abyss_5f: { id: 'abyss_boss', name: '巨大迷宮の怨霊', hp: 30, atk: 8, def: 3 },
};

export function bossEnemy(mapId: string): Enemy | null {
  const t = MAP_BOSS[mapId];
  if (!t) return null;
  return spawn(t);
}

export function randomEnemy(mapId: string, floor = 0): Enemy | null {
  const pool = MAP_FLOOR_ENEMIES[mapId]?.[floor] ?? MAP_ENEMIES[mapId];
  if (!pool || pool.length === 0) return null;
  return spawn(pool[Math.floor(Math.random() * pool.length)]!);
}
