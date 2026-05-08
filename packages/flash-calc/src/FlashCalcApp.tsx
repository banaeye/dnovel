import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { IGameEngine, EngineProps } from '@novel-engine/hub';

export interface FlashCalcConfig {
  difficulty?: 'easy' | 'normal' | 'hard';
  rounds?: number;
  assetsBaseUrl?: string;
  _novelReturn?: unknown;
}

const W = 800;
const H = 600;
const FONT = "'Hiragino Kaku Gothic ProN', 'Meiryo', 'Yu Gothic', sans-serif";
const PASS_THRESHOLD = 3;

const STYLES = `
@keyframes fcMountIn  { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
@keyframes fcPhaseIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes fcNumPop   { 0%{opacity:0;transform:scale(0.65)} 65%{opacity:1;transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
@keyframes fcGoFlash  { 0%{opacity:0;transform:scale(0.45)} 55%{opacity:1;transform:scale(1.14)} 100%{opacity:1;transform:scale(1)} }
@keyframes fcLightOn  { 0%,100%{filter:brightness(0.8)} 50%{filter:brightness(1.25)} }
@keyframes fcCorrect  { 0%{transform:scale(0.8);filter:brightness(0.3)} 55%{transform:scale(1.08);filter:brightness(1.6)} 100%{transform:scale(1);filter:brightness(1)} }
@keyframes fcWrong    { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-11px)} 35%{transform:translateX(11px)} 55%{transform:translateX(-7px)} 75%{transform:translateX(7px)} 90%{transform:translateX(-3px)} }
@keyframes fcResultIn { from{opacity:0;transform:scale(0.84)} to{opacity:1;transform:scale(1)} }
@keyframes fcScan     { from{background-position:0 0} to{background-position:0 60px} }
.fc-btn { transition:transform 0.12s ease,border-color 0.15s,box-shadow 0.15s; cursor:pointer; }
.fc-btn:hover:not([disabled]) { transform:scale(1.05) !important; border-color:rgba(0,240,255,0.65) !important; box-shadow:0 0 30px rgba(0,240,255,0.28),inset 0 0 20px rgba(0,0,0,0.4) !important; }
.fc-btn:active:not([disabled]) { transform:scale(0.95) !important; }
`;

// ── Difficulty params ──────────────────────────────────────
interface DiffParams {
  count: number; min: number; max: number;
  flashMs: number; blankMs: number; negatives: number;
}
const DIFF: Record<NonNullable<FlashCalcConfig['difficulty']>, DiffParams> = {
  easy:   { count: 3, min: 1, max: 9,  flashMs: 800, blankMs: 150, negatives: 0 },
  normal: { count: 4, min: 3, max: 20, flashMs: 600, blankMs: 120, negatives: 1 },
  hard:   { count: 5, min: 5, max: 50, flashMs: 400, blankMs: 100, negatives: 2 },
};

// ── Problem generation ─────────────────────────────────────
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
interface Problem { nums: number[]; answer: number; }

function generateProblem(difficulty: NonNullable<FlashCalcConfig['difficulty']>): Problem {
  const { count, min, max, negatives } = DIFF[difficulty];
  while (true) {
    const nums = [randInt(min, max)];
    for (let i = 1; i < count; i++) {
      const neg = negatives > 0 && i <= negatives && Math.random() < 0.45;
      nums.push(randInt(min, max) * (neg ? -1 : 1));
    }
    const answer = nums.reduce((a, b) => a + b, 0);
    if (answer > 0) return { nums, answer };
  }
}
function generateChoices(correct: number): number[] {
  const set = new Set<number>([correct]);
  for (const s of shuffle([3, 7, 12, 18, 25])) {
    if (set.size >= 4) break;
    const c = correct + (Math.random() < 0.5 ? s : -s);
    if (c > 0 && c !== correct) set.add(c);
  }
  let off = 1;
  while (set.size < 4) { set.add(correct + off); set.add(correct - off); off++; }
  return shuffle([...set].slice(0, 4));
}

// ── State machine ──────────────────────────────────────────
type Phase = 'countdown' | 'flash' | 'blank' | 'answer' | 'feedback' | 'result';
interface GameState {
  phase: Phase; countdown: number;
  round: number; problem: Problem;
  flashIdx: number; choices: number[];
  selected: number | null; isCorrect: boolean | null;
  score: number; seq: number;
}
function initState(difficulty: NonNullable<FlashCalcConfig['difficulty']>): GameState {
  const problem = generateProblem(difficulty);
  return {
    phase: 'countdown', countdown: 5,
    round: 0, problem, flashIdx: 0,
    choices: generateChoices(problem.answer),
    selected: null, isCorrect: null, score: 0, seq: 0,
  };
}

// ── Scale hook ─────────────────────────────────────────────
function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / W, window.innerHeight / H));
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const u = () => setScale(get());
    window.addEventListener('resize', u);
    return () => window.removeEventListener('resize', u);
  }, []); // eslint-disable-line
  return scale;
}

// ── CSS injector ───────────────────────────────────────────
function useStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.setAttribute('data-fc', '1');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
}

// ── Main component ─────────────────────────────────────────
function FlashCalcComponent({ context, config, onExit }: EngineProps<FlashCalcConfig>) {
  const difficulty = config.difficulty ?? 'easy';
  const totalRounds = config.rounds ?? 5;
  const params = DIFF[difficulty];
  const scale = useGameScale();
  useStyles();
  const [state, setState] = useState<GameState>(() => initState(difficulty));
  const seqRef = useRef(0);
  const nextSeq = useCallback(() => { seqRef.current += 1; return seqRef.current; }, []);

  // Countdown: 5→4→3→2→1→0(GO!)→flash
  useEffect(() => {
    if (state.phase !== 'countdown') return;
    const seq = nextSeq();
    const delay = state.countdown === 0 ? 700 : 460;
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      if (state.countdown > 0) {
        setState(s => ({ ...s, countdown: s.countdown - 1, seq: s.seq + 1 }));
      } else {
        setState(s => ({ ...s, phase: 'flash', flashIdx: 0, seq: s.seq + 1 }));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [state.phase, state.countdown, state.seq]); // eslint-disable-line

  // Flash → blank / answer
  useEffect(() => {
    if (state.phase !== 'flash') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      if (state.flashIdx + 1 < state.problem.nums.length) {
        setState(s => ({ ...s, phase: 'blank', seq: s.seq + 1 }));
      } else {
        setState(s => ({ ...s, phase: 'answer', selected: null, isCorrect: null, seq: s.seq + 1 }));
      }
    }, params.flashMs);
    return () => clearTimeout(id);
  }, [state.phase, state.flashIdx, state.seq]); // eslint-disable-line

  // Blank → next flash
  useEffect(() => {
    if (state.phase !== 'blank') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      setState(s => ({ ...s, phase: 'flash', flashIdx: s.flashIdx + 1, seq: s.seq + 1 }));
    }, params.blankMs);
    return () => clearTimeout(id);
  }, [state.phase, state.seq]); // eslint-disable-line

  // Feedback → next round / result
  useEffect(() => {
    if (state.phase !== 'feedback') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      const next = state.round + 1;
      if (next >= totalRounds) {
        setState(s => ({ ...s, phase: 'result', seq: s.seq + 1 }));
      } else {
        const problem = generateProblem(difficulty);
        setState(s => ({
          ...s, phase: 'countdown', countdown: 5,
          round: next, problem, flashIdx: 0,
          choices: generateChoices(problem.answer),
          selected: null, isCorrect: null, seq: s.seq + 1,
        }));
      }
    }, 1400);
    return () => clearTimeout(id);
  }, [state.phase, state.round, state.seq]); // eslint-disable-line

  // Result → exit
  useEffect(() => {
    if (state.phase !== 'result') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      onExit({
        ...context,
        flags: {
          ...context.flags,
          flash_calc_score: state.score,
          flash_calc_rounds: totalRounds,
          flash_calc_passed: state.score > PASS_THRESHOLD,
        },
        playerStats: { ...context.playerStats, flash_calc_score: state.score },
      });
    }, 3500);
    return () => clearTimeout(id);
  }, [state.phase]); // eslint-disable-line

  const handleAnswer = useCallback((choice: number) => {
    if (state.phase !== 'answer') return;
    const ok = choice === state.problem.answer;
    setState(s => ({
      ...s, phase: 'feedback', selected: choice,
      isCorrect: ok, score: ok ? s.score + 1 : s.score, seq: s.seq + 1,
    }));
  }, [state.phase, state.problem.answer]);

  const currentNum = state.problem.nums[state.flashIdx];
  // Unique key per meaningful state so mount-animation replays on each transition
  const centerKey = state.phase === 'flash' ? `flash-${state.flashIdx}` : state.phase;

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#02020a', overflow: 'hidden',
    }}>
      <div style={{
        width: W, height: H,
        position: 'relative', overflow: 'hidden',
        flexShrink: 0, transformOrigin: 'center center',
        transform: `scale(${scale})`,
        fontFamily: FONT,
        background: [
          'repeating-linear-gradient(0deg,transparent,transparent 49px,rgba(0,240,255,0.04) 49px,rgba(0,240,255,0.04) 50px)',
          'repeating-linear-gradient(90deg,transparent,transparent 49px,rgba(0,240,255,0.04) 49px,rgba(0,240,255,0.04) 50px)',
          'linear-gradient(155deg,#07071a 0%,#040409 55%,#07040f 100%)',
        ].join(','),
        userSelect: 'none',
        animation: 'fcMountIn 0.55s ease-out',
      }}>
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08) 1px,transparent 1px,transparent 4px)',
          backgroundSize: '100% 4px',
          animation: 'fcScan 4s linear infinite',
        }} />

        {/* Corner accents */}
        <Corner top={10} left={10} />
        <Corner top={10} right={10} />
        <Corner bottom={10} left={10} />
        <Corner bottom={10} right={10} />

        <GameHeader round={state.round} totalRounds={totalRounds} score={state.score} />

        <CenterStage
          key={centerKey}
          phase={state.phase}
          countdown={state.countdown}
          currentNum={currentNum}
          isNeg={typeof currentNum === 'number' && currentNum < 0}
          flashIdx={state.flashIdx}
          totalNums={state.problem.nums.length}
          isCorrect={state.isCorrect}
          correctAnswer={state.problem.answer}
          selected={state.selected}
        />

        {(state.phase === 'answer' || state.phase === 'feedback') && (
          <ChoiceRow
            choices={state.choices}
            selected={state.selected}
            correct={state.problem.answer}
            onSelect={handleAnswer}
            disabled={state.phase === 'feedback'}
          />
        )}

        {state.phase === 'result' && (
          <ResultOverlay score={state.score} total={totalRounds} />
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function Corner({ top, bottom, left, right }: { top?: number; bottom?: number; left?: number; right?: number }) {
  return (
    <div style={{
      position: 'absolute', top, bottom, left, right,
      width: 28, height: 28, zIndex: 3, pointerEvents: 'none',
      borderTop:    top    !== undefined ? '1px solid rgba(0,240,255,0.4)' : undefined,
      borderBottom: bottom !== undefined ? '1px solid rgba(0,240,255,0.4)' : undefined,
      borderLeft:   left   !== undefined ? '1px solid rgba(0,240,255,0.4)' : undefined,
      borderRight:  right  !== undefined ? '1px solid rgba(0,240,255,0.4)' : undefined,
    }} />
  );
}

function GameHeader({ round, totalRounds, score }: { round: number; totalRounds: number; score: number }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(3,3,14,0.92)',
      borderBottom: '1px solid rgba(0,240,255,0.15)',
      zIndex: 5,
    }}>
      <span style={{ color: '#6878b0', fontSize: 12, letterSpacing: '0.55em', textTransform: 'uppercase' }}>
        Flash&nbsp;Calc
      </span>
      <span style={{
        position: 'absolute', left: 40,
        color: '#283050', fontSize: 12, letterSpacing: '0.12em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span style={{ color: '#304070' }}>RND</span>
        {' '}<span style={{ color: '#4060a0' }}>{round + 1}</span>
        {' '}<span style={{ color: '#202840' }}>/ {totalRounds}</span>
      </span>
      <span style={{
        position: 'absolute', right: 40,
        display: 'flex', alignItems: 'center', gap: 8,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span style={{ color: '#283050', fontSize: 11, letterSpacing: '0.12em' }}>SCORE</span>
        <span style={{ color: '#40c070', fontSize: 18, fontWeight: 700, textShadow: '0 0 12px rgba(60,200,100,0.5)' }}>
          {score}
        </span>
      </span>
    </div>
  );
}

// Shared layout for the center area
const CENTER: CSSProperties = {
  position: 'absolute', left: 0, right: 0, top: 44, bottom: 150,
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
};

function CenterStage({
  phase, countdown, currentNum, isNeg,
  flashIdx, totalNums, isCorrect, correctAnswer, selected,
}: {
  phase: Phase; countdown: number;
  currentNum: number; isNeg: boolean;
  flashIdx: number; totalNums: number;
  isCorrect: boolean | null; correctAnswer: number; selected: number | null;
}) {
  if (phase === 'result') return null;

  // ── F1 countdown ──
  if (phase === 'countdown') {
    const litCount = countdown === 0 ? 0 : 6 - countdown; // 5→1, 4→2, ..., 1→5, 0→0
    const isGo = countdown === 0;
    return (
      <div style={{ ...CENTER, animation: 'fcPhaseIn 0.22s ease-out', gap: 0 }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.55em', color: '#2a3060',
          textTransform: 'uppercase', marginBottom: 24,
        }}>
          {isGo ? 'Start' : 'Ready'}
        </div>

        {/* Light housing */}
        <div style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0c0a1e, #060410)',
          border: '1px solid rgba(60,40,110,0.55)',
          borderRadius: 16,
          padding: '26px 40px',
          display: 'flex', gap: 30,
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.85), 0 4px 40px rgba(0,0,0,0.6)',
        }}>
          {Array.from({ length: 5 }, (_, i) => {
            const lit = i < litCount;
            return (
              <div key={i} style={{
                width: 56, height: 56,
                borderRadius: '50%',
                background: lit
                  ? 'radial-gradient(circle at 38% 32%, #ff6050 0%, #cc0000 55%, #800000 100%)'
                  : 'radial-gradient(circle at 38% 32%, #1e0c0c 0%, #0e0404 100%)',
                border: `3px solid ${lit ? '#ff4030' : '#1a0808'}`,
                boxShadow: lit
                  ? '0 0 22px #ff0000, 0 0 50px rgba(255,0,0,0.55), 0 0 90px rgba(255,0,0,0.25), inset 0 2px 8px rgba(255,180,160,0.25)'
                  : 'inset 0 2px 6px rgba(0,0,0,0.9)',
                animation: lit ? 'fcLightOn 1.6s ease-in-out infinite' : 'none',
                transition: 'background 0.12s, border-color 0.12s, box-shadow 0.15s',
              }} />
            );
          })}
        </div>

        {isGo ? (
          <div style={{
            fontSize: 86, color: '#00ff60',
            letterSpacing: '0.1em', marginTop: 28,
            textShadow: '0 0 28px #00ff60, 0 0 60px rgba(0,255,96,0.6), 0 0 120px rgba(0,255,96,0.3)',
            animation: 'fcGoFlash 0.38s cubic-bezier(0.17,0.89,0.32,1.27)',
          }}>
            GO！
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#252548', letterSpacing: '0.14em', marginTop: 22 }}>
            集中してください
          </div>
        )}
      </div>
    );
  }

  // ── Flash: show number ──
  if (phase === 'flash') {
    const numStr = isNeg ? `−${Math.abs(currentNum)}` : `${currentNum}`;
    const numColor = isNeg ? '#ff7878' : '#d8eeff';
    const numGlow  = isNeg ? 'rgba(255,80,80,0.65)' : 'rgba(80,180,255,0.7)';
    return (
      <div style={{ ...CENTER, gap: 0 }}>
        <ProgressDots total={totalNums} done={flashIdx} active={flashIdx} />
        <div style={{
          fontSize: 118, color: numColor,
          lineHeight: 1, fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 40px ${numGlow}, 0 0 90px ${numGlow.replace('0.7', '0.35')}`,
          animation: 'fcNumPop 0.2s cubic-bezier(0.17,0.89,0.32,1.27)',
          letterSpacing: '0.04em',
        }}>
          {numStr}
        </div>
      </div>
    );
  }

  // ── Blank: just dots ──
  if (phase === 'blank') {
    return (
      <div style={{ ...CENTER }}>
        <ProgressDots total={totalNums} done={flashIdx + 1} active={null} />
      </div>
    );
  }

  // ── Answer: ? ──
  if (phase === 'answer') {
    return (
      <div style={{ ...CENTER, gap: 14, animation: 'fcPhaseIn 0.25s ease-out' }}>
        <div style={{
          fontSize: 88, color: '#3a4888',
          textShadow: '0 0 24px rgba(60,80,180,0.4)',
          lineHeight: 1,
        }}>
          ?
        </div>
        <div style={{ fontSize: 13, color: '#2c2c54', letterSpacing: '0.18em' }}>
          こたえを　えらんでね
        </div>
      </div>
    );
  }

  // ── Feedback ──
  if (phase === 'feedback') {
    if (isCorrect) {
      return (
        <div style={{ ...CENTER, gap: 12, animation: 'fcCorrect 0.42s ease-out' }}>
          <div style={{
            fontSize: 60, color: '#50ff8c',
            textShadow: '0 0 28px rgba(80,255,140,0.7), 0 0 60px rgba(80,255,140,0.35)',
            letterSpacing: '0.08em',
          }}>
            せいかい！
          </div>
          <div style={{
            fontSize: 42, color: '#a0ffcc',
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 0 16px rgba(80,255,140,0.4)',
          }}>
            {correctAnswer}
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...CENTER, gap: 10, animation: 'fcWrong 0.48s ease-out' }}>
        <div style={{
          fontSize: 60, color: '#ff5555',
          textShadow: '0 0 28px rgba(255,60,60,0.7)',
          letterSpacing: '0.08em',
        }}>
          ざんねん
        </div>
        <div style={{ fontSize: 18, color: '#7a3a5a', letterSpacing: '0.1em' }}>
          こたえは&nbsp;
          <span style={{ color: '#c06080', fontVariantNumeric: 'tabular-nums' }}>
            {correctAnswer}
          </span>
        </div>
        {selected !== null && (
          <div style={{ fontSize: 13, color: '#3a2030' }}>
            あなたは {selected} と答えました
          </div>
        )}
      </div>
    );
  }

  return null;
}

function ProgressDots({ total, done, active }: { total: number; done: number; active: number | null }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
      {Array.from({ length: total }, (_, i) => {
        const isDone   = i < done;
        const isActive = i === active;
        return (
          <div key={i} style={{
            width: 10, height: 10,
            borderRadius: 2,
            background: isActive
              ? '#00f0ff'
              : isDone
              ? 'rgba(0,200,255,0.45)'
              : 'rgba(24,24,50,0.7)',
            boxShadow: isActive
              ? '0 0 10px #00f0ff, 0 0 22px rgba(0,240,255,0.5)'
              : isDone
              ? '0 0 4px rgba(0,200,255,0.3)'
              : 'none',
            transition: 'background 0.15s, box-shadow 0.15s',
          }} />
        );
      })}
    </div>
  );
}

function ChoiceRow({
  choices, selected, correct, onSelect, disabled,
}: {
  choices: number[]; selected: number | null;
  correct: number; onSelect: (n: number) => void; disabled: boolean;
}) {
  return (
    <div style={{
      position: 'absolute', left: 36, right: 36, bottom: 36,
      height: 104, display: 'flex', gap: 18,
      alignItems: 'stretch',
    }}>
      {choices.map(n => {
        let bg     = 'rgba(10,8,28,0.92)';
        let border = '1px solid rgba(0,180,220,0.18)';
        let color  = '#8898cc';
        let shadow = 'none';
        let anim   = 'none';

        if (disabled && selected !== null) {
          if (n === correct) {
            bg     = 'rgba(20,60,35,0.95)';
            border = '1px solid rgba(80,255,140,0.55)';
            color  = '#80ffb8';
            shadow = '0 0 28px rgba(60,220,110,0.35)';
            anim   = 'fcCorrect 0.4s ease-out';
          } else if (n === selected) {
            bg     = 'rgba(60,18,22,0.95)';
            border = '1px solid rgba(255,80,80,0.5)';
            color  = '#ff7070';
            shadow = '0 0 18px rgba(255,60,60,0.3)';
          }
        }

        return (
          <button
            key={n}
            className="fc-btn"
            onClick={() => !disabled && onSelect(n)}
            disabled={disabled}
            style={{
              flex: 1, height: '100%',
              background: bg,
              border,
              borderRadius: 10,
              color,
              fontSize: 38,
              fontFamily: FONT,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              boxShadow: shadow,
              animation: anim,
              letterSpacing: '0.04em',
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function ResultOverlay({ score, total }: { score: number; total: number }) {
  const passed  = score > PASS_THRESHOLD;
  const perfect = score === total;
  const color   = perfect ? '#fff080' : passed ? '#60ff90' : '#ff6060';
  const message = perfect ? 'パーフェクト！' : passed ? 'よくできました！' : 'ざんねん…';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'rgba(2,2,12,0.94)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 0,
      animation: 'fcResultIn 0.5s cubic-bezier(0.17,0.89,0.32,1.27)',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '0.55em', color: '#242448',
        textTransform: 'uppercase', marginBottom: 32,
      }}>
        Result
      </div>
      <div style={{
        fontSize: 46, color, letterSpacing: '0.14em',
        textShadow: `0 0 36px ${color}88, 0 0 70px ${color}44`,
        marginBottom: 24,
      }}>
        {message}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{
          fontSize: 92, color,
          fontVariantNumeric: 'tabular-nums', fontWeight: 700,
          textShadow: `0 0 50px ${color}66, 0 0 100px ${color}33`,
        }}>
          {score}
        </span>
        <span style={{ fontSize: 28, color: '#242448' }}>/ {total}</span>
      </div>
      {!passed && (
        <div style={{ fontSize: 15, color: '#4a2840', letterSpacing: '0.12em', marginTop: 20 }}>
          4もん以上せいかいしてね
        </div>
      )}
    </div>
  );
}

export const FlashCalcEngine: IGameEngine<FlashCalcConfig> = {
  component: FlashCalcComponent,
};
