import { useEffect, useRef } from 'react';
import type { MazeState } from '../engine/types.js';
import { getViewData } from '../engine/mazeEngine.js';

const VW = 480;
const VH = 320;
const MAX_DEPTH = 4;

// [left, top, right, bottom] — 各深さのスクリーン上「窓枠」
const FRAMES: [number, number, number, number][] = [
  [0,   0,   480, 320],  // d=0: ニアクリップ
  [60,  40,  420, 280],  // d=1
  [120, 80,  360, 240],  // d=2
  [172, 110, 308, 210],  // d=3
  [207, 128, 273, 192],  // d=4
];

// d=1 が最も明るく、遠いほど暗くなる
const DEPTH_BRIGHT = [1.0, 1.0, 0.78, 0.56, 0.38];

function rgb(r: number, g: number, b: number, f: number): string {
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

// 前面壁: 温かい石の色
const FRONT_R = 154, FRONT_G = 116, FRONT_B = 32;
// 側面壁: やや暗い
const SIDE_R = 90, SIDE_G = 66, SIDE_B = 10;

function renderScene(ctx: CanvasRenderingContext2D, state: MazeState) {
  const { front, left, right } = getViewData(state, MAX_DEPTH);

  // 背景：天井（上半分）と床（下半分）のグラデーション
  const ceilGrad = ctx.createLinearGradient(0, 0, 0, VH / 2);
  ceilGrad.addColorStop(0, '#020213');
  ceilGrad.addColorStop(1, '#0d0d25');
  ctx.fillStyle = ceilGrad;
  ctx.fillRect(0, 0, VW, VH / 2);

  const floorGrad = ctx.createLinearGradient(0, VH / 2, 0, VH);
  floorGrad.addColorStop(0, '#130a02');
  floorGrad.addColorStop(1, '#060300');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, VH / 2, VW, VH / 2);

  // 最初に前面壁が出現する深さを求める
  let visDepth = MAX_DEPTH;
  for (let d = 1; d <= MAX_DEPTH; d++) {
    if (front[d]) { visDepth = d; break; }
  }

  // 遠→近の順に描画 (painter's algorithm)
  for (let d = visDepth; d >= 1; d--) {
    const bright = DEPTH_BRIGHT[d] ?? 0.3;
    const [fl, ft, fr, fb] = FRAMES[d]!;
    const [nl, nt, nr, nb] = FRAMES[d - 1]!;

    // 前面壁
    if (front[d]) {
      ctx.fillStyle = rgb(FRONT_R, FRONT_G, FRONT_B, bright);
      ctx.fillRect(fl, ft, fr - fl, fb - ft);

      // モルタル線（石ブロック風）
      ctx.strokeStyle = `rgba(0,0,0,0.45)`;
      ctx.lineWidth = 1;
      const bh = Math.max(8, Math.floor((fb - ft) / 3));
      for (let y = ft + bh; y < fb; y += bh) {
        ctx.beginPath();
        ctx.moveTo(fl, y);
        ctx.lineTo(fr, y);
        ctx.stroke();
      }
      // 縦目地（交互オフセット）
      const rows = Math.floor((fb - ft) / bh);
      for (let row = 0; row < rows; row++) {
        const offset = (row % 2) * Math.floor((fr - fl) / 4);
        const bw = Math.max(6, Math.floor((fr - fl) / 3));
        for (let x = fl + offset; x < fr; x += bw) {
          ctx.beginPath();
          ctx.moveTo(x, ft + row * bh);
          ctx.lineTo(x, ft + (row + 1) * bh);
          ctx.stroke();
        }
      }
    }

    // 左側面壁：FRAMES[d-1].left から FRAMES[d].left の台形
    if (left[d]) {
      ctx.fillStyle = rgb(SIDE_R, SIDE_G, SIDE_B, bright);
      ctx.beginPath();
      ctx.moveTo(nl, nt);
      ctx.lineTo(fl, ft);
      ctx.lineTo(fl, fb);
      ctx.lineTo(nl, nb);
      ctx.closePath();
      ctx.fill();

      // 前縁ハイライト
      ctx.strokeStyle = rgb(SIDE_R + 20, SIDE_G + 15, SIDE_B + 5, bright);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fl, ft);
      ctx.lineTo(fl, fb);
      ctx.stroke();
    }

    // 右側面壁
    if (right[d]) {
      ctx.fillStyle = rgb(SIDE_R, SIDE_G, SIDE_B, bright);
      ctx.beginPath();
      ctx.moveTo(fr, ft);
      ctx.lineTo(nr, nt);
      ctx.lineTo(nr, nb);
      ctx.lineTo(fr, fb);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = rgb(SIDE_R + 20, SIDE_G + 15, SIDE_B + 5, bright);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fr, ft);
      ctx.lineTo(fr, fb);
      ctx.stroke();
    }
  }

  // 通路が最遠まで続いている場合、奥の暗いエリアを示す
  if (!front[visDepth] && visDepth === MAX_DEPTH) {
    const [fl, ft, fr, fb] = FRAMES[MAX_DEPTH]!;
    ctx.fillStyle = '#050508';
    ctx.fillRect(fl, ft, fr - fl, fb - ft);
  }
}

export function MazeView({ state }: { state: MazeState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    renderScene(ctx, state);
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={VW}
      height={VH}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
}
