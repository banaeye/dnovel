import { useEffect, useRef, useMemo } from 'react';
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

function rgbaFromHex(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
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

  if (getCell(state.map, state.pos.x, state.pos.y) === 'D') {
    drawDownStairs(ctx, 0, theme);
  }

  for (let d = 1; d <= MAX_DEPTH; d++) {
    const pos = getForwardPos(state, d);
    const tile = getCell(state.map, pos.x, pos.y);
    if (tile === '#') break;
    if (tile === 'D') {
      drawDownStairs(ctx, d, theme);
      break;
    }
    if (isTreasureTile(state, tile)) {
      if (!isTreasureOpen(state, state.floor, pos)) drawTreasureChest(ctx, d, tile);
      break;
    }
    if (front[d]) break;
  }

  // 霧は別キャンバスでアニメーション描画するため、ここでは描かない
}

// 霧パーティクルのシード値（起動時に1度だけ生成、再レンダリングごとにリセットしない）
interface MistParticle {
  bx: number; by: number; rx: number; ry: number; angle: number;
  dxFreq: number; dxAmp: number; dyFreq: number; dyAmp: number;
  alphaBase: number; alphaFreq: number; alphaPhase: number;
}
interface MistWisp {
  by: number; speed: number; dir: number; rx: number; ry: number;
  alphaBase: number; alphaFreq: number; alphaPhase: number;
}

function buildMistParticles(density: number): { blobs: MistParticle[]; wisps: MistWisp[] } {
  const blobCount = Math.round(18 + density * 32);
  const blobs: MistParticle[] = Array.from({ length: blobCount }, (_, i) => {
    const s = (i * 37 + 97) % 211;
    return {
      bx: (s * 29 + i * 53) % VW,
      by: 10 + ((s * 13 + i * 31) % (VH - 20)),
      rx: 14 + (s % 40) * (0.5 + 0.5 * density),
      ry: 3 + (s % 7),
      angle: (s % 9) * 0.08,
      dxFreq: 0.11 + (s % 10) * 0.018,
      dxAmp:  12 + (s % 24) * density,
      dyFreq: 0.08 + (s % 8) * 0.013,
      dyAmp:  4 + s % 9,
      alphaBase:  0.04 + density * 0.11,
      alphaFreq:  0.22 + (s % 5) * 0.09,
      alphaPhase: i * 1.3,
    };
  });
  const wispCount = Math.round(2 + density * 5);
  const wisps: MistWisp[] = Array.from({ length: wispCount }, (_, i) => {
    const s = i * 73 + 41;
    return {
      by:        12 + ((s * 17) % (VH - 24)),
      speed:     (0.022 + (s % 10) * 0.006) * VW,
      dir:       i % 2 === 0 ? 1 : -1,
      rx:        38 + (s % 60) * density,
      ry:        4 + (s % 8),
      alphaBase: 0.05 + density * 0.10,
      alphaFreq: 0.18,
      alphaPhase: s * 0.1,
    };
  });
  return { blobs, wisps };
}

function drawAnimatedMist(
  ctx: CanvasRenderingContext2D,
  theme: Required<MazeTheme>,
  density: number,
  t: number,
  particles: { blobs: MistParticle[]; wisps: MistWisp[] },
) {
  ctx.clearRect(0, 0, VW, VH);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // ゆっくり脈打つベースグラデーション
  const baseAlpha = 0.07 + density * 0.19;
  const pulse = 0.85 + 0.15 * Math.sin(t * 0.32);
  const grad = ctx.createLinearGradient(0, 0, 0, VH);
  grad.addColorStop(0,   rgbaFromHex(theme.mistColor, baseAlpha * 0.62 * pulse));
  grad.addColorStop(0.5, rgbaFromHex(theme.mistColor, baseAlpha * pulse));
  grad.addColorStop(1,   rgbaFromHex(theme.mistColor, baseAlpha * 0.48 * pulse));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VW, VH);

  // 漂うブロブ
  for (const p of particles.blobs) {
    const px = (((p.bx + Math.sin(t * p.dxFreq + p.bx) * p.dxAmp) % VW) + VW) % VW;
    const py = Math.max(5, Math.min(VH - 5, p.by + Math.cos(t * p.dyFreq + p.by * 0.05) * p.dyAmp));
    const alpha = p.alphaBase * (0.6 + 0.4 * Math.sin(t * p.alphaFreq + p.alphaPhase));
    ctx.fillStyle = rgbaFromHex(theme.mistColor, alpha);
    ctx.beginPath();
    ctx.ellipse(px, py, p.rx, p.ry, p.angle + Math.sin(t * 0.17) * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // 横に流れるウィスプ
  for (const w of particles.wisps) {
    const wx = ((w.dir * t * w.speed + w.by * 40) % VW + VW) % VW;
    const alpha = w.alphaBase * (0.65 + 0.35 * Math.sin(t * w.alphaFreq + w.alphaPhase));
    ctx.fillStyle = rgbaFromHex(theme.mistColor, alpha);
    for (const ox of [0, w.dir > 0 ? -VW : VW]) {
      ctx.beginPath();
      ctx.ellipse(wx + ox, w.by, w.rx, w.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawDownStairs(ctx: CanvasRenderingContext2D, depth: number, theme: Required<MazeTheme>) {
  const frame = depth === 0 ? FRAMES[1]! : FRAMES[depth] ?? FRAMES[MAX_DEPTH]!;
  const [fl, ft, fr, fb] = frame;
  const near = depth === 0;
  const cx = (fl + fr) / 2;
  const floorTop = VH / 2;
  const baseY = near ? VH - 22 : fb - (fb - ft) * 0.08;
  const topY = near ? Math.max(floorTop + 30, VH - 94) : fb - (fb - ft) * 0.34;
  const width = near ? 230 : Math.max(34, (fr - fl) * 0.54);
  const topWidth = width * 0.42;
  const bottomWidth = width;
  const height = Math.max(18, baseY - topY);
  const alpha = near ? 0.92 : Math.max(0.38, 0.9 / Math.max(1, depth * 0.86));

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = rgbaFromHex(theme.uiAccent, 0.65);
  ctx.shadowBlur = near ? 18 : 10 / Math.max(1, depth);

  const pitGrad = ctx.createLinearGradient(cx, topY, cx, baseY);
  pitGrad.addColorStop(0, rgbaFromHex(theme.floorBottom, 0.25));
  pitGrad.addColorStop(0.35, '#05070d');
  pitGrad.addColorStop(1, '#000000');
  ctx.fillStyle = pitGrad;
  ctx.beginPath();
  ctx.moveTo(cx - topWidth / 2, topY);
  ctx.lineTo(cx + topWidth / 2, topY);
  ctx.lineTo(cx + bottomWidth / 2, baseY);
  ctx.lineTo(cx - bottomWidth / 2, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = rgbaFromHex(theme.uiAccent, near ? 0.62 : 0.42);
  ctx.lineWidth = Math.max(1, near ? 3 : 2 / Math.max(1, depth));
  ctx.beginPath();
  ctx.moveTo(cx - topWidth / 2, topY);
  ctx.lineTo(cx - bottomWidth / 2, baseY);
  ctx.moveTo(cx + topWidth / 2, topY);
  ctx.lineTo(cx + bottomWidth / 2, baseY);
  ctx.stroke();

  const stepCount = near ? 6 : Math.max(3, 7 - depth);
  for (let i = 1; i <= stepCount; i++) {
    const t = i / (stepCount + 1);
    const y = topY + height * t;
    const w = topWidth + (bottomWidth - topWidth) * t;
    ctx.strokeStyle = `rgba(180,225,255,${near ? 0.44 : 0.34})`;
    ctx.lineWidth = Math.max(1, near ? 2 : 1);
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, y);
    ctx.lineTo(cx + w / 2, y);
    ctx.stroke();
  }

  ctx.fillStyle = rgbaFromHex(theme.uiAccent, near ? 0.16 : 0.1);
  ctx.beginPath();
  ctx.ellipse(cx, topY + height * 0.28, bottomWidth * 0.22, height * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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
  mistColor: '#d8e8ff', mistDensity: 0,
};

export function MazeView({ state, theme }: { state: MazeState; theme?: Required<MazeTheme> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mistCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const effectiveTheme = theme ?? DEFAULT_THEME;

  // 静的シーン（壁・床）— state/theme が変わったときだけ再描画
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    renderScene(ctx, state, effectiveTheme);
  }, [state, effectiveTheme]);

  // 霧パーティクルのパラメータは density が変わったときだけ再生成
  const density = Math.max(0, Math.min(1, effectiveTheme.mistDensity));
  const particles = useMemo(() => buildMistParticles(density), [density]);

  // 霧アニメーションループ — 別キャンバスで rAF 駆動
  useEffect(() => {
    if (density <= 0.01) {
      const ctx = mistCanvasRef.current?.getContext('2d');
      ctx?.clearRect(0, 0, VW, VH);
      return;
    }
    const canvas = mistCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const startTime = performance.now();
    function animate(now: number) {
      drawAnimatedMist(ctx!, effectiveTheme, density, (now - startTime) / 1000, particles);
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [effectiveTheme, density, particles]);

  return (
    <div style={{ position: 'relative', width: VW, height: VH, display: 'block' }}>
      <canvas
        ref={canvasRef}
        width={VW}
        height={VH}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      />
      <canvas
        ref={mistCanvasRef}
        width={VW}
        height={VH}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
