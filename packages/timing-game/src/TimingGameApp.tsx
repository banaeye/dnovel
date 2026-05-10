import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EngineProps, IGameEngine } from '@novel-engine/hub';

export interface TimingGameConfig {
  stageId: string;
  title?: string;
  rounds?: number;
  targetHits?: number;
  cycleMs?: number;
  targetWidth?: number;
  _novelReturn?: unknown;
}

const W = 800;
const H = 600;
const FONT = "'Hiragino Kaku Gothic ProN', 'Meiryo', 'Yu Gothic', sans-serif";

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

function markerRatio(now: number, startedAt: number, cycleMs: number): number {
  const t = ((now - startedAt) % cycleMs) / cycleMs;
  return t < 0.5 ? t * 2 : 2 - t * 2;
}

function targetCenter(round: number): number {
  return [0.5, 0.34, 0.68, 0.42, 0.58, 0.26, 0.74, 0.48][round % 8];
}

function TimingGameComponent({ context, config, onExit }: EngineProps<TimingGameConfig>) {
  const scale = useGameScale();
  const stageId = config.stageId || 'default';
  const rounds = Math.max(1, config.rounds ?? 6);
  const targetHits = Math.max(1, Math.min(rounds, config.targetHits ?? 4));
  const cycleMs = Math.max(900, config.cycleMs ?? 1700);
  const targetWidth = Math.max(0.08, Math.min(0.34, config.targetWidth ?? 0.18));
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | null>(null);
  const [finished, setFinished] = useState<'win' | 'lose' | null>(null);

  const target = useMemo(() => {
    const center = targetCenter(round);
    return {
      left: Math.max(0, center - targetWidth / 2),
      right: Math.min(1, center + targetWidth / 2),
    };
  }, [round, targetWidth]);
  const marker = markerRatio(now, startedAt, cycleMs);
  const barW = 540;
  const barX = (W - barW) / 2;

  useEffect(() => {
    if (finished) return;
    let frame = 0;
    const tick = () => {
      setNow(Date.now());
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [finished]);

  useEffect(() => {
    if (!finished) return;
    const id = window.setTimeout(() => {
      onExit({
        ...context,
        flags: {
          ...context.flags,
          timing_game_result: finished,
          [`timing_game_result_${stageId}`]: finished,
          timing_game_hits: hits,
          [`timing_game_hits_${stageId}`]: hits,
        },
        playerStats: {
          ...context.playerStats,
          timingGameHits: hits,
        },
      });
    }, 1500);
    return () => window.clearTimeout(id);
  }, [context, finished, hits, onExit, stageId]);

  const attempt = useCallback(() => {
    if (finished || feedback) return;
    const ok = marker >= target.left && marker <= target.right;
    const nextRound = round + 1;
    const nextHits = hits + (ok ? 1 : 0);
    setFeedback(ok ? 'hit' : 'miss');
    window.setTimeout(() => {
      setFeedback(null);
      if (nextHits >= targetHits) {
        setHits(nextHits);
        setFinished('win');
        return;
      }
      if (nextRound >= rounds) {
        setHits(nextHits);
        setFinished(nextHits >= targetHits ? 'win' : 'lose');
        return;
      }
      setRound(nextRound);
      setHits(nextHits);
      setMisses((value) => value + (ok ? 0 : 1));
      setStartedAt(Date.now());
    }, 520);
  }, [feedback, finished, hits, marker, round, rounds, target.left, target.right, targetHits]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      attempt();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [attempt]);

  return (
    <div style={{ width: '100vw', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060a', overflow: 'hidden' }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center center', position: 'relative', overflow: 'hidden', fontFamily: FONT, background: 'linear-gradient(180deg,#15151c,#30202b 58%,#0d0e13)', color: '#f8f1df' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 35%, rgba(255,88,118,0.25), transparent 45%)' }} />
        <div style={{ position: 'absolute', top: 24, left: 28, right: 28, height: 70, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <span style={{ fontSize: 20 }}>{config.title ?? 'タイミング勝負'}</span>
          <span>成功 {hits} / {targetHits}</span>
          <span>{Math.min(round + 1, rounds)} / {rounds}</span>
        </div>
        <div style={{ position: 'absolute', left: barX, top: 252, width: barW, height: 52, borderRadius: 8, background: '#171922', border: '2px solid rgba(255,255,255,0.2)', boxShadow: 'inset 0 0 22px rgba(0,0,0,0.55)' }}>
          <div style={{ position: 'absolute', left: target.left * barW, top: 0, width: (target.right - target.left) * barW, height: '100%', background: 'rgba(255,225,103,0.72)', boxShadow: '0 0 24px rgba(255,225,103,0.35)' }} />
          <div style={{ position: 'absolute', left: marker * barW - 5, top: -14, width: 10, height: 80, borderRadius: 999, background: '#ff5f87', boxShadow: '0 0 18px rgba(255,95,135,0.72)' }} />
        </div>
        <button
          onClick={attempt}
          disabled={Boolean(finished || feedback)}
          style={{ position: 'absolute', left: 300, top: 354, width: 200, height: 58, borderRadius: 8, border: '1px solid rgba(255,255,255,0.28)', background: '#f3d15f', color: '#22170d', fontSize: 20, fontWeight: 700, cursor: finished || feedback ? 'default' : 'pointer' }}
        >
          止める
        </button>
        <div style={{ position: 'absolute', left: 44, bottom: 34, right: 44, display: 'flex', justifyContent: 'space-between', color: '#d8d0c4', fontSize: 15 }}>
          <span>黄色い範囲で止める</span>
          <span>ミス {misses}</span>
        </div>
        {feedback && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: feedback === 'hit' ? '#fff176' : '#ef9a9a', fontSize: 56, background: 'rgba(0,0,0,0.24)', letterSpacing: '0.12em' }}>
            {feedback === 'hit' ? '成功' : '失敗'}
          </div>
        )}
        {finished && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,10,0.86)', color: finished === 'win' ? '#fff176' : '#ef9a9a', fontSize: 48, letterSpacing: '0.18em' }}>
            {finished === 'win' ? '浄　化' : '失　敗'}
            <span style={{ marginTop: 18, color: '#d8d0c4', fontSize: 18, letterSpacing: 0 }}>{hits} / {targetHits}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const TimingGameEngine: IGameEngine<TimingGameConfig> = {
  component: TimingGameComponent,
};
