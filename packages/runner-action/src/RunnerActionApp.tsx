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
  theme?: RunnerActionTheme;
  _novelReturn?: unknown;
}

interface RunnerState {
  elapsedMs: number;
  y: number;
  velocityY: number;
  grounded: boolean;
}

const WIDTH = 800;
const HEIGHT = 600;
const GROUND_Y = 455;
const PLAYER_X = 150;
const PLAYER_W = 42;
const PLAYER_H = 72;
const GRAVITY = 0.0017;
const JUMP_VELOCITY = -0.82;
const DEFAULT_DURATION_MS = 30000;
const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";

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

function drawRunner(
  ctx: CanvasRenderingContext2D,
  state: RunnerState,
  config: Required<Pick<RunnerActionConfig, 'durationMs'>>,
  theme: Required<RunnerActionTheme>,
) {
  const progress = Math.min(1, state.elapsedMs / config.durationMs);
  const scroll = state.elapsedMs * 0.18;

  const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  skyGradient.addColorStop(0, theme.sky);
  skyGradient.addColorStop(1, '#090a12');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

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

  const bob = state.grounded ? Math.sin(state.elapsedMs * 0.018) * 3 : 0;
  const playerY = state.y + bob;
  ctx.fillStyle = '#f1f3f5';
  ctx.fillRect(PLAYER_X + 10, playerY, 22, 22);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(PLAYER_X, playerY + 24, PLAYER_W, 36);
  ctx.fillStyle = '#11131a';
  ctx.fillRect(PLAYER_X + 6, playerY + 58, 12, 24);
  ctx.fillRect(PLAYER_X + 25, playerY + 58, 12, 24);
  ctx.fillStyle = '#f1f3f5';
  ctx.fillRect(PLAYER_X + PLAYER_W, playerY + 30, 20, 10);

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
  });
  const lastTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const scale = useGameScale();
  const theme = useMemo(() => mergeTheme(config.theme), [config.theme]);
  const durationMs = Math.max(1000, config.durationMs || DEFAULT_DURATION_MS);
  const stageId = config.stageId || 'default';

  const jump = useCallback(() => {
    const state = stateRef.current;
    if (!state.grounded) return;
    stateRef.current = { ...state, velocityY: JUMP_VELOCITY, grounded: false };
  }, []);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const updatedContext: GameContext = {
      ...context,
      flags: {
        ...context.flags,
        cleared_runner_action: true,
        [`cleared_runner_action_${stageId}`]: true,
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
      const next = { elapsedMs: elapsed, y, velocityY, grounded };
      stateRef.current = next;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) drawRunner(ctx, next, { durationMs }, theme);

      setElapsedMs(elapsed);
      if (elapsed >= durationMs) {
        finish();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [durationMs, finish, stageId, theme]);

  const progress = Math.min(1, elapsedMs / durationMs);

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
