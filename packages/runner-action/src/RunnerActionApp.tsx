import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IGameEngine, EngineProps, GameContext } from '@novel-engine/hub';

export interface RunnerActionTheme {
  sky?: string;
  ground?: string;
  accent?: string;
}

export type RunnerActionMode = 'collect' | 'chase';

export interface RunnerActionConfig {
  stageId: string;
  durationMs: number;
  mode?: RunnerActionMode;
  name?: string;
  assetsBaseUrl?: string;
  backgroundImage?: string;
  backgroundLoopWidth?: number;
  bgm?: string;
  bgmVolume?: number;
  playerImage?: string;
  playerWidth?: number;
  playerHeight?: number;
  opponentImage?: string;
  opponentWidth?: number;
  opponentHeight?: number;
  bossImage?: string;
  bossWidth?: number;
  bossHeight?: number;
  objectSpeedMultiplier?: number;
  stompEnemies?: boolean;
  enemySet?: 'entrance' | 'deep' | 'boss';
  lives?: number;
  chaseStartDistance?: number;
  chaseCatchRate?: number;
  chaseHitDistancePenalty?: number;
  theme?: RunnerActionTheme;
  _novelReturn?: unknown;
}

interface RunnerState {
  elapsedMs: number;
  worldElapsedMs: number;
  y: number;
  velocityY: number;
  grounded: boolean;
  score: number;
  penaltyCount: number;
  penaltyUntilMs: number;
  scrollFreezeUntilMs: number;
  chaseDistance: number;
  collectedIds: string[];
  hitIds: string[];
  defeated: DefeatedObject[];
  gameOverAtMs: number | null;
  clearRunAtMs: number | null;
}

interface FlyingObject {
  id: string;
  type: 'candy' | 'pot' | 'dog' | 'bird' | 'hitodama';
  spawnMs: number;
  laneY: number;
  speed: number;
  size: number;
  pattern?: 'straight' | 'diagonalDrop' | 'wobble' | 'bossShot';
}

interface DefeatedObject {
  id: string;
  type: FlyingObject['type'];
  pattern?: FlyingObject['pattern'];
  x: number;
  y: number;
  size: number;
  defeatedAtMs: number;
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
const OBSTACLE_HIT_SCROLL_FREEZE_MS = 420;
const CHASE_START_DISTANCE = 100;
const CHASE_CATCH_RATE = 0.0048;
const CHASE_HIT_DISTANCE_PENALTY = 18;
const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";

const COLLECT_OBJECTS: FlyingObject[] = [
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

const CHASE_OBJECTS: FlyingObject[] = [
  { id: 'dog_01', type: 'dog', spawnMs: 1800, laneY: 392, speed: 0.42, size: 48 },
  { id: 'bird_01', type: 'bird', spawnMs: 3800, laneY: 300, speed: 0.46, size: 42 },
  { id: 'dog_02', type: 'dog', spawnMs: 6200, laneY: 394, speed: 0.5, size: 50 },
  { id: 'bird_02', type: 'bird', spawnMs: 8400, laneY: 292, speed: 0.52, size: 44 },
  { id: 'dog_03', type: 'dog', spawnMs: 11100, laneY: 396, speed: 0.56, size: 52 },
  { id: 'bird_03', type: 'bird', spawnMs: 13600, laneY: 306, speed: 0.58, size: 42 },
  { id: 'dog_04', type: 'dog', spawnMs: 16400, laneY: 390, speed: 0.62, size: 52 },
  { id: 'bird_04', type: 'bird', spawnMs: 19000, laneY: 298, speed: 0.64, size: 44 },
];

const STOMP_OBJECTS: FlyingObject[] = [
  { id: 'dog_01', type: 'dog', spawnMs: 1500, laneY: 392, speed: 0.34, size: 48 },
  { id: 'dog_02', type: 'dog', spawnMs: 2500, laneY: 392, speed: 0.36, size: 48 },
  { id: 'bird_01', type: 'bird', spawnMs: 3400, laneY: 350, speed: 0.38, size: 42 },
  { id: 'bird_02', type: 'bird', spawnMs: 4550, laneY: 346, speed: 0.39, size: 42 },
  { id: 'dog_03', type: 'dog', spawnMs: 5600, laneY: 392, speed: 0.4, size: 50 },
  { id: 'dog_04', type: 'dog', spawnMs: 6800, laneY: 392, speed: 0.41, size: 50 },
  { id: 'bird_03', type: 'bird', spawnMs: 7800, laneY: 342, speed: 0.42, size: 44 },
  { id: 'bird_04', type: 'bird', spawnMs: 9100, laneY: 352, speed: 0.44, size: 42 },
  { id: 'dog_05', type: 'dog', spawnMs: 10300, laneY: 392, speed: 0.46, size: 52 },
  { id: 'dog_06', type: 'dog', spawnMs: 11600, laneY: 392, speed: 0.47, size: 50 },
  { id: 'bird_05', type: 'bird', spawnMs: 13000, laneY: 354, speed: 0.48, size: 42 },
  { id: 'bird_06', type: 'bird', spawnMs: 14400, laneY: 344, speed: 0.49, size: 44 },
  { id: 'dog_07', type: 'dog', spawnMs: 15800, laneY: 392, speed: 0.5, size: 52 },
  { id: 'dog_08', type: 'dog', spawnMs: 17300, laneY: 392, speed: 0.51, size: 52 },
  { id: 'bird_07', type: 'bird', spawnMs: 18800, laneY: 346, speed: 0.52, size: 44 },
  { id: 'bird_08', type: 'bird', spawnMs: 20400, laneY: 356, speed: 0.53, size: 42 },
  { id: 'dog_09', type: 'dog', spawnMs: 22000, laneY: 392, speed: 0.54, size: 54 },
  { id: 'dog_10', type: 'dog', spawnMs: 23500, laneY: 392, speed: 0.55, size: 52 },
  { id: 'bird_09', type: 'bird', spawnMs: 25000, laneY: 350, speed: 0.56, size: 44 },
  { id: 'bird_10', type: 'bird', spawnMs: 26700, laneY: 344, speed: 0.57, size: 44 },
  { id: 'drop_01', type: 'bird', spawnMs: 4200, laneY: 170, speed: 0.34, size: 46, pattern: 'diagonalDrop' },
  { id: 'drop_02', type: 'bird', spawnMs: 9000, laneY: 155, speed: 0.38, size: 48, pattern: 'diagonalDrop' },
  { id: 'drop_03', type: 'bird', spawnMs: 14800, laneY: 165, speed: 0.43, size: 48, pattern: 'diagonalDrop' },
  { id: 'drop_04', type: 'bird', spawnMs: 20700, laneY: 150, speed: 0.48, size: 50, pattern: 'diagonalDrop' },
  { id: 'drop_05', type: 'bird', spawnMs: 26200, laneY: 160, speed: 0.52, size: 50, pattern: 'diagonalDrop' },
];

const BOSS_OBJECTS: FlyingObject[] = [
  // Wave 1
  { id: 'boss_g01',  type: 'bird',     spawnMs: 1200,  laneY: 340, speed: 0.40, size: 46, pattern: 'wobble' },
  { id: 'boss_d01',  type: 'dog',      spawnMs: 2600,  laneY: 392, speed: 0.44, size: 50 },
  { id: 'hdm_01',    type: 'hitodama', spawnMs: 3400,  laneY: 445, speed: 0.38, size: 38, pattern: 'bossShot' },
  { id: 'boss_dp01', type: 'bird',     spawnMs: 4000,  laneY: 100, speed: 0.42, size: 46, pattern: 'diagonalDrop' },
  // Wave 2
  { id: 'boss_d02',  type: 'dog',      spawnMs: 5800,  laneY: 392, speed: 0.48, size: 52 },
  { id: 'hdm_02',    type: 'hitodama', spawnMs: 6600,  laneY: 445, speed: 0.40, size: 38, pattern: 'bossShot' },
  { id: 'boss_g02',  type: 'bird',     spawnMs: 7200,  laneY: 320, speed: 0.46, size: 48, pattern: 'wobble' },
  { id: 'boss_dp02', type: 'bird',     spawnMs: 8800,  laneY: 90,  speed: 0.46, size: 48, pattern: 'diagonalDrop' },
  // Wave 3
  { id: 'hdm_03',    type: 'hitodama', spawnMs: 9700,  laneY: 445, speed: 0.42, size: 38, pattern: 'bossShot' },
  { id: 'boss_g03',  type: 'bird',     spawnMs: 10600, laneY: 350, speed: 0.50, size: 46, pattern: 'wobble' },
  { id: 'boss_d03',  type: 'dog',      spawnMs: 12000, laneY: 392, speed: 0.52, size: 52 },
  { id: 'boss_dp03', type: 'bird',     spawnMs: 13600, laneY: 80,  speed: 0.50, size: 50, pattern: 'diagonalDrop' },
  { id: 'hdm_04',    type: 'hitodama', spawnMs: 14400, laneY: 445, speed: 0.44, size: 38, pattern: 'bossShot' },
  { id: 'boss_d04',  type: 'dog',      spawnMs: 15300, laneY: 392, speed: 0.54, size: 54 },
  // Wave 4 — harder
  { id: 'hdm_05',    type: 'hitodama', spawnMs: 16200, laneY: 445, speed: 0.46, size: 40, pattern: 'bossShot' },
  { id: 'boss_g04',  type: 'bird',     spawnMs: 17000, laneY: 335, speed: 0.54, size: 48, pattern: 'wobble' },
  { id: 'boss_dp04', type: 'bird',     spawnMs: 18600, laneY: 85,  speed: 0.54, size: 50, pattern: 'diagonalDrop' },
  { id: 'hdm_06',    type: 'hitodama', spawnMs: 19700, laneY: 445, speed: 0.48, size: 40, pattern: 'bossShot' },
  { id: 'boss_d05',  type: 'dog',      spawnMs: 20200, laneY: 392, speed: 0.58, size: 54 },
  { id: 'boss_g05',  type: 'bird',     spawnMs: 21800, laneY: 325, speed: 0.58, size: 50, pattern: 'wobble' },
  // Wave 5 — final push
  { id: 'hdm_07',    type: 'hitodama', spawnMs: 22700, laneY: 445, speed: 0.50, size: 40, pattern: 'bossShot' },
  { id: 'boss_dp05', type: 'bird',     spawnMs: 23400, laneY: 90,  speed: 0.58, size: 52, pattern: 'diagonalDrop' },
  { id: 'boss_d06',  type: 'dog',      spawnMs: 24900, laneY: 392, speed: 0.62, size: 56 },
  { id: 'hdm_08',    type: 'hitodama', spawnMs: 25600, laneY: 445, speed: 0.52, size: 40, pattern: 'bossShot' },
  { id: 'boss_g06',  type: 'bird',     spawnMs: 26400, laneY: 345, speed: 0.62, size: 48, pattern: 'wobble' },
];

const DEEP_STOMP_OBJECTS: FlyingObject[] = [
  { id: 'deep_dog_01', type: 'dog', spawnMs: 1400, laneY: 392, speed: 0.42, size: 50 },
  { id: 'wobble_01', type: 'bird', spawnMs: 2600, laneY: 326, speed: 0.38, size: 48, pattern: 'wobble' },
  { id: 'deep_dog_02', type: 'dog', spawnMs: 4200, laneY: 392, speed: 0.46, size: 52 },
  { id: 'wobble_02', type: 'bird', spawnMs: 5600, laneY: 310, speed: 0.42, size: 50, pattern: 'wobble' },
  { id: 'drop_deep_01', type: 'bird', spawnMs: 7200, laneY: 145, speed: 0.44, size: 48, pattern: 'diagonalDrop' },
  { id: 'wobble_03', type: 'bird', spawnMs: 8800, laneY: 348, speed: 0.46, size: 46, pattern: 'wobble' },
  { id: 'deep_dog_03', type: 'dog', spawnMs: 10400, laneY: 392, speed: 0.52, size: 54 },
  { id: 'wobble_04', type: 'bird', spawnMs: 12200, laneY: 318, speed: 0.5, size: 50, pattern: 'wobble' },
  { id: 'drop_deep_02', type: 'bird', spawnMs: 14400, laneY: 150, speed: 0.5, size: 50, pattern: 'diagonalDrop' },
  { id: 'wobble_05', type: 'bird', spawnMs: 16600, laneY: 338, speed: 0.54, size: 50, pattern: 'wobble' },
  { id: 'deep_dog_04', type: 'dog', spawnMs: 18800, laneY: 392, speed: 0.58, size: 54 },
  { id: 'wobble_06', type: 'bird', spawnMs: 21000, laneY: 314, speed: 0.58, size: 52, pattern: 'wobble' },
  { id: 'drop_deep_03', type: 'bird', spawnMs: 23400, laneY: 140, speed: 0.56, size: 52, pattern: 'diagonalDrop' },
  { id: 'wobble_07', type: 'bird', spawnMs: 25800, laneY: 344, speed: 0.62, size: 52, pattern: 'wobble' },
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

function useRunnerBgm(assetsBaseUrl: string | undefined, bgm: string | undefined, volume = 0.28) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const safeVolume = Math.max(0, Math.min(1, volume));

    if (bgm?.startsWith('synth:')) {
      cleanup = startSynthBgm(safeVolume);
      return () => cleanup?.();
    }

    if (bgm) {
      const audio = new Audio(resolveAsset(assetsBaseUrl, bgm));
      audio.loop = true;
      audio.volume = safeVolume;
      audio.play().catch(() => {});
      cleanup = () => {
        audio.pause();
        audio.currentTime = 0;
      };
      return () => cleanup?.();
    }

    return undefined;
  }, [assetsBaseUrl, bgm, volume]);
}

function startSynthBgm(volume: number): () => void {
  const AudioContextClass = window.AudioContext
    ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return () => {};

  const audioContext = new AudioContextClass();
  const master = audioContext.createGain();
  master.gain.value = volume;
  master.connect(audioContext.destination);

  const delay = audioContext.createDelay();
  delay.delayTime.value = 0.18;
  const feedback = audioContext.createGain();
  feedback.gain.value = 0.18;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(master);

  const notes = [392, 523.25, 659.25, 783.99, 659.25, 523.25, 440, 587.33];
  let step = 0;
  let stopped = false;

  const playNote = () => {
    if (stopped) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = step % 4 === 0 ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(notes[step % notes.length], now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain);
    gain.connect(master);
    gain.connect(delay);
    osc.start(now);
    osc.stop(now + 0.18);
    step += 1;
  };

  void audioContext.resume().catch(() => {});
  playNote();
  const interval = window.setInterval(playNote, 135);

  return () => {
    stopped = true;
    window.clearInterval(interval);
    void audioContext.close().catch(() => {});
  };
}

function playStompSound() {
  const AudioContextClass = window.AudioContext
    ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const now = audioContext.currentTime;
  const master = audioContext.createGain();
  const osc = audioContext.createOscillator();
  const pop = audioContext.createOscillator();
  const popGain = audioContext.createGain();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  master.connect(audioContext.destination);

  osc.type = 'square';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);
  osc.connect(master);

  pop.type = 'triangle';
  pop.frequency.setValueAtTime(980, now);
  pop.frequency.exponentialRampToValueAtTime(420, now + 0.08);
  popGain.gain.setValueAtTime(0.0001, now);
  popGain.gain.exponentialRampToValueAtTime(0.16, now + 0.006);
  popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  pop.connect(popGain);
  popGain.connect(master);

  void audioContext.resume().catch(() => {});
  osc.start(now);
  pop.start(now);
  osc.stop(now + 0.16);
  pop.stop(now + 0.12);
  window.setTimeout(() => void audioContext.close().catch(() => {}), 220);
}

const BOSS_SHOT_DROP_MS = 580;

function objectX(object: FlyingObject, elapsedMs: number, speedMultiplier = 1): number {
  if (object.pattern === 'bossShot') {
    if (elapsedMs <= object.spawnMs) return WIDTH + 200;
    const elapsed = elapsedMs - object.spawnMs;
    if (elapsed < BOSS_SHOT_DROP_MS) return BOSS_SHOT_START_X;
    const horizontalTravel = (elapsed - BOSS_SHOT_DROP_MS) * object.speed * speedMultiplier;
    return BOSS_SHOT_START_X - horizontalTravel;
  }
  return WIDTH + 80 - Math.max(0, elapsedMs - object.spawnMs) * object.speed * speedMultiplier;
}

function objectY(object: FlyingObject, elapsedMs = object.spawnMs, speedMultiplier = 1): number {
  if (object.pattern === 'bossShot') {
    if (elapsedMs <= object.spawnMs) return BOSS_SHOT_START_Y;
    const elapsed = elapsedMs - object.spawnMs;
    const groundY = GROUND_Y - object.size - 4;
    if (elapsed < BOSS_SHOT_DROP_MS) {
      const t = elapsed / BOSS_SHOT_DROP_MS;
      return BOSS_SHOT_START_Y + (groundY - BOSS_SHOT_START_Y) * (t * t);
    }
    return groundY;
  }
  if (object.pattern === 'wobble') {
    const travel = Math.max(0, elapsedMs - object.spawnMs) * object.speed * speedMultiplier;
    return object.laneY + Math.sin(travel * 0.032) * 26;
  }
  if (object.pattern === 'diagonalDrop') {
    const travel = Math.max(0, elapsedMs - object.spawnMs) * object.speed * speedMultiplier;
    return Math.min(GROUND_Y - object.size - 6, object.laneY + travel * 0.56);
  }
  return object.type === 'dog' ? GROUND_Y - object.size : object.laneY;
}

function getObjects(mode: RunnerActionMode, stompEnemies: boolean, enemySet: RunnerActionConfig['enemySet'] = 'entrance'): FlyingObject[] {
  if (stompEnemies) {
    if (enemySet === 'boss') return BOSS_OBJECTS;
    if (enemySet === 'deep') return DEEP_STOMP_OBJECTS;
    return STOMP_OBJECTS;
  }
  return mode === 'chase' ? CHASE_OBJECTS : COLLECT_OBJECTS;
}

const BOSS_DIRECTOR_X = 658;
const BOSS_DIRECTOR_BASE_Y = 86;
const BOSS_SHOT_START_X = BOSS_DIRECTOR_X;
const BOSS_SHOT_START_Y = BOSS_DIRECTOR_BASE_Y + 42;

function drawMuseumDirectorBoss(
  ctx: CanvasRenderingContext2D,
  time: number,
  defeatProgress?: number,
  bossImg?: HTMLImageElement | null,
  bossImgW = 72,
  bossImgH = 120,
) {
  if (defeatProgress !== undefined && defeatProgress >= 1) return;

  const fadeOut = defeatProgress !== undefined ? 1 - defeatProgress : 1;
  const shatter = defeatProgress !== undefined && defeatProgress > 0;

  // Defeat explosion burst
  if (shatter) {
    const burst = defeatProgress!;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 0.8 * (1 - burst));
    const blastGrd = ctx.createRadialGradient(
      BOSS_DIRECTOR_X, BOSS_DIRECTOR_BASE_Y, 0,
      BOSS_DIRECTOR_X, BOSS_DIRECTOR_BASE_Y, 120 * burst,
    );
    blastGrd.addColorStop(0, 'rgba(255,200,80,0.9)');
    blastGrd.addColorStop(0.4, 'rgba(255,80,40,0.6)');
    blastGrd.addColorStop(1, 'rgba(100,0,0,0)');
    ctx.fillStyle = blastGrd;
    ctx.beginPath();
    ctx.arc(BOSS_DIRECTOR_X, BOSS_DIRECTOR_BASE_Y, 120 * burst, 0, Math.PI * 2);
    ctx.fill();

    // Particle shards flying outward
    for (let i = 0; i < 10; i += 1) {
      const angle = (i / 10) * Math.PI * 2;
      const r = burst * 100;
      const px = BOSS_DIRECTOR_X + Math.cos(angle) * r;
      const py = BOSS_DIRECTOR_BASE_Y + Math.sin(angle) * r;
      ctx.globalAlpha = Math.max(0, 0.9 * (1 - burst));
      ctx.fillStyle = i % 2 === 0 ? '#ff5a20' : '#ffd060';
      ctx.beginPath();
      ctx.arc(px, py, 5 * (1 - burst * 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const float = shatter ? 0 : Math.sin(time * 0.007) * 10;
  const pulse = 0.88 + Math.sin(time * 0.013) * 0.1;
  const bossY = BOSS_DIRECTOR_BASE_Y + float;
  const auraAlpha = (0.52 + Math.sin(time * 0.018) * 0.16) * fadeOut;

  ctx.save();
  ctx.globalAlpha = fadeOut;

  // Red aura halo
  const grd = ctx.createRadialGradient(BOSS_DIRECTOR_X, bossY, 6, BOSS_DIRECTOR_X, bossY, 60);
  grd.addColorStop(0, `rgba(255,60,80,${auraAlpha})`);
  grd.addColorStop(0.55, `rgba(180,15,40,${auraAlpha * 0.45})`);
  grd.addColorStop(1, 'rgba(100,0,20,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(BOSS_DIRECTOR_X, bossY + 20, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'rgba(255,40,70,0.85)';
  ctx.shadowBlur = 20;

  if (bossImg) {
    // Image-based body: draw sprite centered at boss position
    const imgX = BOSS_DIRECTOR_X - bossImgW / 2;
    const imgY = bossY - bossImgH + 30;
    ctx.drawImage(bossImg, imgX, imgY, bossImgW, bossImgH);
  } else {
    // Procedural fallback
    ctx.fillStyle = `rgba(18,4,10,${pulse})`;
    ctx.fillRect(BOSS_DIRECTOR_X - 17, bossY - 50, 34, 8);
    ctx.fillRect(BOSS_DIRECTOR_X - 11, bossY - 66, 22, 18);

    ctx.fillStyle = `rgba(45,12,22,${pulse})`;
    ctx.beginPath();
    ctx.arc(BOSS_DIRECTOR_X, bossY - 24, 19, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'rgba(255,20,20,1)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ff2020';
    ctx.beginPath();
    ctx.arc(BOSS_DIRECTOR_X - 7, bossY - 26, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(BOSS_DIRECTOR_X + 7, bossY - 26, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255,40,70,0.7)';

    ctx.fillStyle = `rgba(20,5,14,${pulse})`;
    ctx.beginPath();
    ctx.moveTo(BOSS_DIRECTOR_X - 17, bossY - 8);
    ctx.lineTo(BOSS_DIRECTOR_X - 20, bossY + 36);
    ctx.quadraticCurveTo(
      BOSS_DIRECTOR_X - 28 + Math.sin(time * 0.016) * 7, bossY + 66,
      BOSS_DIRECTOR_X - 12 + Math.sin(time * 0.011) * 9, bossY + 80,
    );
    ctx.lineTo(BOSS_DIRECTOR_X, bossY + 70);
    ctx.lineTo(
      BOSS_DIRECTOR_X + 12 + Math.sin(time * 0.014) * 9, bossY + 80,
    );
    ctx.quadraticCurveTo(
      BOSS_DIRECTOR_X + 28 + Math.sin(time * 0.016) * 7, bossY + 66,
      BOSS_DIRECTOR_X + 20, bossY + 36,
    );
    ctx.lineTo(BOSS_DIRECTOR_X + 17, bossY - 8);
    ctx.closePath();
    ctx.fill();
  }

  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(255,40,70,0.7)';

  // Orbiting release particles (hidden during defeat)
  if (!shatter) {
    ctx.shadowBlur = 8;
    for (let i = 0; i < 5; i += 1) {
      const angle = (time * 0.026 + i * (Math.PI * 2) / 5) % (Math.PI * 2);
      const r = 28 + Math.sin(time * 0.04 + i * 1.3) * 8;
      const px = BOSS_DIRECTOR_X + Math.cos(angle) * r;
      const py = bossY + 24 + Math.sin(angle) * r * 0.45;
      ctx.fillStyle = `rgba(255,${60 + i * 22},${100 - i * 12},0.72)`;
      ctx.beginPath();
      ctx.arc(px, py, 3 + i * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
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

function drawDog(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  const run = Math.sin(time * 0.02) * 3;
  ctx.save();
  ctx.translate(x + size, y);
  ctx.scale(-1, 1);
  ctx.fillStyle = '#8b5a3c';
  ctx.fillRect(size * 0.16, size * 0.34, size * 0.58, size * 0.3);
  ctx.fillStyle = '#a46a45';
  ctx.beginPath();
  ctx.arc(size * 0.74, size * 0.36, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5b3928';
  ctx.beginPath();
  ctx.moveTo(size * 0.68, size * 0.22);
  ctx.lineTo(size * 0.78, size * 0.02);
  ctx.lineTo(size * 0.84, size * 0.26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5b3928';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.38);
  ctx.quadraticCurveTo(-size * 0.05, size * 0.18, size * 0.1, size * 0.08);
  ctx.stroke();
  ctx.fillStyle = '#3b2319';
  ctx.fillRect(size * 0.24, size * 0.62, size * 0.1, size * 0.24 + run);
  ctx.fillRect(size * 0.56, size * 0.62, size * 0.1, size * 0.24 - run);
  ctx.fillStyle = '#11131a';
  ctx.beginPath();
  ctx.arc(size * 0.8, size * 0.34, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGhost(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  const drift = Math.sin(time * 0.012) * size * 0.06;
  const pulse = 0.82 + Math.sin(time * 0.018) * 0.12;
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2 + drift);
  ctx.globalAlpha = 0.92;
  ctx.shadowColor = 'rgba(255,105,145,0.62)';
  ctx.shadowBlur = 16;

  const body = ctx.createRadialGradient(0, -size * 0.14, size * 0.08, 0, 0, size * 0.58);
  body.addColorStop(0, `rgba(255,238,248,${pulse})`);
  body.addColorStop(0.62, 'rgba(255,126,164,0.72)');
  body.addColorStop(1, 'rgba(112,42,92,0.52)');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-size * 0.36, size * 0.34);
  ctx.quadraticCurveTo(-size * 0.46, size * 0.02, -size * 0.32, -size * 0.22);
  ctx.quadraticCurveTo(-size * 0.16, -size * 0.5, size * 0.08, -size * 0.46);
  ctx.quadraticCurveTo(size * 0.42, -size * 0.4, size * 0.38, -size * 0.02);
  ctx.lineTo(size * 0.36, size * 0.34);
  ctx.quadraticCurveTo(size * 0.25, size * 0.24, size * 0.14, size * 0.34);
  ctx.quadraticCurveTo(size * 0.02, size * 0.44, -size * 0.1, size * 0.34);
  ctx.quadraticCurveTo(-size * 0.23, size * 0.24, -size * 0.36, size * 0.34);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#301223';
  ctx.beginPath();
  ctx.ellipse(-size * 0.13, -size * 0.14, size * 0.055, size * 0.085, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.12, -size * 0.14, size * 0.055, size * 0.085, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#301223';
  ctx.lineWidth = Math.max(2, size * 0.05);
  ctx.beginPath();
  ctx.arc(0, size * 0.03, size * 0.09, 0.1, Math.PI - 0.1);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,226,241,0.56)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-size * 0.21, -size * 0.31);
  ctx.quadraticCurveTo(-size * 0.05, -size * 0.43, size * 0.14, -size * 0.34);
  ctx.stroke();
  ctx.restore();
}

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  const flap = Math.sin(time * 0.024) * size * 0.16;
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.fillStyle = '#3f78a8';
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.28, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#72b7d2';
  ctx.beginPath();
  ctx.moveTo(-size * 0.08, -size * 0.06);
  ctx.quadraticCurveTo(-size * 0.44, -size * 0.36 - flap, -size * 0.5, size * 0.02);
  ctx.quadraticCurveTo(-size * 0.26, size * 0.06, -size * 0.08, size * 0.04);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.08, -size * 0.06);
  ctx.quadraticCurveTo(size * 0.44, -size * 0.36 + flap, size * 0.5, size * 0.02);
  ctx.quadraticCurveTo(size * 0.26, size * 0.06, size * 0.08, size * 0.04);
  ctx.fill();
  ctx.fillStyle = '#f2d16b';
  ctx.beginPath();
  ctx.moveTo(size * 0.28, -size * 0.02);
  ctx.lineTo(size * 0.44, size * 0.04);
  ctx.lineTo(size * 0.28, size * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#11131a';
  ctx.beginPath();
  ctx.arc(size * 0.16, -size * 0.06, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBadKid(ctx: CanvasRenderingContext2D, distance: number, time: number) {
  const x = Math.min(650, PLAYER_X + 95 + distance * 3.6);
  const y = GROUND_Y - 74 + Math.sin(time * 0.02) * 3;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#f1d2b0';
  ctx.fillRect(13, 0, 24, 22);
  ctx.fillStyle = '#2b2f39';
  ctx.fillRect(8, 20, 34, 36);
  ctx.fillStyle = '#e6533f';
  ctx.fillRect(4, 28, 42, 10);
  ctx.fillStyle = '#151827';
  ctx.fillRect(12, 54, 10, 24);
  ctx.fillRect(30, 54, 10, 24);
  ctx.fillStyle = '#f2d16b';
  ctx.fillRect(17, 8, 4, 4);
  ctx.fillRect(29, 8, 4, 4);
  ctx.restore();
}

function drawHitodama(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  const pulse = 0.78 + Math.sin(time * 0.022) * 0.2;
  const flicker = 0.88 + Math.sin(time * 0.046 + x * 0.01) * 0.1;

  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);

  // Trailing glow behind the shot (left side)
  ctx.globalAlpha = 0.28 * flicker;
  ctx.fillStyle = 'rgba(210,100,255,0.45)';
  ctx.beginPath();
  ctx.ellipse(size * 0.52, 0, size * 0.34, size * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outer glow
  ctx.globalAlpha = 0.88 * flicker;
  ctx.shadowColor = 'rgba(190,60,255,0.95)';
  ctx.shadowBlur = 20;

  const grad = ctx.createRadialGradient(-size * 0.08, -size * 0.12, 0, 0, 0, size * 0.48);
  grad.addColorStop(0, `rgba(255,245,255,${pulse})`);
  grad.addColorStop(0.38, `rgba(205,90,255,${pulse * 0.9})`);
  grad.addColorStop(1, `rgba(120,15,200,${pulse * 0.45})`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.46, 0, Math.PI * 2);
  ctx.fill();

  // Bright core
  ctx.shadowBlur = 10;
  ctx.globalAlpha = 0.96;
  ctx.fillStyle = 'rgba(255,252,255,0.96)';
  ctx.beginPath();
  ctx.arc(-size * 0.1, -size * 0.12, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Tail flame
  ctx.globalAlpha = 0.58 * flicker;
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'rgba(170,50,240,0.72)';
  ctx.beginPath();
  ctx.moveTo(size * 0.38, size * 0.06);
  ctx.quadraticCurveTo(size * 0.66, size * 0.28, size * 0.54, size * 0.52);
  ctx.quadraticCurveTo(size * 0.42, size * 0.3, size * 0.22, size * 0.16);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawFlyingObject(ctx: CanvasRenderingContext2D, object: FlyingObject, x: number, time: number, speedMultiplier = 1) {
  const y = objectY(object, time, speedMultiplier);
  if (object.type === 'hitodama') {
    drawHitodama(ctx, x, y, object.size, time);
    return;
  }
  if (object.pattern === 'wobble') {
    drawGhost(ctx, x, y, object.size, time);
  } else if (object.type === 'candy') {
    drawCandy(ctx, x, y, object.size, time);
  } else if (object.type === 'pot') {
    drawPot(ctx, x, y, object.size, time);
  } else if (object.type === 'dog') {
    drawDog(ctx, x, y, object.size, time);
  } else {
    drawBird(ctx, x, y, object.size, time);
  }
}

function drawMuseumBackground(ctx: CanvasRenderingContext2D, scroll: number, theme: Required<RunnerActionTheme>) {
  const wallGradient = ctx.createLinearGradient(0, LETTERBOX_Y, 0, GROUND_Y);
  wallGradient.addColorStop(0, '#26303a');
  wallGradient.addColorStop(0.45, '#303845');
  wallGradient.addColorStop(1, '#171b22');
  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, LETTERBOX_Y, WIDTH, PLAY_HEIGHT);

  ctx.fillStyle = 'rgba(255,245,205,0.12)';
  for (let i = 0; i < 6; i += 1) {
    const x = (i * 170 - (scroll * 0.18) % 170 + WIDTH) % WIDTH;
    ctx.beginPath();
    ctx.ellipse(x + 72, 92, 42, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 8; i += 1) {
    const x = (i * 150 - (scroll * 0.42) % 150 + WIDTH) % WIDTH;
    const y = 142 + (i % 2) * 34;
    ctx.fillStyle = '#151922';
    ctx.fillRect(x, y, 88, 74);
    ctx.strokeStyle = i % 3 === 0 ? theme.accent : '#c7b487';
    ctx.lineWidth = 6;
    ctx.strokeRect(x + 3, y + 3, 82, 68);
    ctx.fillStyle = i % 2 === 0 ? '#58677a' : '#6b5c7a';
    ctx.fillRect(x + 19, y + 22, 50, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.fillRect(x + 24, y + 57, 40, 5);
  }

  for (let i = 0; i < 6; i += 1) {
    const x = (i * 210 - (scroll * 0.72) % 210 + WIDTH) % WIDTH;
    ctx.fillStyle = 'rgba(9,10,16,0.42)';
    ctx.fillRect(x + 8, GROUND_Y - 74, 92, 10);
    ctx.fillStyle = '#28313a';
    ctx.fillRect(x, GROUND_Y - 106, 108, 44);
    ctx.fillStyle = 'rgba(180,230,255,0.22)';
    ctx.fillRect(x + 8, GROUND_Y - 98, 92, 25);
    ctx.strokeStyle = 'rgba(230,245,255,0.38)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 8, GROUND_Y - 98, 92, 25);
  }

  ctx.fillStyle = theme.ground;
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
  ctx.fillStyle = '#1d2227';
  for (let i = 0; i < 20; i += 1) {
    const x = (i * 52 - scroll % 52 + WIDTH) % WIDTH;
    ctx.fillRect(x, GROUND_Y + 18, 32, 4);
    ctx.fillRect(x + 14, GROUND_Y + 52, 38, 4);
  }
  ctx.fillStyle = 'rgba(242,209,107,0.32)';
  ctx.fillRect(0, GROUND_Y - 4, WIDTH, 4);
}

function drawDefeatedObject(ctx: CanvasRenderingContext2D, object: DefeatedObject, elapsedMs: number) {
  const age = elapsedMs - object.defeatedAtMs;
  const t = Math.min(1, age / 650);
  const x = object.x + t * 84;
  const y = object.y - Math.sin(t * Math.PI) * 116 + t * 28;

  ctx.save();
  ctx.globalAlpha = 1 - t * 0.25;
  ctx.translate(x + object.size / 2, y + object.size / 2);
  ctx.rotate(t * Math.PI * 2.3);
  ctx.scale(1 + t * 0.24, Math.max(0.2, 1 - t * 0.78));
  if (object.pattern === 'wobble') {
    drawGhost(ctx, -object.size / 2, -object.size / 2, object.size, elapsedMs);
  } else if (object.type === 'dog') {
    drawDog(ctx, -object.size / 2, -object.size / 2, object.size, elapsedMs);
  } else if (object.type === 'bird') {
    drawBird(ctx, -object.size / 2, -object.size / 2, object.size, elapsedMs);
  } else if (object.type === 'pot') {
    drawPot(ctx, -object.size / 2, -object.size / 2, object.size, elapsedMs);
  } else {
    drawCandy(ctx, -object.size / 2, -object.size / 2, object.size, elapsedMs);
  }
  ctx.restore();

  ctx.fillStyle = `rgba(242,209,107,${1 - t})`;
  for (let i = 0; i < 5; i += 1) {
    const angle = t * Math.PI * 2 + i * 1.25;
    ctx.fillRect(
      object.x + object.size / 2 + Math.cos(angle) * (18 + t * 42),
      object.y + object.size / 2 + Math.sin(angle) * (12 + t * 32),
      6,
      6,
    );
  }
}

function drawRunner(
  ctx: CanvasRenderingContext2D,
  state: RunnerState,
  config: Required<Pick<RunnerActionConfig, 'durationMs' | 'mode' | 'chaseStartDistance' | 'objectSpeedMultiplier' | 'stompEnemies' | 'lives'>> & {
    name?: string;
    enemySet?: RunnerActionConfig['enemySet'];
  },
  theme: Required<RunnerActionTheme>,
  assets: {
    backgroundImage: HTMLImageElement | null;
    backgroundImageConfigured: boolean;
    backgroundImageFailed: boolean;
    backgroundLoopWidth: number;
    playerImageEnabled: boolean;
    playerImageConfigured: boolean;
    playerImageFailed: boolean;
    opponentImageEnabled: boolean;
    opponentImageConfigured: boolean;
    opponentImageFailed: boolean;
    playerWidth: number;
    playerHeight: number;
    bossImage: HTMLImageElement | null;
    bossWidth: number;
    bossHeight: number;
  },
) {
  const progress = Math.min(1, state.elapsedMs / config.durationMs);
  const isChase = config.mode === 'chase';
  const objects = getObjects(config.mode, config.stompEnemies, config.enemySet);
  const scroll = state.worldElapsedMs * 0.18;
  const isPenalized = state.elapsedMs < state.penaltyUntilMs;
  const gameOverT = state.gameOverAtMs === null ? null : Math.min(1, (state.elapsedMs - state.gameOverAtMs) / 850);
  const clearRunT = state.clearRunAtMs === null ? null : Math.min(1, (state.elapsedMs - state.clearRunAtMs) / 950);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (config.stompEnemies) {
    drawMuseumBackground(ctx, scroll, theme);
    if (config.enemySet === 'boss') {
      const defeatProgress = state.clearRunAtMs !== null
        ? Math.min(1, (state.elapsedMs - state.clearRunAtMs) / 950)
        : undefined;
      drawMuseumDirectorBoss(
        ctx, state.elapsedMs, defeatProgress,
        assets.bossImage, assets.bossWidth, assets.bossHeight,
      );
    }
  } else if (assets.backgroundImage) {
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
    const defeatX = gameOverT === null ? 0 : -36 - gameOverT * 118;
    const defeatY = gameOverT === null ? 0 : -Math.sin(gameOverT * Math.PI) * 132 + gameOverT * 82;
    const clearX = clearRunT === null ? 0 : clearRunT * (WIDTH - PLAYER_X + 120);
    const clearBob = clearRunT === null ? 0 : Math.sin(state.elapsedMs * 0.045) * 5;
    ctx.save();
    ctx.translate(
      PLAYER_X + playerKnockbackX + defeatX + clearX + PLAYER_W / 2,
      playerY + defeatY + clearBob + PLAYER_H / 2,
    );
    ctx.rotate(gameOverT === null ? 0 : -gameOverT * Math.PI * 1.4);
    ctx.translate(-(PLAYER_X + playerKnockbackX + PLAYER_W / 2), -(playerY + clearBob + PLAYER_H / 2));
    ctx.fillStyle = '#f1f3f5';
    ctx.fillRect(PLAYER_X + playerKnockbackX + 10, playerY, 22, 22);
    ctx.fillStyle = theme.accent;
    ctx.fillRect(PLAYER_X + playerKnockbackX, playerY + 24, PLAYER_W, 36);
    ctx.fillStyle = '#11131a';
    ctx.fillRect(PLAYER_X + playerKnockbackX + 6, playerY + 58, 12, 24);
    ctx.fillRect(PLAYER_X + playerKnockbackX + 25, playerY + 58, 12, 24);
    ctx.fillStyle = '#f1f3f5';
    ctx.fillRect(PLAYER_X + playerKnockbackX + PLAYER_W, playerY + 30, 20, 10);
    ctx.restore();
  }

  if (isChase && !assets.opponentImageEnabled) {
    drawBadKid(ctx, state.chaseDistance, state.elapsedMs);
  }

  for (const object of objects) {
    if (state.collectedIds.includes(object.id) || state.hitIds.includes(object.id)) continue;
    const x = objectX(object, state.worldElapsedMs, config.objectSpeedMultiplier);
    if (x < -100 || x > WIDTH + 120) continue;
    drawFlyingObject(ctx, object, x, state.worldElapsedMs, config.objectSpeedMultiplier);
  }
  for (const object of state.defeated) {
    drawDefeatedObject(ctx, object, state.elapsedMs);
  }

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(24, 24, 752, 56);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(44, 58, 712, 8);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(44, 58, 712 * progress, 8);
  if (isChase) {
    const distanceProgress = 1 - Math.min(1, Math.max(0, state.chaseDistance / config.chaseStartDistance));
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(44, 70, 712, 6);
    ctx.fillStyle = '#ff8f70';
    ctx.fillRect(44, 70, 712 * distanceProgress, 6);
  }
  ctx.fillStyle = '#f7f2dc';
  ctx.font = `20px ${FONT}`;
  ctx.fillText(config.name ?? (isChase ? '公園の追跡劇' : 'アーケード街の死闘'), 44, 48);
  ctx.font = `14px ${FONT}`;
  ctx.fillText(`${Math.ceil((config.durationMs - state.elapsedMs) / 1000)}秒`, 708, 48);
  ctx.fillText(isChase ? `距離 ${Math.ceil(state.chaseDistance)}` : `${config.stompEnemies ? '撃破' : 'アメ'} ${state.score}`, 610, 48);
  if (config.stompEnemies) {
    const livesLeft = Math.max(0, config.lives - state.penaltyCount);
    ctx.font = `22px ${FONT}`;
    for (let i = 0; i < config.lives; i += 1) {
      ctx.fillStyle = i < livesLeft ? '#ff6f91' : 'rgba(255,255,255,0.24)';
      ctx.fillText('♥', 44 + i * 28, 105);
    }
  }
  if (isPenalized) {
    ctx.fillStyle = 'rgba(120,0,0,0.7)';
    ctx.fillRect(300, 92, 200, 32);
    ctx.fillStyle = '#fff4e8';
    ctx.font = `16px ${FONT}`;
    ctx.fillText(config.stompEnemies ? 'ミス！' : isChase ? '追いつけない！' : '鍋に当たった！', config.stompEnemies ? 376 : isChase ? 348 : 344, 114);
  }

  const warnings = [
    assets.backgroundImageConfigured && assets.backgroundImageFailed ? 'background image not found' : null,
    assets.playerImageConfigured && assets.playerImageFailed ? 'player image not found' : null,
    assets.opponentImageConfigured && assets.opponentImageFailed ? 'opponent image not found' : null,
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
  const mode: RunnerActionMode = config.mode ?? 'collect';
  const durationMs = Math.max(1000, config.durationMs || DEFAULT_DURATION_MS);
  const chaseStartDistance = Math.max(1, config.chaseStartDistance ?? CHASE_START_DISTANCE);
  const chaseCatchRate = Math.max(0.001, config.chaseCatchRate ?? CHASE_CATCH_RATE);
  const chaseHitDistancePenalty = Math.max(0, config.chaseHitDistancePenalty ?? CHASE_HIT_DISTANCE_PENALTY);
  const stateRef = useRef<RunnerState>({
    elapsedMs: 0,
    worldElapsedMs: 0,
    y: GROUND_Y - PLAYER_H,
    velocityY: 0,
    grounded: true,
    score: 0,
    penaltyCount: 0,
    penaltyUntilMs: 0,
    scrollFreezeUntilMs: 0,
    chaseDistance: chaseStartDistance,
    collectedIds: [],
    hitIds: [],
    defeated: [],
    gameOverAtMs: null,
    clearRunAtMs: null,
  });
  const lastTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const scale = useGameScale();
  const theme = useMemo(() => mergeTheme(config.theme), [config.theme]);
  const stageId = config.stageId || 'default';
  const backgroundImageSrc = resolveAsset(config.assetsBaseUrl, config.backgroundImage);
  const playerImageSrc = resolveAsset(config.assetsBaseUrl, config.playerImage);
  const opponentImageSrc = resolveAsset(config.assetsBaseUrl, config.opponentImage);
  const bossImageSrc = resolveAsset(config.assetsBaseUrl, config.bossImage);
  useRunnerBgm(config.assetsBaseUrl, config.bgm, config.bgmVolume);
  const backgroundAsset = useImage(backgroundImageSrc);
  const playerAsset = useImage(playerImageSrc);
  const opponentAsset = useImage(opponentImageSrc);
  const bossAsset = useImage(bossImageSrc);
  const backgroundLoopWidth = Math.max(1, config.backgroundLoopWidth ?? WIDTH);
  const playerWidth = Math.max(1, config.playerWidth ?? 74);
  const playerHeight = Math.max(1, config.playerHeight ?? 104);
  const opponentWidth = Math.max(1, config.opponentWidth ?? 58);
  const opponentHeight = Math.max(1, config.opponentHeight ?? 84);
  const bossWidth = Math.max(1, config.bossWidth ?? 72);
  const bossHeight = Math.max(1, config.bossHeight ?? 120);
  const objectSpeedMultiplier = Math.max(0.1, config.objectSpeedMultiplier ?? 1);
  const stompEnemies = config.stompEnemies ?? false;
  const enemySet = config.enemySet ?? 'entrance';
  const lives = Math.max(1, config.lives ?? 3);

  const jump = useCallback(() => {
    const state = stateRef.current;
    if (!state.grounded) return;
    stateRef.current = { ...state, velocityY: JUMP_VELOCITY, grounded: false };
  }, []);

  const finish = useCallback((result: 'complete' | 'win' | 'lose') => {
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
        runner_action_result: result,
        [`runner_action_result_${stageId}`]: result,
        runner_action_distance: Math.ceil(finalState.chaseDistance),
        [`runner_action_distance_${stageId}`]: Math.ceil(finalState.chaseDistance),
      },
      playerStats: {
        ...context.playerStats,
        runnerScore: finalState.score,
        runnerPenalties: finalState.penaltyCount,
        runnerDistance: Math.ceil(finalState.chaseDistance),
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
      const isResultAnimation = prev.gameOverAtMs !== null || prev.clearRunAtMs !== null;
      const elapsed = isResultAnimation ? prev.elapsedMs + delta : Math.min(durationMs, prev.elapsedMs + delta);
      if (prev.gameOverAtMs !== null) {
        const next = {
          ...prev,
          elapsedMs: elapsed,
          defeated: prev.defeated.filter((object) => elapsed - object.defeatedAtMs < 700),
        };
        stateRef.current = next;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          drawRunner(ctx, next, { durationMs, mode, chaseStartDistance, objectSpeedMultiplier, stompEnemies, lives, name: config.name, enemySet }, theme, {
            backgroundImage: backgroundAsset.image,
            backgroundImageConfigured: Boolean(backgroundImageSrc),
            backgroundImageFailed: backgroundAsset.failed,
            backgroundLoopWidth,
            playerImageEnabled: Boolean(playerImageSrc) && !playerAsset.failed,
            playerImageConfigured: Boolean(playerImageSrc),
            playerImageFailed: playerAsset.failed,
            opponentImageEnabled: Boolean(opponentImageSrc) && !opponentAsset.failed,
            opponentImageConfigured: Boolean(opponentImageSrc),
            opponentImageFailed: opponentAsset.failed,
            playerWidth,
            playerHeight,
            bossImage: bossAsset.image,
            bossWidth,
            bossHeight,
          });
        }
        setElapsedMs(elapsed);
        if (elapsed - prev.gameOverAtMs >= 850) finish('lose');
        else frameId = requestAnimationFrame(tick);
        return;
      }
      if (prev.clearRunAtMs !== null) {
        const next = {
          ...prev,
          elapsedMs: elapsed,
          worldElapsedMs: Math.min(durationMs + 950, prev.worldElapsedMs + delta),
          defeated: prev.defeated.filter((object) => elapsed - object.defeatedAtMs < 700),
        };
        stateRef.current = next;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          drawRunner(ctx, next, { durationMs, mode, chaseStartDistance, objectSpeedMultiplier, stompEnemies, lives, name: config.name, enemySet }, theme, {
            backgroundImage: backgroundAsset.image,
            backgroundImageConfigured: Boolean(backgroundImageSrc),
            backgroundImageFailed: backgroundAsset.failed,
            backgroundLoopWidth,
            playerImageEnabled: Boolean(playerImageSrc) && !playerAsset.failed,
            playerImageConfigured: Boolean(playerImageSrc),
            playerImageFailed: playerAsset.failed,
            opponentImageEnabled: Boolean(opponentImageSrc) && !opponentAsset.failed,
            opponentImageConfigured: Boolean(opponentImageSrc),
            opponentImageFailed: opponentAsset.failed,
            playerWidth,
            playerHeight,
            bossImage: bossAsset.image,
            bossWidth,
            bossHeight,
          });
        }
        setElapsedMs(elapsed);
        if (elapsed - prev.clearRunAtMs >= 950) finish('complete');
        else frameId = requestAnimationFrame(tick);
        return;
      }
      const worldDelta = prev.elapsedMs < prev.scrollFreezeUntilMs ? 0 : delta;
      const worldElapsed = Math.min(durationMs, prev.worldElapsedMs + worldDelta);
      const chaseDistance =
        mode === 'chase'
          ? Math.max(0, prev.chaseDistance - worldDelta * chaseCatchRate)
          : prev.chaseDistance;
      let velocityY = prev.velocityY + GRAVITY * delta;
      let y = prev.y + velocityY * delta;
      let grounded = false;
      const floorY = GROUND_Y - PLAYER_H;
      if (y >= floorY) {
        y = floorY;
        velocityY = 0;
        grounded = true;
      }
      let next: RunnerState = {
        ...prev,
        elapsedMs: elapsed,
        worldElapsedMs: worldElapsed,
        chaseDistance,
        y,
        velocityY,
        grounded,
      };
      const objects = getObjects(mode, stompEnemies, enemySet);
      const isCurrentlyPenalized = elapsed < next.penaltyUntilMs;
      const hitboxWidth = Math.max(24, Math.min(playerWidth, 74) - 12);
      const hitboxHeight = Math.max(48, Math.min(playerHeight, 104) - 8);
      const playerRect = {
        x: PLAYER_X + (isCurrentlyPenalized ? -34 : 0) + 8,
        y: playerTop(next, playerHeight) + 4,
        width: hitboxWidth,
        height: hitboxHeight,
      };
      for (const object of objects) {
        if (next.collectedIds.includes(object.id) || next.hitIds.includes(object.id)) continue;
        const x = objectX(object, worldElapsed, objectSpeedMultiplier);
        if (x < -100 || x > WIDTH + 120) continue;
        const objectRect = {
          x,
          y: objectY(object, worldElapsed, objectSpeedMultiplier),
          width: object.size,
          height: object.size,
        };
        if (!rectsOverlap(playerRect, objectRect)) continue;
        const stomped =
          stompEnemies &&
          (object.type === 'dog' || object.type === 'bird') &&
          next.velocityY > 0 &&
          playerRect.y + playerRect.height <= objectRect.y + objectRect.height * 0.48;
        if (object.type === 'candy' || stomped) {
          if (stomped) playStompSound();
          next = {
            ...next,
            score: next.score + 1,
            collectedIds: [...next.collectedIds, object.id],
            defeated: stomped
              ? [
                  ...next.defeated,
                  { id: object.id, type: object.type, pattern: object.pattern, x, y: objectY(object, worldElapsed, objectSpeedMultiplier), size: object.size, defeatedAtMs: elapsed },
                ]
              : next.defeated,
            velocityY: stomped ? JUMP_VELOCITY * 0.62 : next.velocityY,
            grounded: false,
          };
        } else {
          if (isCurrentlyPenalized) continue;
          const penaltyCount = next.penaltyCount + 1;
          next = {
            ...next,
            score: Math.max(0, next.score - 2),
            penaltyCount,
            penaltyUntilMs: elapsed + 900,
            scrollFreezeUntilMs: elapsed + OBSTACLE_HIT_SCROLL_FREEZE_MS,
            chaseDistance:
              mode === 'chase'
                ? Math.min(chaseStartDistance, next.chaseDistance + chaseHitDistancePenalty)
                : next.chaseDistance,
            hitIds: [...next.hitIds, object.id],
          };
          if (stompEnemies && penaltyCount >= lives) {
            next = {
              ...next,
              gameOverAtMs: elapsed,
              scrollFreezeUntilMs: elapsed + 900,
            };
            break;
          }
        }
      }
      next = {
        ...next,
        defeated: next.defeated.filter((object) => elapsed - object.defeatedAtMs < 700),
      };
      stateRef.current = next;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        drawRunner(ctx, next, { durationMs, mode, chaseStartDistance, objectSpeedMultiplier, stompEnemies, lives, name: config.name, enemySet }, theme, {
          backgroundImage: backgroundAsset.image,
          backgroundImageConfigured: Boolean(backgroundImageSrc),
          backgroundImageFailed: backgroundAsset.failed,
          backgroundLoopWidth,
          playerImageEnabled: Boolean(playerImageSrc) && !playerAsset.failed,
          playerImageConfigured: Boolean(playerImageSrc),
          playerImageFailed: playerAsset.failed,
          opponentImageEnabled: Boolean(opponentImageSrc) && !opponentAsset.failed,
          opponentImageConfigured: Boolean(opponentImageSrc),
          opponentImageFailed: opponentAsset.failed,
          playerWidth,
          playerHeight,
          bossImage: bossAsset.image,
          bossWidth,
          bossHeight,
        });
      }

      setElapsedMs(elapsed);
      if (mode === 'chase' && next.chaseDistance <= 0) {
        finish('win');
        return;
      }
      if (elapsed >= durationMs) {
        if (mode === 'chase') {
          finish('lose');
        } else {
          stateRef.current = { ...next, clearRunAtMs: elapsed };
          frameId = requestAnimationFrame(tick);
        }
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
    bossAsset.failed,
    bossAsset.image,
    bossWidth,
    bossHeight,
    chaseCatchRate,
    chaseHitDistancePenalty,
    chaseStartDistance,
    durationMs,
    finish,
    mode,
    opponentAsset.failed,
    opponentAsset.image,
    opponentImageSrc,
    objectSpeedMultiplier,
    playerAsset.failed,
    playerAsset.image,
    playerHeight,
    playerImageSrc,
    playerWidth,
    stageId,
    stompEnemies,
    enemySet,
    lives,
    config.name,
    theme,
  ]);

  const progress = Math.min(1, elapsedMs / durationMs);
  const currentState = stateRef.current;
  const isPenalized = currentState.elapsedMs < currentState.penaltyUntilMs;
  const gameOverT = currentState.gameOverAtMs === null
    ? null
    : Math.min(1, (currentState.elapsedMs - currentState.gameOverAtMs) / 850);
  const clearRunT = currentState.clearRunAtMs === null
    ? null
    : Math.min(1, (currentState.elapsedMs - currentState.clearRunAtMs) / 950);
  const playerBob = currentState.grounded ? Math.sin(currentState.elapsedMs * 0.018) * 3 : 0;
  const playerKnockbackX = isPenalized ? -34 + Math.sin(currentState.elapsedMs * 0.08) * 8 : 0;
  const playerDefeatX = gameOverT === null ? 0 : -36 - gameOverT * 118;
  const playerDefeatY = gameOverT === null ? 0 : -Math.sin(gameOverT * Math.PI) * 132 + gameOverT * 82;
  const playerClearX = clearRunT === null ? 0 : clearRunT * (WIDTH - PLAYER_X + 120);
  const playerClearBob = clearRunT === null ? 0 : Math.sin(currentState.elapsedMs * 0.045) * 5;
  const playerLeft = PLAYER_X + playerKnockbackX + playerDefeatX + playerClearX;
  const playerTopPx = playerTop(currentState, playerHeight) + playerBob + playerDefeatY + playerClearBob;
  const showDomPlayer = Boolean(playerImageSrc) && !playerAsset.failed;
  const opponentLeft = Math.min(650, PLAYER_X + 95 + currentState.chaseDistance * 3.6);
  const opponentTop = GROUND_Y - opponentHeight + Math.sin(currentState.elapsedMs * 0.02) * 3;
  const showDomOpponent = mode === 'chase' && Boolean(opponentImageSrc) && !opponentAsset.failed;

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
              transform: gameOverT === null ? undefined : `rotate(${-gameOverT * 1.4}turn)`,
              transformOrigin: '50% 55%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        )}
        {showDomOpponent && (
          <img
            src={opponentImageSrc}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: opponentLeft,
              top: opponentTop,
              width: opponentWidth,
              height: opponentHeight,
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
