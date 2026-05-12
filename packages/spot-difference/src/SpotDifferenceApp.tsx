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
  0%   { opacity: 0; transform: scale(0.3); filter: brightness(3); }
  20%  { opacity: 1; transform: scale(1.1); filter: brightness(2); }
  55%  { opacity: 0.85; transform: scale(2.2); filter: brightness(1.3); }
  100% { opacity: 0; transform: scale(3.4); filter: brightness(1); }
}
@keyframes sdCorrectRing {
  0%   { opacity: 0.95; transform: scale(0.25); border-width: 10px; }
  55%  { opacity: 0.55; transform: scale(2.0); border-width: 4px; }
  100% { opacity: 0;    transform: scale(3.2); border-width: 1px; }
}
@keyframes sdCorrectSparkle {
  0%   { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(0deg); }
  25%  { opacity: 1; transform: translate(-50%,-50%) scale(1.2) rotate(60deg); }
  100% { opacity: 0; transform: translate(var(--sx),var(--sy)) scale(0.15) rotate(220deg); }
}
@keyframes sdCorrectScreen {
  0%   { opacity: 0; }
  12%  { opacity: 0.52; }
  100% { opacity: 0; }
}
@keyframes sdPenaltyFloat {
  0%   { opacity: 0; transform: translateY(8px) scale(0.75); }
  14%  { opacity: 1; transform: translateY(-4px) scale(1.15); }
  50%  { opacity: 1; transform: translateY(-12px) scale(1); }
  100% { opacity: 0; transform: translateY(-58px) scale(0.9); }
}
@keyframes sdWrongShake {
  0%   { transform: translateX(0) rotate(0deg); }
  10%  { transform: translateX(-18px) rotate(-4deg); }
  25%  { transform: translateX(18px) rotate(4deg); }
  40%  { transform: translateX(-15px) rotate(-3deg); }
  57%  { transform: translateX(14px) rotate(2.5deg); }
  72%  { transform: translateX(-9px) rotate(-1.5deg); }
  86%  { transform: translateX(6px) rotate(0.8deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
@keyframes sdWrongCellFlash {
  0%   { opacity: 0; }
  18%  { opacity: 0.88; }
  100% { opacity: 0; }
}
@keyframes sdWrongScreen {
  0%   { opacity: 0; }
  16%  { opacity: 0.46; }
  100% { opacity: 0; }
}
.sd-cell-in        { animation: sdProblemIn 360ms ease both; }
.sd-correct-burst  { animation: sdCorrectBurst 780ms ease-out both; }
.sd-correct-ring   { animation: sdCorrectRing  700ms ease-out both; }
.sd-correct-screen { animation: sdCorrectScreen 680ms ease-out both; }
.sd-sparkle        { animation: sdCorrectSparkle 640ms ease-out both; }
.sd-penalty-float  { animation: sdPenaltyFloat 920ms ease-out both; }
.sd-wrong-shake    { animation: sdWrongShake 440ms ease both; }
.sd-wrong-flash    { animation: sdWrongCellFlash 480ms ease-out both; }
.sd-wrong-screen   { animation: sdWrongScreen 520ms ease-out both; }
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
  const [screenFlash, setScreenFlash] = useState<{ type: 'correct' | 'wrong'; seq: number } | null>(null);
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
      const seq = Date.now();
      setFeedback({ type: 'correct', index: idx, seq });
      setScreenFlash({ type: 'correct', seq });
      window.setTimeout(() => {
        setScore(nextScore);
        setFeedback(null);
        if (nextScore >= targetCount) {
          setFinished('win');
        } else {
          setRound((r) => r + 1);
        }
      }, 780);
    } else {
      const seq = Date.now();
      setFeedback({ type: 'wrong', index: idx, seq });
      setScreenFlash({ type: 'wrong', seq });
      setMisses((m) => m + 1);
      setPenaltyMs((ms) => ms + timePenaltyMs);
      window.setTimeout(() => setFeedback(null), 580);
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

        {/* 画面フラッシュ オーバーレイ */}
        {screenFlash && (
          <div
            key={screenFlash.seq}
            className={screenFlash.type === 'correct' ? 'sd-correct-screen' : 'sd-wrong-screen'}
            style={{
              position: 'absolute',
              inset: 0,
              background: screenFlash.type === 'correct'
                ? 'radial-gradient(ellipse at 50% 50%, rgba(255,240,100,0.82), rgba(255,180,60,0.5) 45%, transparent 72%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(255,30,30,0.78), rgba(180,0,0,0.48) 48%, transparent 72%)',
              pointerEvents: 'none',
              zIndex: 40,
            }}
          />
        )}

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
              {isFeedbackTarget && feedback?.type === 'correct' && (<>
                {/* メイン爆発 */}
                <span
                  className="sd-correct-burst"
                  style={{
                    position: 'absolute',
                    inset: -24,
                    borderRadius: 999,
                    background: 'radial-gradient(circle, rgba(255,252,180,1) 0%, rgba(255,200,60,0.85) 30%, rgba(255,100,160,0.5) 55%, transparent 72%)',
                    boxShadow: '0 0 32px rgba(255,230,80,0.9), 0 0 64px rgba(255,150,50,0.5)',
                    pointerEvents: 'none',
                  }}
                />
                {/* 拡散リング */}
                <span
                  className="sd-correct-ring"
                  style={{
                    position: 'absolute',
                    inset: -16,
                    borderRadius: 999,
                    border: '8px solid rgba(255,230,80,0.9)',
                    boxShadow: '0 0 18px rgba(255,200,60,0.8)',
                    pointerEvents: 'none',
                  }}
                />
                {/* スパークル 6本 */}
                {[0, 60, 120, 180, 240, 300].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const dist = cell * 1.1;
                  return (
                    <span
                      key={deg}
                      className="sd-sparkle"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: deg % 120 === 0 ? '#fff9c4' : '#ffd54f',
                        boxShadow: '0 0 8px rgba(255,220,60,1)',
                        pointerEvents: 'none',
                        // CSS変数でアニメーション終点を渡す
                        ['--sx' as string]: `calc(-50% + ${Math.cos(rad) * dist}px)`,
                        ['--sy' as string]: `calc(-50% + ${Math.sin(rad) * dist}px)`,
                        animationDelay: `${deg * 0.5}ms`,
                      }}
                    />
                  );
                })}
              </>)}
              {isFeedbackTarget && feedback?.type === 'wrong' && (<>
                {/* セル赤フラッシュ */}
                <span
                  className="sd-wrong-flash"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 6,
                    background: 'rgba(220,30,30,0.82)',
                    boxShadow: 'inset 0 0 18px rgba(255,60,60,0.9)',
                    pointerEvents: 'none',
                  }}
                />
                {/* ペナルティテキスト */}
                <span
                  className="sd-penalty-float"
                  style={{
                    position: 'absolute',
                    left: -14,
                    right: -14,
                    top: -36,
                    color: '#ff4060',
                    fontSize: 22,
                    fontWeight: 900,
                    textShadow: '0 0 12px rgba(255,60,60,0.95), 0 2px 10px rgba(0,0,0,0.9)',
                    pointerEvents: 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  -{Math.ceil(timePenaltyMs / 1000)}秒！
                </span>
              </>)}
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
