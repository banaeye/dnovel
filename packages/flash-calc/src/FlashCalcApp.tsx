import { useCallback, useEffect, useRef, useState } from 'react';
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

// ──────────────────────────────────────────────────────────
// Difficulty params
// ──────────────────────────────────────────────────────────
interface DiffParams {
  count: number;   // numbers per problem
  min: number;
  max: number;
  flashMs: number; // ms each number is shown
  blankMs: number; // ms of blank between numbers
  negatives: number; // how many may be negative (subtraction)
}

const DIFF: Record<NonNullable<FlashCalcConfig['difficulty']>, DiffParams> = {
  easy:   { count: 3, min: 1, max: 9,  flashMs: 800, blankMs: 150, negatives: 0 },
  normal: { count: 4, min: 3, max: 20, flashMs: 600, blankMs: 120, negatives: 1 },
  hard:   { count: 5, min: 5, max: 50, flashMs: 400, blankMs: 100, negatives: 2 },
};

// ──────────────────────────────────────────────────────────
// Problem generation
// ──────────────────────────────────────────────────────────
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

interface Problem {
  nums: number[];
  answer: number;
}

function generateProblem(difficulty: NonNullable<FlashCalcConfig['difficulty']>): Problem {
  const { count, min, max, negatives } = DIFF[difficulty];

  while (true) {
    const nums: number[] = [];
    // First number is always positive
    nums.push(randInt(min, max));
    for (let i = 1; i < count; i++) {
      const isNeg = negatives > 0 && i <= negatives && Math.random() < 0.45;
      nums.push(randInt(min, max) * (isNeg ? -1 : 1));
    }
    const answer = nums.reduce((a, b) => a + b, 0);
    if (answer > 0) return { nums, answer };
    // Retry if answer non-positive (avoids confusing kids)
  }
}

function generateChoices(correct: number): number[] {
  const set = new Set<number>([correct]);
  const spreads = [3, 7, 12, 18, 25];
  for (const s of shuffled(spreads)) {
    if (set.size >= 4) break;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const candidate = correct + sign * s;
    if (candidate > 0 && candidate !== correct) set.add(candidate);
  }
  // Fallback: just add offsets
  let offset = 1;
  while (set.size < 4) {
    set.add(correct + offset);
    set.add(correct - offset);
    offset += 1;
  }
  return shuffle([...set].slice(0, 4));
}

function shuffled<T>(arr: T[]): T[] {
  return shuffle(arr);
}

// ──────────────────────────────────────────────────────────
// State machine
// ──────────────────────────────────────────────────────────
type Phase =
  | 'countdown' // 3, 2, 1
  | 'flash'     // showing a number from the sequence
  | 'blank'     // brief gap between numbers
  | 'answer'    // player picks from 4 choices
  | 'feedback'  // correct / wrong reveal
  | 'result';   // final score, then auto-exit

interface GameState {
  phase: Phase;
  countdown: number;    // 3 → 2 → 1 → 0
  round: number;        // 0-indexed
  problem: Problem;
  flashIdx: number;     // which number is currently shown
  choices: number[];
  selected: number | null;
  isCorrect: boolean | null;
  score: number;
  // Used to abort stale timers
  seq: number;
}

function initState(difficulty: NonNullable<FlashCalcConfig['difficulty']>): GameState {
  const problem = generateProblem(difficulty);
  return {
    phase: 'countdown',
    countdown: 3,
    round: 0,
    problem,
    flashIdx: 0,
    choices: generateChoices(problem.answer),
    selected: null,
    isCorrect: null,
    score: 0,
    seq: 0,
  };
}

// ──────────────────────────────────────────────────────────
// Scale hook (same pattern as other engines)
// ──────────────────────────────────────────────────────────
function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / W, window.innerHeight / H));
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const update = () => setScale(get());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return scale;
}

// ──────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────
function FlashCalcComponent({ context, config, onExit }: EngineProps<FlashCalcConfig>) {
  const difficulty = config.difficulty ?? 'easy';
  const totalRounds = config.rounds ?? 5;
  const params = DIFF[difficulty];
  const scale = useGameScale();
  const [state, setState] = useState<GameState>(() => initState(difficulty));
  const seqRef = useRef(0);

  // Advance seq to cancel any pending timers from previous state
  const nextSeq = useCallback(() => {
    seqRef.current += 1;
    return seqRef.current;
  }, []);

  // ── Countdown: 3 → 2 → 1 → start flash ──
  useEffect(() => {
    if (state.phase !== 'countdown') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      if (state.countdown > 1) {
        setState(s => ({ ...s, countdown: s.countdown - 1, seq: s.seq + 1 }));
      } else {
        setState(s => ({ ...s, phase: 'flash', flashIdx: 0, seq: s.seq + 1 }));
      }
    }, 800);
    return () => clearTimeout(id);
  }, [state.phase, state.countdown, state.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Flash: show number for flashMs, then go blank (or answer if last) ──
  useEffect(() => {
    if (state.phase !== 'flash') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      if (state.flashIdx + 1 < state.problem.nums.length) {
        setState(s => ({ ...s, phase: 'blank', seq: s.seq + 1 }));
      } else {
        setState(s => ({
          ...s,
          phase: 'answer',
          selected: null,
          isCorrect: null,
          seq: s.seq + 1,
        }));
      }
    }, params.flashMs);
    return () => clearTimeout(id);
  }, [state.phase, state.flashIdx, state.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Blank: brief gap then next flash ──
  useEffect(() => {
    if (state.phase !== 'blank') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      setState(s => ({ ...s, phase: 'flash', flashIdx: s.flashIdx + 1, seq: s.seq + 1 }));
    }, params.blankMs);
    return () => clearTimeout(id);
  }, [state.phase, state.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Feedback: show result then advance round or finish ──
  useEffect(() => {
    if (state.phase !== 'feedback') return;
    const seq = nextSeq();
    const id = setTimeout(() => {
      if (seqRef.current !== seq) return;
      const nextRound = state.round + 1;
      if (nextRound >= totalRounds) {
        setState(s => ({ ...s, phase: 'result', seq: s.seq + 1 }));
      } else {
        const problem = generateProblem(difficulty);
        setState(s => ({
          ...s,
          phase: 'countdown',
          countdown: 3,
          round: nextRound,
          problem,
          flashIdx: 0,
          choices: generateChoices(problem.answer),
          selected: null,
          isCorrect: null,
          seq: s.seq + 1,
        }));
      }
    }, 1400);
    return () => clearTimeout(id);
  }, [state.phase, state.round, state.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Result: always return to novel after showing score ──
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
        playerStats: {
          ...context.playerStats,
          flash_calc_score: state.score,
        },
      });
    }, 3500);
    return () => clearTimeout(id);
  }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Player picks an answer ──
  const handleAnswer = useCallback((choice: number) => {
    if (state.phase !== 'answer') return;
    const isCorrect = choice === state.problem.answer;
    setState(s => ({
      ...s,
      phase: 'feedback',
      selected: choice,
      isCorrect,
      score: isCorrect ? s.score + 1 : s.score,
      seq: s.seq + 1,
    }));
  }, [state.phase, state.problem.answer]);

  // ── Render helpers ──
  const currentNum = state.problem.nums[state.flashIdx];
  const isNegCurrentNum = typeof currentNum === 'number' && currentNum < 0;

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a14', overflow: 'hidden',
    }}>
      <div style={{
        width: W, height: H,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        transformOrigin: 'center center',
        transform: `scale(${scale})`,
        fontFamily: FONT,
        background: 'linear-gradient(160deg, #0c0c1e 0%, #080812 60%, #10081e 100%)',
        userSelect: 'none',
      }}>

        {/* ── Header ── */}
        <Header round={state.round} totalRounds={totalRounds} score={state.score} />

        {/* ── Center stage ── */}
        <CenterStage
          phase={state.phase}
          countdown={state.countdown}
          currentNum={currentNum}
          isNeg={isNegCurrentNum}
          flashIdx={state.flashIdx}
          totalNums={state.problem.nums.length}
          isCorrect={state.isCorrect}
          correctAnswer={state.problem.answer}
          selected={state.selected}
        />

        {/* ── Choices (answer phase) ── */}
        {(state.phase === 'answer' || state.phase === 'feedback') && (
          <ChoiceRow
            choices={state.choices}
            selected={state.selected}
            correct={state.problem.answer}
            onSelect={handleAnswer}
            disabled={state.phase === 'feedback'}
          />
        )}

        {/* ── Result overlay ── */}
        {state.phase === 'result' && (
          <ResultOverlay score={state.score} total={totalRounds} />
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────

function Header({ round, totalRounds, score }: { round: number; totalRounds: number; score: number }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: '1px solid rgba(80,60,140,0.4)',
      background: 'rgba(8,8,20,0.8)',
      zIndex: 5,
    }}>
      <span style={{ color: '#c5cae9', fontSize: 15, letterSpacing: '0.18em' }}>
        フラッシュ暗算
      </span>
      <span style={{
        position: 'absolute', left: 24,
        color: '#7c7ca0', fontSize: 13, letterSpacing: '0.06em',
      }}>
        ラウンド {round + 1} / {totalRounds}
      </span>
      <span style={{
        position: 'absolute', right: 24,
        color: '#8bc34a', fontSize: 13, letterSpacing: '0.06em',
      }}>
        正解 {score}
      </span>
    </div>
  );
}

function CenterStage({
  phase, countdown, currentNum, isNeg,
  flashIdx, totalNums, isCorrect, correctAnswer, selected,
}: {
  phase: Phase;
  countdown: number;
  currentNum: number;
  isNeg: boolean;
  flashIdx: number;
  totalNums: number;
  isCorrect: boolean | null;
  correctAnswer: number;
  selected: number | null;
}) {
  const centerY = 44 + Math.round((H - 44 - 160) / 2); // between header and choice area

  if (phase === 'result') return null;

  // Countdown
  if (phase === 'countdown') {
    return (
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: centerY - 80, bottom: 160,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20,
      }}>
        <div style={{
          fontSize: 96, color: '#e8d5ff',
          lineHeight: 1,
          textShadow: '0 0 60px rgba(180,100,255,0.6)',
          animation: 'flashCalcPop 0.25s ease-out',
        }}>
          {countdown}
        </div>
        <div style={{ fontSize: 14, color: '#5c5c80', letterSpacing: '0.1em' }}>
          集中してください
        </div>
      </div>
    );
  }

  // Flash: show a number
  if (phase === 'flash') {
    const numStr = isNeg ? `−${Math.abs(currentNum)}` : `${currentNum}`;
    return (
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: centerY - 60, bottom: 160,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24,
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          {Array.from({ length: totalNums }, (_, i) => (
            <div key={i} style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: i < flashIdx ? 'rgba(140,120,220,0.5)' : i === flashIdx ? '#c5b3ff' : 'rgba(60,60,90,0.5)',
              transition: 'background 0.15s',
            }} />
          ))}
        </div>
        {/* The number */}
        <div style={{
          fontSize: 110,
          color: isNeg ? '#ef9a9a' : '#e8d5ff',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 60px ${isNeg ? 'rgba(239,154,154,0.55)' : 'rgba(180,140,255,0.55)'}`,
        }}>
          {numStr}
        </div>
      </div>
    );
  }

  // Blank: nothing visible in center
  if (phase === 'blank') {
    return (
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: centerY - 60, bottom: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {Array.from({ length: totalNums }, (_, i) => (
            <div key={i} style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: i < flashIdx ? 'rgba(140,120,220,0.5)' : 'rgba(60,60,90,0.5)',
            }} />
          ))}
        </div>
      </div>
    );
  }

  // Answer: question mark
  if (phase === 'answer') {
    return (
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: centerY - 60, bottom: 160,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}>
        <div style={{ fontSize: 80, color: '#7c72a0', lineHeight: 1 }}>?</div>
        <div style={{ fontSize: 15, color: '#6c6c90', letterSpacing: '0.1em' }}>
          こたえを えらんでね
        </div>
      </div>
    );
  }

  // Feedback
  if (phase === 'feedback') {
    return (
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: centerY - 60, bottom: 160,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}>
        {isCorrect ? (
          <>
            <div style={{
              fontSize: 64, color: '#8bc34a',
              textShadow: '0 0 40px rgba(139,195,74,0.55)',
            }}>
              せいかい！
            </div>
            <div style={{ fontSize: 32, color: '#c5e1a5', fontVariantNumeric: 'tabular-nums' }}>
              {correctAnswer}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, color: '#ef9a9a', textShadow: '0 0 40px rgba(239,154,154,0.5)' }}>
              ざんねん
            </div>
            <div style={{ fontSize: 18, color: '#7c7ca0', letterSpacing: '0.1em' }}>
              こたえは {correctAnswer}
            </div>
            {selected !== null && (
              <div style={{ fontSize: 14, color: '#4a4a68' }}>
                あなたは {selected} と答えました
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}

function ChoiceRow({
  choices, selected, correct, onSelect, disabled,
}: {
  choices: number[];
  selected: number | null;
  correct: number;
  onSelect: (n: number) => void;
  disabled: boolean;
}) {
  return (
    <div style={{
      position: 'absolute',
      left: 40, right: 40, bottom: 40,
      height: 100,
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {choices.map(n => {
        let bg = 'rgba(20,18,40,0.9)';
        let border = '2px solid rgba(80,70,140,0.4)';
        let color = '#c5cae9';
        let shadow = 'none';

        if (disabled && selected !== null) {
          if (n === correct) {
            bg = 'rgba(60,90,30,0.9)';
            border = '2px solid #8bc34a';
            color = '#c5e1a5';
            shadow = '0 0 20px rgba(139,195,74,0.35)';
          } else if (n === selected && n !== correct) {
            bg = 'rgba(80,30,30,0.9)';
            border = '2px solid #ef9a9a';
            color = '#ef9a9a';
          }
        }

        return (
          <button
            key={n}
            onClick={() => !disabled && onSelect(n)}
            style={{
              flex: 1,
              height: '100%',
              background: bg,
              border,
              borderRadius: 12,
              color,
              fontSize: 36,
              fontFamily: FONT,
              fontVariantNumeric: 'tabular-nums',
              cursor: disabled ? 'default' : 'pointer',
              boxShadow: shadow,
              transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

const PASS_THRESHOLD = 3;

function ResultOverlay({ score, total }: { score: number; total: number }) {
  const passed = score > PASS_THRESHOLD;

  if (passed) {
    const color = score === total ? '#fff176' : '#8bc34a';
    const message = score === total ? 'パーフェクト！' : 'よくできました！';
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: 'rgba(6,6,16,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 28,
      }}>
        <div style={{
          fontSize: 48, color, letterSpacing: '0.2em',
          textShadow: `0 0 40px ${color}55`,
        }}>
          {message}
        </div>
        <div style={{
          fontSize: 80, color,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 60px ${color}44`,
        }}>
          {score} <span style={{ fontSize: 28, color: '#6c6c90' }}>/ {total}</span>
        </div>
        <div style={{ fontSize: 14, color: '#4a4a68', letterSpacing: '0.1em' }}>
          せいかい {score} もん
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'rgba(6,6,16,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24,
    }}>
      <div style={{
        fontSize: 48, color: '#ef9a9a', letterSpacing: '0.2em',
        textShadow: '0 0 40px rgba(239,154,154,0.5)',
      }}>
        ざんねん…
      </div>
      <div style={{
        fontSize: 80, color: '#ef9a9a',
        fontVariantNumeric: 'tabular-nums',
        textShadow: '0 0 60px rgba(239,154,154,0.35)',
      }}>
        {score} <span style={{ fontSize: 28, color: '#6c6c90' }}>/ {total}</span>
      </div>
      <div style={{ fontSize: 18, color: '#7c6080', letterSpacing: '0.1em' }}>
        4もん以上せいかいしてね
      </div>
      <div style={{
        marginTop: 8,
        fontSize: 15, color: '#5a4a68', letterSpacing: '0.12em',
      }}>
        ケンに相談しよう…
      </div>
    </div>
  );
}

export const FlashCalcEngine: IGameEngine<FlashCalcConfig> = {
  component: FlashCalcComponent,
};
