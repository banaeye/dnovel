import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EngineProps, IGameEngine } from '@novel-engine/hub';

export interface SpotDifferenceConfig {
  stageId: string;
  title?: string;
  timeLimitMs?: number;
  targetCount?: number;
  gridSize?: number;
  gridColumns?: number;
  cellSize?: number;
  cellGap?: number;
  timePenaltyMs?: number;
  imagePool?: string[];
  assetsBaseUrl?: string;
  _novelReturn?: unknown;
}

interface Problem {
  base: string;
  odd: string;
  baseImage?: string;
  oddImage?: string;
  oddIndex: number;
  tint: string;
}

const W = 800;
const H = 600;
const FONT = "'Hiragino Kaku Gothic ProN', 'Meiryo', 'Yu Gothic', sans-serif";
const SYMBOLS = ['●', '◆', '▲', '★', '✚', '■', '⬟', '✦'];
const COLORS = ['#f4c95d', '#7dd3fc', '#f0abfc', '#86efac', '#fca5a5', '#c4b5fd'];
const EFFECT_STYLES = `
@keyframes sdProblemIn {
  from { opacity: 0; transform: scale(0.9) translateY(10px); filter: brightness(1.8); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
}
@keyframes sdCorrectBurst {
  0% { opacity: 0; transform: scale(0.55); }
  35% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.55); }
}
@keyframes sdPenaltyFloat {
  0% { opacity: 0; transform: translateY(12px) scale(0.9); }
  18% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-38px) scale(1.04); }
}
@keyframes sdWrongShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  45% { transform: translateX(8px); }
  70% { transform: translateX(-5px); }
}
.sd-cell-in { animation: sdProblemIn 360ms ease both; }
.sd-correct-burst { animation: sdCorrectBurst 620ms ease-out both; }
.sd-penalty-float { animation: sdPenaltyFloat 820ms ease-out both; }
.sd-wrong-shake { animation: sdWrongShake 300ms ease both; }
`;

function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / W, window.innerHeight / H));
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
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const base = (assetsBaseUrl ?? '').replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return base ? `${base}/${clean}` : `/${clean}`;
}

function makeProblem(round: number, gridSize: number, images: string[]): Problem {
  const base = SYMBOLS[round % SYMBOLS.length];
  const odd = SYMBOLS[(round + 3) % SYMBOLS.length];
  const oddIndex = (round * 11 + 7) % gridSize;
  if (images.length >= 2) {
    const baseIndex = round % images.length;
    const oddIndexInPool = (baseIndex + 1 + (round % (images.length - 1))) % images.length;
    return {
      base,
      odd,
      baseImage: images[baseIndex],
      oddImage: images[oddIndexInPool],
      oddIndex,
      tint: COLORS[round % COLORS.length],
    };
  }
  return { base, odd, oddIndex, tint: COLORS[round % COLORS.length] };
}

function SpotDifferenceComponent({ context, config, onExit }: EngineProps<SpotDifferenceConfig>) {
  const scale = useGameScale();
  const stageId = config.stageId || 'default';
  const timeLimitMs = Math.max(5000, config.timeLimitMs ?? 30000);
  const timePenaltyMs = Math.max(0, config.timePenaltyMs ?? 3000);
  const targetCount = Math.max(1, config.targetCount ?? 5);
  const gridSize = Math.max(4, config.gridSize ?? 36);
  const cols = Math.max(2, Math.min(gridSize, config.gridColumns ?? 6));
  const cell = Math.max(36, Math.min(112, config.cellSize ?? 62));
  const gap = Math.max(4, Math.min(20, config.cellGap ?? 12));
  const images = useMemo(
    () => (config.imagePool ?? []).map((path) => resolveAsset(config.assetsBaseUrl, path)).filter((path): path is string => Boolean(path)),
    [config.assetsBaseUrl, config.imagePool],
  );
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; index: number; seq: number } | null>(null);
  const [finished, setFinished] = useState<'win' | 'lose' | null>(null);
  const problem = useMemo(() => makeProblem(round, gridSize, images), [round, gridSize, images]);

  const remainingMs = Math.max(0, timeLimitMs - (now - startedAt) - penaltyMs);

  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [finished]);

  useEffect(() => {
    if (!finished && remainingMs <= 0) setFinished(score >= targetCount ? 'win' : 'lose');
  }, [finished, remainingMs, score, targetCount]);

  useEffect(() => {
    if (!finished) return;
    const id = window.setTimeout(() => {
      onExit({
        ...context,
        flags: {
          ...context.flags,
          spot_difference_result: finished,
          [`spot_difference_result_${stageId}`]: finished,
          spot_difference_score: score,
          [`spot_difference_score_${stageId}`]: score,
        },
        playerStats: {
          ...context.playerStats,
          spotDifferenceScore: score,
        },
      });
    }, 1600);
    return () => window.clearTimeout(id);
  }, [context, finished, onExit, score, stageId]);

  const choose = useCallback((idx: number) => {
    if (finished || feedback) return;
    if (idx === problem.oddIndex) {
      const nextScore = score + 1;
      setFeedback({ type: 'correct', index: idx, seq: Date.now() });
      window.setTimeout(() => {
        setScore(nextScore);
        setFeedback(null);
        if (nextScore >= targetCount) {
          setFinished('win');
        } else {
          setRound((r) => r + 1);
        }
      }, 680);
    } else {
      setFeedback({ type: 'wrong', index: idx, seq: Date.now() });
      setMisses((m) => m + 1);
      setPenaltyMs((ms) => ms + timePenaltyMs);
      window.setTimeout(() => setFeedback(null), 540);
    }
  }, [feedback, finished, problem.oddIndex, score, targetCount, timePenaltyMs]);

  const gridW = cols * cell + (cols - 1) * gap;
  const rows = Math.ceil(gridSize / cols);
  const gridH = rows * cell + (rows - 1) * gap;
  const gridX = (W - gridW) / 2;
  const gridY = Math.max(112, 320 - gridH / 2);

  return (
    <div style={{ width: '100vw', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060a', overflow: 'hidden' }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center center', position: 'relative', overflow: 'hidden', fontFamily: FONT, background: 'linear-gradient(180deg,#16151d,#2d2632 55%,#101018)' }}>
        <style>{EFFECT_STYLES}</style>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 25%, rgba(255,90,110,0.24), transparent 44%)' }} />
        <div style={{ position: 'absolute', top: 24, left: 28, right: 28, height: 70, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', color: '#f7f2dc' }}>
          <span style={{ fontSize: 20 }}>{config.title ?? '違う絵探し'}</span>
          <span>残り {Math.ceil(remainingMs / 1000)} 秒</span>
          <span>発見 {score} / {targetCount}</span>
        </div>
        {Array.from({ length: gridSize }, (_, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const odd = idx === problem.oddIndex;
          const image = odd ? problem.oddImage : problem.baseImage;
          const imageMode = Boolean(image);
          const isFeedbackTarget = feedback?.index === idx;
          const cellClassName = [
            'sd-cell-in',
            isFeedbackTarget && feedback?.type === 'wrong' ? 'sd-wrong-shake' : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={`${round}-${idx}`}
              className={cellClassName}
              onClick={() => choose(idx)}
              style={{
                position: 'absolute',
                left: gridX + col * (cell + gap),
                top: gridY + row * (cell + gap),
                width: cell,
                height: cell,
                borderRadius: 8,
                border: imageMode || !odd ? '2px solid rgba(255,255,255,0.16)' : `2px solid ${problem.tint}`,
                backgroundColor: imageMode ? '#111' : 'rgba(8,8,14,0.74)',
                backgroundImage: imageMode ? `url("${image}")` : undefined,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                color: odd ? '#fff7cc' : problem.tint,
                fontSize: 30,
                cursor: finished || feedback ? 'default' : 'pointer',
                boxShadow: imageMode || !odd ? '0 4px 12px rgba(0,0,0,0.35)' : `0 0 24px ${problem.tint}44`,
                overflow: 'hidden',
                padding: 0,
                animationDelay: `${Math.min(180, idx * 10)}ms`,
              }}
            >
              {imageMode ? <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.18))' }} /> : (odd ? problem.odd : problem.base)}
              {isFeedbackTarget && feedback?.type === 'correct' && (
                <span
                  className="sd-correct-burst"
                  style={{
                    position: 'absolute',
                    inset: -18,
                    borderRadius: 999,
                    background: 'radial-gradient(circle, rgba(255,247,180,0.95), rgba(255,120,165,0.42) 45%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />
              )}
              {isFeedbackTarget && feedback?.type === 'wrong' && (
                <span
                  className="sd-penalty-float"
                  style={{
                    position: 'absolute',
                    left: -8,
                    right: -8,
                    top: -26,
                    color: '#ff9aa9',
                    fontSize: 18,
                    fontWeight: 800,
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                  }}
                >
                  -{Math.ceil(timePenaltyMs / 1000)}秒
                </span>
              )}
            </button>
          );
        })}
        <div style={{ position: 'absolute', left: 40, bottom: 28, right: 40, color: '#d8d0c4', display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
          <span>{gridSize}枚の中から違う絵を探す</span>
          <span>ミス {misses}</span>
        </div>
        {finished && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,10,0.86)', color: finished === 'win' ? '#fff176' : '#ef9a9a', fontSize: 48, letterSpacing: '0.18em' }}>
            {finished === 'win' ? '浄　化' : '失　敗'}
            <span style={{ marginTop: 18, color: '#d8d0c4', fontSize: 18, letterSpacing: 0 }}>{score} / {targetCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const SpotDifferenceEngine: IGameEngine<SpotDifferenceConfig> = {
  component: SpotDifferenceComponent,
};
