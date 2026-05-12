import { useEffect, useRef } from 'react';
import type { MazeState } from '../engine/types.js';
import type { MazeTheme } from '../MazeApp.js';
import { getCell, getForwardPos, getViewData, isTreasureOpen, isTreasureTile } from '../engine/mazeEngine.js';

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

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function drawWallDamage(
  ctx: CanvasRenderingContext2D,
  rect: [number, number, number, number],
  depth: number,
  theme: Required<MazeTheme>,
  side: 'front' | 'left' | 'right',
) {
  const damage = clamp01(theme.wallDamage);
  if (damage <= 0.02) return;

  const [left, top, right, bottom] = rect;
  const width = right - left;
  const height = bottom - top;
  const [sr, sg, sb] = hexToRgb(theme.wallStain);
  const alpha = Math.max(0.12, damage * 0.36) / Math.max(1, depth * 0.72);
  const crackCount = Math.max(1, Math.round(damage * (side === 'front' ? 7 : 4)));
  const patchCount = Math.max(1, Math.round(damage * (side === 'front' ? 5 : 3)));

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, width, height);
  ctx.clip();

  for (let i = 0; i < patchCount; i++) {
    const px = left + width * ((0.18 + i * 0.23 + depth * 0.07) % 0.82);
    const py = top + height * ((0.16 + i * 0.31 + depth * 0.11) % 0.72);
    const pw = width * (0.09 + damage * 0.12) / Math.max(1, depth * 0.25);
    const ph = height * (0.05 + damage * 0.09);
    ctx.fillStyle = `rgba(${sr},${sg},${sb},${alpha})`;
    ctx.beginPath();
    ctx.ellipse(px, py, pw, ph, (i % 2 ? -0.35 : 0.25), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = `rgba(16,10,8,${Math.min(0.62, 0.22 + damage * 0.48)})`;
  ctx.lineWidth = Math.max(1, damage * 2.4 / depth);
  for (let i = 0; i < crackCount; i++) {
    const x = left + width * ((0.12 + i * 0.19 + depth * 0.05) % 0.84);
    const y = top + height * ((0.2 + i * 0.29 + depth * 0.09) % 0.65);
    const len = height * (0.08 + damage * 0.13);
    const lean = width * (side === 'right' ? -0.04 : side === 'left' ? 0.04 : 0.02);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + lean, y + len * 0.45);
    ctx.lineTo(x - lean * 0.55, y + len);
    if (damage > 0.45) {
      ctx.moveTo(x + lean * 0.15, y + len * 0.48);
      ctx.lineTo(x + lean * 1.8, y + len * 0.7);
    }
    ctx.stroke();
  }

  if (damage > 0.55) {
    ctx.fillStyle = `rgba(235,220,180,${0.05 + damage * 0.08})`;
    for (let i = 0; i < 10; i++) {
      const x = left + width * ((i * 0.17 + depth * 0.13) % 1);
      const y = top + height * ((i * 0.23 + depth * 0.19) % 1);
      ctx.fillRect(x, y, Math.max(1, width * 0.012), Math.max(1, height * 0.01));
    }
  }

  ctx.restore();
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
      drawWallDamage(ctx, [fl, ft, frf, ffb], d, theme, 'front');
    }

    if (left[d]) {
      ctx.fillStyle = rgb(sr, sg, sb, bright);
      ctx.beginPath();
      ctx.moveTo(nl, nt); ctx.lineTo(fl, ft); ctx.lineTo(fl, ffb); ctx.lineTo(nl, nb);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgb(sr + 20, sg + 15, sb + 5, bright);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(fl, ft); ctx.lineTo(fl, ffb); ctx.stroke();
      drawWallDamage(ctx, [nl, nt, fl, nb], d, theme, 'left');
    }

    if (right[d]) {
      ctx.fillStyle = rgb(sr, sg, sb, bright);
      ctx.beginPath();
      ctx.moveTo(frf, ft); ctx.lineTo(nr, nt); ctx.lineTo(nr, nb); ctx.lineTo(frf, ffb);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgb(sr + 20, sg + 15, sb + 5, bright);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(frf, ft); ctx.lineTo(frf, ffb); ctx.stroke();
      drawWallDamage(ctx, [frf, nt, nr, nb], d, theme, 'right');
    }
  }

  if (!front[visDepth] && visDepth === MAX_DEPTH) {
    const [fl, ft, frf, ffb] = FRAMES[MAX_DEPTH]!;
    ctx.fillStyle = theme.ceilTop;
    ctx.fillRect(fl, ft, frf - fl, ffb - ft);
  }

  for (let d = 1; d <= MAX_DEPTH; d++) {
    const pos = getForwardPos(state, d);
    const tile = getCell(state.map, pos.x, pos.y);
    if (tile === '#') break;
    if (isTreasureTile(state, tile)) {
      if (!isTreasureOpen(state, state.floor, pos)) drawTreasureChest(ctx, d, tile);
      break;
    }
    if (front[d]) break;
  }
}

function drawTreasureChest(ctx: CanvasRenderingContext2D, depth: number, tile: string) {
  const frame = FRAMES[depth] ?? FRAMES[MAX_DEPTH]!;
  const [fl, ft, fr, fb] = frame;
  const scale = Math.max(0.35, 1.2 - depth * 0.2);
  const cx = (fl + fr) / 2;
  const baseY = fb - (fb - ft) * 0.18;
  const w = Math.max(28, (fr - fl) * 0.36 * scale);
  const h = Math.max(20, (fb - ft) * 0.26 * scale);
  const x = cx - w / 2;
  const y = baseY - h;
  const glow = tile === 'h' ? '#d8b4ff' : '#ffd36b';

  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 16 / depth;

  const lidGrad = ctx.createLinearGradient(x, y, x, y + h * 0.45);
  lidGrad.addColorStop(0, '#a06a20');
  lidGrad.addColorStop(1, '#4a2608');
  ctx.fillStyle = lidGrad;
  ctx.beginPath();
  ctx.moveTo(x + 8 * scale, y + h * 0.42);
  ctx.quadraticCurveTo(cx, y - h * 0.25, x + w - 8 * scale, y + h * 0.42);
  ctx.lineTo(x + w - 4 * scale, y + h * 0.58);
  ctx.lineTo(x + 4 * scale, y + h * 0.58);
  ctx.closePath();
  ctx.fill();

  const bodyGrad = ctx.createLinearGradient(x, y + h * 0.4, x, y + h);
  bodyGrad.addColorStop(0, '#7b3f10');
  bodyGrad.addColorStop(1, '#2a1204');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x, y + h * 0.42, w, h * 0.58);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#f0c060';
  ctx.lineWidth = Math.max(1, 3 / depth);
  ctx.strokeRect(x + w * 0.08, y + h * 0.48, w * 0.84, h * 0.44);

  ctx.fillStyle = glow;
  ctx.fillRect(cx - w * 0.08, y + h * 0.5, w * 0.16, h * 0.22);
  ctx.fillStyle = '#1a0802';
  ctx.fillRect(cx - w * 0.035, y + h * 0.56, w * 0.07, h * 0.08);

  ctx.fillStyle = 'rgba(255,235,160,0.85)';
  ctx.beginPath();
  ctx.arc(x + w * 0.2, y + h * 0.62, Math.max(2, 4 / depth), 0, Math.PI * 2);
  ctx.arc(x + w * 0.8, y + h * 0.62, Math.max(2, 4 / depth), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const DEFAULT_THEME: Required<MazeTheme> = {
  ceilTop: '#020213', ceilBottom: '#0d0d25',
  floorTop: '#130a02', floorBottom: '#060300',
  wallFront: '#9a7420', wallSide: '#5a420a',
  uiBg: '#080504', uiAccent: '#ccaa66', uiBorder: '#443322',
  wallDamage: 0, wallStain: '#1b1208',
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
