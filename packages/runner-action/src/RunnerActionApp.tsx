import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IGameEngine, EngineProps, GameContext } from '@novel-engine/hub';

export interface RunnerActionTheme {
  sky?: string;
  ground?: string;
  accent?: string;
}

export interface RunnerActionConfig {
  stageId: string;
  durationMs: number;
  name?: string;
  assetsBaseUrl?: string;
  backgroundImage?: string;
  backgroundLoopWidth?: number;
  playerImage?: string;
  playerWidth?: number;
  playerHeight?: number;
  theme?: RunnerActionTheme;
  _novelReturn?: unknown;
}

interface RunnerState {
  elapsedMs: number;
  y: number;
  velocityY: number;
  grounded: boolean;
  score: number;
  penaltyCount: number;
  penaltyUntilMs: number;
  collectedIds: string[];
  hitIds: string[];
}

interface FlyingObject {
  id: string;
  type: 'candy' | 'pot';
  spawnMs: number;
  laneY: number;
  speed: number;
  size: number;
}

const WIDTH = 800;
const HEIGHT = 600;
const LETTERBOX_Y = 50;
const PLAY_HEIGHT = HEIGHT - LETTERBOX_Y * 2;
const GROUND_Y = LETTERBOX_Y + PLAY_HEIGHT - 50;
const PLAYER_X = 150;
const PLAYER_W = 42;
const PLAYER_H = 72;
const GRAVITY = 0.0017;
const JUMP_VELOCITY = -0.82;
const DEFAULT_DURATION_MS = 30000;
const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";

const OBJECTS: FlyingObject[] = [
  { id: 'candy_01', type: 'candy', spawnMs: 1600, laneY: 356, speed: 0.34, size: 28 },
  { id: 'pot_01', type: 'pot', spawnMs: 3300, laneY: 395, speed: 0.38, size: 46 },
  { id: 'candy_02', type: 'candy', spawnMs: 4700, laneY: 318, speed: 0.37, size: 28 },
  { id: 'candy_03', type: 'candy', spawnMs: 6600, laneY: 392, speed: 0.42, size: 30 },
  { id: 'pot_02', type: 'pot', spawnMs: 8200, laneY: 342, speed: 0.43, size: 48 },
  { id: 'candy_04', type: 'candy', spawnMs: 10000, laneY: 360, speed: 0.46, size: 28 },
  { id: 'candy_05', type: 'candy', spawnMs: 11800, laneY: 302, speed: 0.42, size: 30 },
  { id: 'pot_03', type: 'pot', spawnMs: 13700, laneY: 400, speed: 0.48, size: 50 },
  { id: 'candy_06', type: 'candy', spawnMs: 15400, laneY: 340, speed: 0.48, size: 30 },
  { id: 'candy_07', type: 'candy', spawnMs: 17600, laneY: 388, speed: 0.52, size: 28 },
  { id: 'pot_04', type: 'pot', spawnMs: 19600, laneY: 330, speed: 0.52, size: 50 },
  { id: 'candy_08', type: 'candy', spawnMs: 21500, laneY: 358, speed: 0.55, size: 30 },
  { id: 'candy_09', type: 'candy', spawnMs: 23800, laneY: 305, speed: 0.5, size: 28 },
  { id: 'pot_05', type: 'pot', spawnMs: 26000, laneY: 390, speed: 0.56, size: 52 },
  { id: 'candy_10', type: 'candy', spawnMs: 27800, laneY: 346, speed: 0.58, size: 30 },
];

const DEFAULT_THEME: Required<RunnerActionTheme> = {
  sky: '#151827',
  ground: '#2a2d32',
  accent: '#f2d16b',
};

function mergeTheme(theme?: RunnerActionTheme): Required<RunnerActionTheme> {
  return { ...DEFAULT_THEME, ...theme };
}

function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT));
  const [scale, setScale] = useState(get);

  useEffect(() => {
    const update = () => setScale(get());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}

function resolveAsset(assetsBaseUrl: string | undefined, path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) return path;
  const base = assetsBaseUrl ?? '/assets';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

interface LoadedImage {
  image: HTMLImageElement | null;
  failed: boolean;
}

function useImage(src: string | undefined): LoadedImage {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) {
      setImage(null);
      setFailed(false);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) {
        setImage(img);
        setFailed(false);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setImage(null);
        setFailed(true);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return { image, failed };
}

function objectX(object: FlyingObject, elapsedMs: number): number {
  return WIDTH + 80 - Math.max(0, elapsedMs - object.spawnMs) * object.speed;
}

function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function playerTop(state: RunnerState, playerHeight: number): number {
  const jumpOffset = state.y - (GROUND_Y - PLAYER_H);
  return GROUND_Y - playerHeight + jumpOffset;
}

function drawCandy(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  const spin = Math.sin(time * 0.012) * 4;
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(Math.sin(time * 0.008) * 0.4);
  ctx.fillStyle = '#ff7aa8';
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.42, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff1b8';
  ctx.fillRect(-size * 0.14, -size * 0.28 + spin * 0.03, size * 0.28, size * 0.56);
  ctx.fillStyle = '#ffd6e5';
  ctx.beginPath();
  ctx.moveTo(-size * 0.38, 0);
  ctx.lineTo(-size * 0.62, -size * 0.2);
  ctx.lineTo(-size * 0.62, size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.38, 0);
  ctx.lineTo(size * 0.62, -size * 0.2);
  ctx.lineTo(size * 0.62, size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPot(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(time * 0.012);
  ctx.fillStyle = '#59606b';
  ctx.beginPath();
  ctx.roundRect(-size * 0.42, -size * 0.25, size * 0.84, size * 0.58, size * 0.12);
  ctx.fill();
  ctx.strokeStyle = '#d5dde8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -size * 0.32, size * 0.28, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2c3139';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.08);
  ctx.lineTo(-size * 0.7, -size * 0.08);
  ctx.moveTo(size * 0.5, -size * 0.08);
  ctx.lineTo(size * 0.7, -size * 0.08);
  ctx.stroke();
  ctx.restore();
}

function drawRunner(
  ctx: CanvasRenderingContext2D,
  state: RunnerState,
  config: Required<Pick<RunnerActionConfig, 'durationMs'>>,
  theme: Required<RunnerActionTheme>,
  assets: {
    backgroundImage: HTMLImageElement | null;
    backgroundImageConfigured: boolean;
    backgroundImageFailed: boolean;
    backgroundLoopWidth: number;
    playerImageEnabled: boolean;
    playerImageConfigured: boolean;
    playerImageFailed: boolean;
    playerWidth: number;
    playerHeight: number;
  },
) {
  const progress = Math.min(1, state.elapsedMs / config.durationMs);
  const scroll = state.elapsedMs * 0.18;
  const isPenalized = state.elapsedMs < state.penaltyUntilMs;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (assets.backgroundImage) {
    const aspectWidth = assets.backgroundImage.width * (PLAY_HEIGHT / assets.backgroundImage.height);
    const loopWidth = Math.max(1, assets.backgroundLoopWidth, aspectWidth);
    const drawHeight = loopWidth * (assets.backgroundImage.height / assets.backgroundImage.width);
    const y = LETTERBOX_Y + (drawHeight > PLAY_HEIGHT ? (PLAY_HEIGHT - drawHeight) / 2 : 0);
    const x0 = -((scroll * 0.65) % loopWidth);
    for (let x = x0 - loopWidth; x < WIDTH + loopWidth; x += loopWidth) {
      ctx.drawImage(assets.backgroundImage, x, y, loopWidth, drawHeight);
    }
  } else {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGradient.addColorStop(0, theme.sky);
    skyGradient.addColorStop(1, '#090a12');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, LETTERBOX_Y, WIDTH, PLAY_HEIGHT);

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 6; i += 1) {
      const x = (i * 180 - (scroll * 0.18) % 180 + WIDTH) % WIDTH;
      ctx.fillRect(x, 120 + (i % 2) * 34, 82, 10);
    }

    ctx.fillStyle = '#202431';
    for (let i = 0; i < 9; i += 1) {
      const x = (i * 130 - (scroll * 0.48) % 130 + WIDTH) % WIDTH;
      const h = 78 + (i % 3) * 34;
      ctx.fillRect(x, GROUND_Y - h, 72, h);
      ctx.fillStyle = 'rgba(242,209,107,0.22)';
      ctx.fillRect(x + 16, GROUND_Y - h + 18, 10, 16);
      ctx.fillRect(x + 44, GROUND_Y - h + 46, 10, 16);
      ctx.fillStyle = '#202431';
    }
  }

  if (!assets.backgroundImage) {
    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
    ctx.fillStyle = '#11131a';
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 58 - scroll % 58 + WIDTH) % WIDTH;
      ctx.fillRect(x, GROUND_Y + 18, 34, 4);
    }

    for (let i = 0; i < 7; i += 1) {
      const x = (i * 190 - (scroll * 0.95) % 190 + WIDTH) % WIDTH;
      const height = 28 + (i % 2) * 18;
      ctx.fillStyle = '#342739';
      ctx.fillRect(x, GROUND_Y - height, 38, height);
      ctx.fillStyle = theme.accent;
      ctx.fillRect(x + 8, GROUND_Y - height - 8, 22, 8);
    }
  }

  const bob = state.grounded ? Math.sin(state.elapsedMs * 0.018) * 3 : 0;
  const playerY = state.y + bob;
  const playerKnockbackX = isPenalized ? -34 + Math.sin(state.elapsedMs * 0.08) * 8 : 0;
  if (!assets.playerImageEnabled) {
    ctx.fillStyle = '#f1f3f5';
    ctx.fillRect(PLAYER_X + playerKnockbackX + 10, playerY, 22, 22);
    ctx.fillStyle = theme.accent;
    ctx.fillRect(PLAYER_X + playerKnockbackX, playerY + 24, PLAYER_W, 36);
    ctx.fillStyle = '#11131a';
    ctx.fillRect(PLAYER_X + playerKnockbackX + 6, playerY + 58, 12, 24);
    ctx.fillRect(PLAYER_X + playerKnockbackX + 25, playerY + 58, 12, 24);
    ctx.fillStyle = '#f1f3f5';
    ctx.fillRect(PLAYER_X + playerKnockbackX + PLAYER_W, playerY + 30, 20, 10);
  }

  for (const object of OBJECTS) {
    if (state.collectedIds.includes(object.id) || state.hitIds.includes(object.id)) continue;
    const x = objectX(object, state.elapsedMs);
    if (x < -100 || x > WIDTH + 120) continue;
    if (object.type === 'candy') {
      drawCandy(ctx, x, object.laneY, object.size, state.elapsedMs);
    } else {
      drawPot(ctx, x, object.laneY, object.size, state.elapsedMs);
    }
  }

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(24, 24, 752, 56);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(44, 58, 712, 8);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(44, 58, 712 * progress, 8);
  ctx.fillStyle = '#f7f2dc';
  ctx.font = `20px ${FONT}`;
  ctx.fillText('アーケード街の死闘', 44, 48);
  ctx.font = `14px ${FONT}`;
  ctx.fillText(`${Math.ceil((config.durationMs - state.elapsedMs) / 1000)}秒`, 708, 48);
  ctx.fillText(`アメ ${state.score}`, 610, 48);
  if (isPenalized) {
    ctx.fillStyle = 'rgba(120,0,0,0.7)';
    ctx.fillRect(300, 92, 200, 32);
    ctx.fillStyle = '#fff4e8';
    ctx.font = `16px ${FONT}`;
    ctx.fillText('鍋に当たった！', 344, 114);
  }

  const warnings = [
    assets.backgroundImageConfigured && assets.backgroundImageFailed ? 'background image not found' : null,
    assets.playerImageConfigured && assets.playerImageFailed ? 'player image not found' : null,
  ].filter(Boolean);
  if (warnings.length > 0) {
    ctx.fillStyle = 'rgba(120,0,0,0.72)';
    ctx.fillRect(24, 92, 360, 30);
    ctx.fillStyle = '#fff4e8';
    ctx.font = `13px ${FONT}`;
    ctx.fillText(warnings.join(' / '), 38, 112);
  }
}

function RunnerActionAppComponent({
  context,
  config,
  onExit,
}: EngineProps<RunnerActionConfig>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<RunnerState>({
    elapsedMs: 0,
    y: GROUND_Y - PLAYER_H,
    velocityY: 0,
    grounded: true,
    score: 0,
    penaltyCount: 0,
    penaltyUntilMs: 0,
    collectedIds: [],
    hitIds: [],
  });
  const lastTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const scale = useGameScale();
  const theme = useMemo(() => mergeTheme(config.theme), [config.theme]);
  const durationMs = Math.max(1000, config.durationMs || DEFAULT_DURATION_MS);
  const stageId = config.stageId || 'default';
  const backgroundImageSrc = resolveAsset(config.assetsBaseUrl, config.backgroundImage);
  const playerImageSrc = resolveAsset(config.assetsBaseUrl, config.playerImage);
  const backgroundAsset = useImage(backgroundImageSrc);
  const playerAsset = useImage(playerImageSrc);
  const backgroundLoopWidth = Math.max(1, config.backgroundLoopWidth ?? WIDTH);
  const playerWidth = Math.max(1, config.playerWidth ?? 74);
  const playerHeight = Math.max(1, config.playerHeight ?? 104);

  const jump = useCallback(() => {
    const state = stateRef.current;
    if (!state.grounded) return;
    stateRef.current = { ...state, velocityY: JUMP_VELOCITY, grounded: false };
  }, []);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const finalState = stateRef.current;
    const updatedContext: GameContext = {
      ...context,
      flags: {
        ...context.flags,
        cleared_runner_action: true,
        [`cleared_runner_action_${stageId}`]: true,
        runner_action_score: finalState.score,
        [`runner_action_score_${stageId}`]: finalState.score,
        runner_action_penalties: finalState.penaltyCount,
        [`runner_action_penalties_${stageId}`]: finalState.penaltyCount,
      },
      playerStats: {
        ...context.playerStats,
        runnerScore: finalState.score,
        runnerPenalties: finalState.penaltyCount,
      },
    };
    onExit(updatedContext);
  }, [context, onExit, stageId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      jump();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jump]);

  useEffect(() => {
    let frameId = 0;
    const tick = (time: number) => {
      const last = lastTimeRef.current ?? time;
      const delta = Math.min(40, time - last);
      lastTimeRef.current = time;

      const prev = stateRef.current;
      const elapsed = Math.min(durationMs, prev.elapsedMs + delta);
      let velocityY = prev.velocityY + GRAVITY * delta;
      let y = prev.y + velocityY * delta;
      let grounded = false;
      const floorY = GROUND_Y - PLAYER_H;
      if (y >= floorY) {
        y = floorY;
        velocityY = 0;
        grounded = true;
      }
      let next: RunnerState = { ...prev, elapsedMs: elapsed, y, velocityY, grounded };
      const isCurrentlyPenalized = elapsed < next.penaltyUntilMs;
      const hitboxWidth = Math.max(24, Math.min(playerWidth, 74) - 12);
      const hitboxHeight = Math.max(48, Math.min(playerHeight, 104) - 8);
      const playerRect = {
        x: PLAYER_X + (isCurrentlyPenalized ? -34 : 0) + 8,
        y: playerTop(next, playerHeight) + 4,
        width: hitboxWidth,
        height: hitboxHeight,
      };
      for (const object of OBJECTS) {
        if (next.collectedIds.includes(object.id) || next.hitIds.includes(object.id)) continue;
        const x = objectX(object, elapsed);
        if (x < -100 || x > WIDTH + 120) continue;
        const objectRect = {
          x,
          y: object.laneY,
          width: object.size,
          height: object.size,
        };
        if (!rectsOverlap(playerRect, objectRect)) continue;
        if (object.type === 'candy') {
          next = {
            ...next,
            score: next.score + 1,
            collectedIds: [...next.collectedIds, object.id],
          };
        } else {
          next = {
            ...next,
            score: Math.max(0, next.score - 2),
            penaltyCount: next.penaltyCount + 1,
            penaltyUntilMs: elapsed + 900,
            hitIds: [...next.hitIds, object.id],
          };
        }
      }
      stateRef.current = next;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        drawRunner(ctx, next, { durationMs }, theme, {
          backgroundImage: backgroundAsset.image,
          backgroundImageConfigured: Boolean(backgroundImageSrc),
          backgroundImageFailed: backgroundAsset.failed,
          backgroundLoopWidth,
          playerImageEnabled: Boolean(playerImageSrc) && !playerAsset.failed,
          playerImageConfigured: Boolean(playerImageSrc),
          playerImageFailed: playerAsset.failed,
          playerWidth,
          playerHeight,
        });
      }

      setElapsedMs(elapsed);
      if (elapsed >= durationMs) {
        finish();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [
    backgroundAsset.failed,
    backgroundAsset.image,
    backgroundImageSrc,
    backgroundLoopWidth,
    durationMs,
    finish,
    playerAsset.failed,
    playerAsset.image,
    playerHeight,
    playerImageSrc,
    playerWidth,
    stageId,
    theme,
  ]);

  const progress = Math.min(1, elapsedMs / durationMs);
  const currentState = stateRef.current;
  const isPenalized = currentState.elapsedMs < currentState.penaltyUntilMs;
  const playerBob = currentState.grounded ? Math.sin(currentState.elapsedMs * 0.018) * 3 : 0;
  const playerKnockbackX = isPenalized ? -34 + Math.sin(currentState.elapsedMs * 0.08) * 8 : 0;
  const playerLeft = PLAYER_X + playerKnockbackX;
  const playerTopPx = playerTop(currentState, playerHeight) + playerBob;
  const showDomPlayer = Boolean(playerImageSrc) && !playerAsset.failed;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05060a',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          background: theme.sky,
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
          fontFamily: FONT,
        }}
        onMouseDown={jump}
        onTouchStart={(event) => {
          event.preventDefault();
          jump();
        }}
      >
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ display: 'block' }} />
        {showDomPlayer && (
          <img
            src={playerImageSrc}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: playerLeft,
              top: playerTopPx,
              width: playerWidth,
              height: playerHeight,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#f7f2dc',
            fontSize: 14,
            textShadow: '0 2px 6px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
          }}
        >
          <span>{config.name ?? 'Runner Action'}</span>
          <span>Space / Enter / Click</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

export const RunnerActionEngine: IGameEngine<RunnerActionConfig> = {
  component: RunnerActionAppComponent,
};
