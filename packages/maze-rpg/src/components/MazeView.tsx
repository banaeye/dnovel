import { useEffect, useRef } from 'react';
import type { MazeState } from '../engine/types.js';
import type { MazeTheme } from '../MazeApp.js';
import { getViewData } from '../engine/mazeEngine.js';

const VW = 480;
const VH = 320;
const MAX_DEPTH = 4;

// [left, top, right, bottom] — 各深さのスクリーン上「窓枠」
const FRAMES: [number, number, number, number][] = [
  [0,   0,   480, 320],
  [60,  40,  420, 280],
  [120, 80,  360, 240],
  [172, 110, 308, 210],
  [207, 128, 273, 192],
];

const DEPTH_BRIGHT = [1.0, 1.0, 0.78, 0.56, 0.38];

function rgb(r: number, g: number, b: number, f: number): string {
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

function renderScene(ctx: CanvasRenderingContext2D, state: MazeState, theme: Required<MazeTheme>) {
  const { front, left, right } = getViewData(state, MAX_DEPTH);

  const [fr, fg, fb] = hexToRgb(theme.wallFront);
  const [sr, sg, sb] = hexToRgb(theme.wallSide);

  // 背景：天井（上半分）と床（下半分）のグラデーション
  const ceilGrad = ctx.createLinearGradient(0, 0, 0, VH / 2);
  ceilGrad.addColorStop(0, theme.ceilTop);
  ceilGrad.addColorStop(1, theme.ceilBottom);
  ctx.fillStyle = ceilGrad;
  ctx.fillRect(0, 0, VW, VH / 2);

  const floorGrad = ctx.createLinearGradient(0, VH / 2, 0, VH);
  floorGrad.addColorStop(0, theme.floorTop);
  floorGrad.addColorStop(1, theme.floorBottom);
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, VH / 2, VW, VH / 2);

  let visDepth = MAX_DEPTH;
  for (let d = 1; d <= MAX_DEPTH; d++) {
    if (front[d]) { visDepth = d; break; }
  }

  for (let d = visDepth; d >= 1; d--) {
    const bright = DEPTH_BRIGHT[d] ?? 0.3;
    const [fl, ft, frf, ffb] = FRAMES[d]!;
    const [nl, nt, nr, nb] = FRAMES[d - 1]!;

    if (front[d]) {
      ctx.fillStyle = rgb(fr, fg, fb, bright);
      ctx.fillRect(fl, ft, frf - fl, ffb - ft);

      ctx.strokeStyle = `rgba(0,0,0,0.45)`;
      ctx.lineWidth = 1;
      const bh = Math.max(8, Math.floor((ffb - ft) / 3));
      for (let y = ft + bh; y < ffb; y += bh) {
        ctx.beginPath(); ctx.moveTo(fl, y); ctx.lineTo(frf, y); ctx.stroke();
      }
      const rows = Math.floor((ffb - ft) / bh);
      for (let row = 0; row < rows; row++) {
        const offset = (row % 2) * Math.floor((frf - fl) / 4);
        const bw = Math.max(6, Math.floor((frf - fl) / 3));
        for (let x = fl + offset; x < frf; x += bw) {
          ctx.beginPath(); ctx.moveTo(x, ft + row * bh); ctx.lineTo(x, ft + (row + 1) * bh); ctx.stroke();
        }
      }
    }

    if (left[d]) {
      ctx.fillStyle = rgb(sr, sg, sb, bright);
      ctx.beginPath();
      ctx.moveTo(nl, nt); ctx.lineTo(fl, ft); ctx.lineTo(fl, ffb); ctx.lineTo(nl, nb);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgb(sr + 20, sg + 15, sb + 5, bright);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(fl, ft); ctx.lineTo(fl, ffb); ctx.stroke();
    }

    if (right[d]) {
      ctx.fillStyle = rgb(sr, sg, sb, bright);
      ctx.beginPath();
      ctx.moveTo(frf, ft); ctx.lineTo(nr, nt); ctx.lineTo(nr, nb); ctx.lineTo(frf, ffb);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgb(sr + 20, sg + 15, sb + 5, bright);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(frf, ft); ctx.lineTo(frf, ffb); ctx.stroke();
    }
  }

  if (!front[visDepth] && visDepth === MAX_DEPTH) {
    const [fl, ft, frf, ffb] = FRAMES[MAX_DEPTH]!;
    ctx.fillStyle = theme.ceilTop;
    ctx.fillRect(fl, ft, frf - fl, ffb - ft);
  }
}

const DEFAULT_THEME: Required<MazeTheme> = {
  ceilTop: '#020213', ceilBottom: '#0d0d25',
  floorTop: '#130a02', floorBottom: '#060300',
  wallFront: '#9a7420', wallSide: '#5a420a',
  uiBg: '#080504', uiAccent: '#ccaa66', uiBorder: '#443322',
};

export function MazeView({ state, theme }: { state: MazeState; theme?: Required<MazeTheme> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectiveTheme = theme ?? DEFAULT_THEME;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    renderScene(ctx, state, effectiveTheme);
  }, [state, effectiveTheme]);

  return (
    <canvas
      ref={canvasRef}
      width={VW}
      height={VH}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
}
