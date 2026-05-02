import { useEffect, useRef } from 'react';
import type { MazeState } from '../engine/types.js';

const CELL = 14;
const PAD = 4;

const DIR_ARROW: Record<string, [number, number][]> = {
  N: [[0, -5], [-4, 4], [4, 4]],
  E: [[5, 0],  [-4, -4], [-4, 4]],
  S: [[0, 5],  [-4, -4], [4, -4]],
  W: [[-5, 0], [4, -4], [4, 4]],
};

export function MiniMap({ state }: { state: MazeState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cols = state.map[0]?.length ?? 0;
  const rows = state.map.length;
  const W = cols * CELL + PAD * 2;
  const H = rows * CELL + PAD * 2;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = state.map[y]?.[x] ?? '#';
        const key = `${x},${y}`;
        const visited = state.visited.has(key);
        const sx = PAD + x * CELL;
        const sy = PAD + y * CELL;

        if (cell === '#') {
          ctx.fillStyle = visited ? '#554433' : '#2a1a0a';
          ctx.fillRect(sx, sy, CELL, CELL);
        } else {
          ctx.fillStyle = visited ? '#443322' : '#110a04';
          ctx.fillRect(sx, sy, CELL, CELL);
          if (cell === 'X') {
            ctx.fillStyle = '#33bb55';
            ctx.fillRect(sx + 2, sy + 2, CELL - 4, CELL - 4);
          }
        }
      }
    }

    // プレイヤーマーカー
    const px = PAD + state.pos.x * CELL + CELL / 2;
    const py = PAD + state.pos.y * CELL + CELL / 2;

    // 方向矢印
    const arrow = DIR_ARROW[state.dir] ?? DIR_ARROW['N']!;
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.moveTo(px + arrow[0]![0], py + arrow[0]![1]);
    ctx.lineTo(px + arrow[1]![0], py + arrow[1]![1]);
    ctx.lineTo(px + arrow[2]![0], py + arrow[2]![1]);
    ctx.closePath();
    ctx.fill();
  }, [state, W, H, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
}
