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

export interface MazeSealConfig {
  switchTile: string;
  doorTile: string;
  label: string;
}

export interface MazeTreasureConfig {
  itemId: string;
  label?: string;
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
  floors: string[][];
  floor: number;
  mapId: string;
  seals: Record<string, MazeSealConfig>;
  treasures: Record<string, MazeTreasureConfig>;
  openedSeals: Set<string>;
  openedTreasures: Set<string>;
  lastNotice?: string;
  lastSealOpened?: string;
  lastTreasureOpened?: string;
  visited: Set<string>;
  atExit: boolean;
  steps: number;
  playerHp: number;
  playerMaxHp: number;
  playerAtk: number;
  playerDef: number;
  battle: BattleState | null;
  inventory: string[];
  /** 踏んだイベントタイルの文字（'E'等）。null = イベントなし */
  pendingEvent: string | null;
  /** one-shot 制御: 発火済み座標を "x,y" 形式で保持 */
  triggeredEvents: Set<string>;
  /** true のとき全滅 → ノベルへ遷移待ち */
  pendingDeath: boolean;
  /** ボスタイルを踏んだ座標 "x,y"。勝利後に triggeredEvents へ追加して null に戻す */
  pendingBossTilePos: string | null;
}
