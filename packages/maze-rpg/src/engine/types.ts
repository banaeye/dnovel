export type Dir = 'N' | 'E' | 'S' | 'W';

export interface Vec2 {
  x: number;
  y: number;
}

export interface MazeState {
  pos: Vec2;
  dir: Dir;
  map: string[];
  mapId: string;
  visited: Set<string>;
  atExit: boolean;
  steps: number;
}
