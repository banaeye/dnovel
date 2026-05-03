export type Dir = 'N' | 'E' | 'S' | 'W';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
}

export type BattlePhase = 'select' | 'log' | 'win' | 'lose';

export interface BattleState {
  enemy: Enemy;
  phase: BattlePhase;
  log: string[];
  cursorIndex: number;
  guarding: boolean;
}

export interface MazeState {
  pos: Vec2;
  dir: Dir;
  map: string[];
  mapId: string;
  visited: Set<string>;
  atExit: boolean;
  steps: number;
  playerHp: number;
  playerMaxHp: number;
  playerAtk: number;
  playerDef: number;
  battle: BattleState | null;
}
