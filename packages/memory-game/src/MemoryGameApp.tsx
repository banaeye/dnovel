import { useCallback, useEffect, useRef, useState } from 'react';
import type { IGameEngine, EngineProps } from '@novel-engine/hub';

export interface MemoryGameConfig {
  stageId: string;
  pairs?: number;     // default 6 (4×3 grid)
  maxTurns?: number;  // default 20; 0 = unlimited
  title?: string;
  assetsBaseUrl?: string;
  _novelReturn?: unknown;
}

const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";
const W = 800;
const H = 600;

const PAIR_DEFS = [
  { symbol: '飴', color: '#f4a260' },
  { symbol: '花', color: '#f48fb1' },
  { symbol: '星', color: '#fff176' },
  { symbol: '月', color: '#ce93d8' },
  { symbol: '家', color: '#80cbc4' },
  { symbol: '鐘', color: '#80deea' },
  { symbol: '鳥', color: '#a5d6a7' },
  { symbol: '波', color: '#64b5f6' },
];

interface Card {
  id: number;   // unique per card (0..pairs*2-1)
  pairId: number;
}

interface GameState {
  cards: Card[];
  flipped: number[];   // card ids currently face-up (not yet matched), max 2
  matched: number[];   // pairIds confirmed matched
  turns: number;
  phase: 'playing' | 'win' | 'lose';
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildInitialState(pairs: number): GameState {
  const cards: Card[] = [];
  for (let p = 0; p < pairs; p++) {
    cards.push({ id: p * 2, pairId: p });
    cards.push({ id: p * 2 + 1, pairId: p });
  }
  return { cards: shuffle(cards), flipped: [], matched: [], turns: 0, phase: 'playing' };
}

const COLS = 4;
const CARD_W = 110;
const CARD_H = 140;
const GAP_X = 14;
const GAP_Y = 14;

function MemoryGameComponent({ context, config, onExit }: EngineProps<MemoryGameConfig>) {
  const pairs = config.pairs ?? 6;
  const maxTurns = config.maxTurns ?? 20;
  const rows = Math.ceil((pairs * 2) / COLS);

  const gridW = COLS * CARD_W + (COLS - 1) * GAP_X;
  const gridH = rows * CARD_H + (rows - 1) * GAP_Y;
  const gridX = (W - gridW) / 2;
  const gridY = Math.round((H - gridH) / 2) + 16;

  const [state, setState] = useState<GameState>(() => buildInitialState(pairs));
  const lockRef = useRef(false);

  // Exit after showing result overlay
  useEffect(() => {
    if (state.phase !== 'win' && state.phase !== 'lose') return;
    const won = state.phase === 'win';
    const timer = setTimeout(() => {
      onExit({
        ...context,
        flags: {
          ...context.flags,
          [`memory_game_result_${config.stageId}`]: won ? 'win' : 'lose',
        },
      });
    }, 2500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const handleCardClick = useCallback((cardId: number) => {
    if (lockRef.current) return;

    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const card = prev.cards.find(c => c.id === cardId);
      if (!card) return prev;
      if (prev.matched.includes(card.pairId)) return prev;
      if (prev.flipped.includes(cardId)) return prev;
      if (prev.flipped.length >= 2) return prev;

      const newFlipped = [...prev.flipped, cardId];

      if (newFlipped.length < 2) {
        return { ...prev, flipped: newFlipped };
      }

      // Second card selected — evaluate
      const [id1, id2] = newFlipped;
      const c1 = prev.cards.find(c => c.id === id1)!;
      const c2 = prev.cards.find(c => c.id === id2)!;
      const isMatch = c1.pairId === c2.pairId;
      const newTurns = prev.turns + 1;

      if (isMatch) {
        const newMatched = [...prev.matched, c1.pairId];
        const won = newMatched.length === pairs;
        return { ...prev, flipped: [], matched: newMatched, turns: newTurns, phase: won ? 'win' : 'playing' };
      }

      // No match — lock input, schedule flip-back
      lockRef.current = true;
      setTimeout(() => {
        setState(s => ({
          ...s,
          flipped: [],
          phase: maxTurns > 0 && s.turns >= maxTurns ? 'lose' : 'playing',
        }));
        lockRef.current = false;
      }, 900);

      return { ...prev, flipped: newFlipped, turns: newTurns };
    });
  }, [pairs, maxTurns]);

  const turnsLeft = maxTurns > 0 ? maxTurns - state.turns : null;
  const turnsWarning = turnsLeft !== null && turnsLeft <= 5;

  return (
    <div style={{
      width: W, height: H,
      background: '#0a0a14',
      fontFamily: FONT,
      position: 'relative',
      userSelect: 'none',
      overflow: 'hidden',
    }}>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 14, left: 0, right: 0,
        textAlign: 'center', color: '#c5cae9',
        fontSize: 17, letterSpacing: '0.1em',
      }}>
        {config.title ?? '神経衰弱'}
      </div>

      {/* Matched pairs */}
      <div style={{
        position: 'absolute', top: 12, left: 24,
        color: '#8bc34a', fontSize: 13,
      }}>
        {state.matched.length} / {pairs} ペア
      </div>

      {/* Turns */}
      <div style={{
        position: 'absolute', top: 12, right: 24,
        color: turnsWarning ? '#ef9a9a' : '#667',
        fontSize: 13,
      }}>
        {maxTurns > 0 ? `残り ${turnsLeft} 手` : `${state.turns} 手`}
      </div>

      {/* Card grid */}
      {state.cards.map((card, idx) => {
        const col = idx % COLS;
        const row = Math.floor(idx / COLS);
        const x = gridX + col * (CARD_W + GAP_X);
        const y = gridY + row * (CARD_H + GAP_Y);
        const isFaceUp = state.flipped.includes(card.id) || state.matched.includes(card.pairId);
        const isMatched = state.matched.includes(card.pairId);
        const def = PAIR_DEFS[card.pairId % PAIR_DEFS.length];

        return (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            style={{
              position: 'absolute',
              left: x, top: y,
              width: CARD_W, height: CARD_H,
              borderRadius: 8,
              cursor: isFaceUp ? 'default' : 'pointer',
              background: isFaceUp ? '#141426' : '#0c0c1c',
              border: isMatched
                ? `2px solid ${def.color}`
                : isFaceUp
                  ? '2px solid #3a3a5a'
                  : '2px solid #1e1e36',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isMatched ? `0 0 14px ${def.color}55` : 'none',
              transition: 'background 0.12s, border-color 0.12s',
            }}
          >
            {isFaceUp ? (
              <span style={{
                fontSize: 52,
                color: isMatched ? `${def.color}99` : def.color,
                lineHeight: 1,
              }}>
                {def.symbol}
              </span>
            ) : (
              <span style={{ fontSize: 28, color: '#252545' }}>✦</span>
            )}
          </div>
        );
      })}

      {/* Win overlay */}
      {state.phase === 'win' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,8,18,0.88)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 18,
        }}>
          <div style={{ fontSize: 42, color: '#fff176', letterSpacing: '0.2em' }}>
            勝　利
          </div>
          <div style={{ fontSize: 16, color: '#c5cae9', letterSpacing: '0.08em' }}>
            {state.turns} 手でクリア
          </div>
        </div>
      )}

      {/* Lose overlay */}
      {state.phase === 'lose' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,8,18,0.88)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 18,
        }}>
          <div style={{ fontSize: 42, color: '#ef9a9a', letterSpacing: '0.2em' }}>
            惜　敗
          </div>
          <div style={{ fontSize: 16, color: '#778', letterSpacing: '0.06em' }}>
            もう一度チャレンジしてください
          </div>
        </div>
      )}
    </div>
  );
}

export const MemoryGameEngine: IGameEngine<MemoryGameConfig> = {
  component: MemoryGameComponent,
};
