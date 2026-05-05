import { useCallback, useEffect, useRef, useState } from 'react';
import type { IGameEngine, EngineProps } from '@novel-engine/hub';

export interface MemoryGameConfig {
  stageId: string;
  mode?: 'solo' | 'duel';
  pairs?: number;
  maxTurns?: number;
  title?: string;
  playerName?: string;
  opponentName?: string;
  playerFaceImage?: string;
  opponentFaceImage?: string;
  playerDialogue?: string[];
  opponentDialogue?: string[];
  backgroundImage?: string;
  assetsBaseUrl?: string;
  _novelReturn?: unknown;
}

const FONT = "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif";
const W = 800;
const H = 600;

// Layout constants (duel mode)
const SIDE_W = 148;       // left/right character panel width
const HEADER_H = 36;      // top title bar
const DIALOGUE_H = 130;   // bottom dialogue box
const CARD_AREA_H = H - HEADER_H - DIALOGUE_H; // 434px available for cards
const CARD_H_DUEL = 120;  // reduced card height in duel to fit 3 rows in CARD_AREA_H

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

const DEFAULT_PLAYER_DIALOGUE = ['どれかな……', 'えーと……', 'うーん……'];
const DEFAULT_OPPONENT_DIALOGUE = ['……', 'ふむ……', 'どれかな'];

interface Card {
  id: number;
  pairId: number;
}

interface GameState {
  cards: Card[];
  flipped: number[];
  matched: number[];
  matchedBy: Record<number, 'player' | 'opponent'>;
  currentTurn: 'player' | 'opponent';
  seen: Record<number, number>;
  playerPairs: number;
  opponentPairs: number;
  turns: number;
  phase: 'playing' | 'win' | 'lose';
}

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
  return {
    cards: shuffle(cards),
    flipped: [],
    matched: [],
    matchedBy: {},
    currentTurn: 'player',
    seen: {},
    playerPairs: 0,
    opponentPairs: 0,
    turns: 0,
    phase: 'playing',
  };
}

const COLS = 4;
const CARD_W = 110;
const CARD_H = 140;
const GAP_X = 14;
const GAP_Y = 14;

function resolveAsset(assetsBaseUrl: string | undefined, path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) return path;
  const base = assetsBaseUrl ?? '/assets';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function pickOpponentCard(state: GameState): number | null {
  const available = state.cards.filter(card => (
    !state.matched.includes(card.pairId) && !state.flipped.includes(card.id)
  ));
  if (available.length === 0) return null;

  if (state.flipped.length === 1) {
    const first = state.cards.find(card => card.id === state.flipped[0]);
    const knownMatch = available.find(card => first && card.pairId === first.pairId);
    if (knownMatch && Math.random() < 0.45) return knownMatch.id;
    return pickRandom(available)?.id ?? null;
  }

  const knownByPair = new Map<number, number[]>();
  for (const card of available) {
    if (state.seen[card.id] !== card.pairId) continue;
    knownByPair.set(card.pairId, [...(knownByPair.get(card.pairId) ?? []), card.id]);
  }
  const knownPair = [...knownByPair.values()].find(ids => ids.length >= 2);
  if (knownPair && Math.random() < 0.25) return knownPair[0];

  return pickRandom(available)?.id ?? null;
}

// Left/right character panel shown in duel mode
function SideCharacterPanel({
  side, name, faceSrc, score, active,
}: {
  side: 'left' | 'right';
  name: string;
  faceSrc: string | undefined;
  score: number;
  active: boolean;
}) {
  const accent = side === 'left' ? '#fff176' : '#80deea';
  const imageAreaH = CARD_AREA_H - 96; // leave 96px at bottom for score

  return (
    <div style={{
      position: 'absolute',
      top: HEADER_H,
      [side]: 0,
      width: SIDE_W,
      height: CARD_AREA_H,
      overflow: 'hidden',
      background: active ? `rgba(${side === 'left' ? '255,241,118' : '128,222,234'},0.06)` : 'rgba(6,6,18,0.65)',
      borderRight: side === 'left' ? `1px solid ${active ? `${accent}55` : 'rgba(38,42,72,0.5)'}` : 'none',
      borderLeft: side === 'right' ? `1px solid ${active ? `${accent}55` : 'rgba(38,42,72,0.5)'}` : 'none',
      transition: 'background 0.4s, border-color 0.4s',
      zIndex: 3,
    }}>

      {/* Character image */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: imageAreaH,
        overflow: 'hidden',
      }}>
        {faceSrc ? (
          <img
            src={faceSrc}
            alt=""
            draggable={false}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              filter: active ? 'none' : 'brightness(0.55) saturate(0.6)',
              transition: 'filter 0.4s',
            }}
          />
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
            color: '#1e2040',
          }}>
            {side === 'left' ? '🎮' : '🤖'}
          </div>
        )}

        {/* Gradient fade into score area */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 60,
          background: `linear-gradient(to top, ${active ? (side === 'left' ? 'rgba(18,16,2,0.96)' : 'rgba(2,16,18,0.96)') : 'rgba(6,6,18,0.96)'} 0%, transparent 100%)`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Score + name bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 96,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderTop: `1px solid ${active ? `${accent}44` : 'rgba(36,40,68,0.5)'}`,
        background: active
          ? (side === 'left' ? 'rgba(22,18,2,0.92)' : 'rgba(2,18,22,0.92)')
          : 'rgba(6,6,18,0.92)',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        <div style={{
          fontSize: 48,
          lineHeight: 1,
          color: active ? accent : '#4a5090',
          fontVariantNumeric: 'tabular-nums',
          textShadow: active ? `0 0 24px ${accent}55` : 'none',
          transition: 'color 0.4s, text-shadow 0.4s',
        }}>
          {score}
        </div>
        <div style={{ fontSize: 10, color: '#3c4278', letterSpacing: '0.08em' }}>取得ペア</div>
        <div style={{
          fontSize: 11,
          color: active ? '#c5cae9' : '#4a5090',
          letterSpacing: '0.05em',
          maxWidth: SIDE_W - 16,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          transition: 'color 0.4s',
        }}>
          {name}
        </div>
      </div>

      {/* Active turn arrow indicator */}
      {active && (
        <div style={{
          position: 'absolute',
          top: 10,
          ...(side === 'left' ? { right: 10 } : { left: 10 }),
          color: accent,
          fontSize: 14,
          opacity: 0.9,
        }}>
          {side === 'left' ? '▶' : '◀'}
        </div>
      )}
    </div>
  );
}

// Novel-style dialogue box at the bottom
function GameDialogueBox({
  speakerName, speakerSide, text,
}: {
  speakerName: string | null;
  speakerSide: 'left' | 'right' | null;
  text: string | null;
}) {
  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0,
      bottom: 0,
      height: DIALOGUE_H,
      background: 'rgba(6,6,20,0.92)',
      borderTop: '1px solid rgba(46,50,88,0.7)',
      zIndex: 10,
    }}>
      {/* Speaker name tab */}
      {speakerName && (
        <div style={{
          position: 'absolute',
          top: -30,
          ...(speakerSide === 'right'
            ? { right: SIDE_W + 20 }
            : { left: SIDE_W + 20 }),
          background: 'rgba(6,6,20,0.94)',
          border: '1px solid rgba(46,50,88,0.7)',
          borderBottom: 'none',
          padding: '5px 20px',
          fontSize: 13,
          color: '#c5cae9',
          letterSpacing: '0.1em',
        }}>
          {speakerName}
        </div>
      )}

      {/* Dialogue text */}
      <div style={{
        position: 'absolute',
        top: 18,
        left: SIDE_W + 24,
        right: SIDE_W + 24,
        bottom: 14,
        color: '#e8eaf6',
        fontSize: 15,
        lineHeight: 1.9,
        letterSpacing: '0.08em',
        overflow: 'hidden',
      }}>
        {text ?? ''}
      </div>
    </div>
  );
}

function MemoryGameComponent({ context, config, onExit }: EngineProps<MemoryGameConfig>) {
  const mode = config.mode ?? 'solo';
  const isDuel = mode === 'duel';
  const pairs = config.pairs ?? 6;
  const maxTurns = config.maxTurns ?? 20;
  const rows = Math.ceil((pairs * 2) / COLS);

  const effectiveCardH = isDuel ? CARD_H_DUEL : CARD_H;
  const gridW = COLS * CARD_W + (COLS - 1) * GAP_X;
  const gridH = rows * effectiveCardH + (rows - 1) * GAP_Y;
  // gridX is mathematically identical for both duel and solo given our constants
  const gridX = Math.round((W - gridW) / 2);
  const gridY = isDuel
    ? HEADER_H + Math.round((CARD_AREA_H - gridH) / 2)
    : Math.round((H - gridH) / 2) + 16;

  const scale = useGameScale();
  const [state, setState] = useState<GameState>(() => buildInitialState(pairs));
  const lockRef = useRef(false);

  const initPlayerLine = () => {
    if (!isDuel) return null;
    const lines = config.playerDialogue?.length ? config.playerDialogue : DEFAULT_PLAYER_DIALOGUE;
    return pickRandom(lines);
  };
  const [playerSpeech, setPlayerSpeech] = useState<string | null>(initPlayerLine);
  const [opponentSpeech, setOpponentSpeech] = useState<string | null>(null);

  // Exit after result overlay
  useEffect(() => {
    if (state.phase !== 'win' && state.phase !== 'lose') return;
    const won = state.phase === 'win';
    const timer = setTimeout(() => {
      onExit({
        ...context,
        flags: {
          ...context.flags,
          [`memory_game_result_${config.stageId}`]: won ? 'win' : 'lose',
          [`memory_game_player_pairs_${config.stageId}`]: state.playerPairs,
          [`memory_game_opponent_pairs_${config.stageId}`]: state.opponentPairs,
        },
      });
    }, 2500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // Pick a new dialogue line at each turn start
  useEffect(() => {
    if (!isDuel || state.phase !== 'playing') {
      setOpponentSpeech(null);
      setPlayerSpeech(null);
      return;
    }
    if (state.flipped.length !== 0) return;
    if (state.currentTurn === 'opponent') {
      const lines = config.opponentDialogue?.length ? config.opponentDialogue : DEFAULT_OPPONENT_DIALOGUE;
      setOpponentSpeech(pickRandom(lines));
      setPlayerSpeech(null);
    } else {
      const lines = config.playerDialogue?.length ? config.playerDialogue : DEFAULT_PLAYER_DIALOGUE;
      setPlayerSpeech(pickRandom(lines));
      setOpponentSpeech(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTurn, isDuel, state.phase, state.flipped.length]);

  const selectCard = useCallback((cardId: number) => {
    if (lockRef.current) return;
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const card = prev.cards.find(c => c.id === cardId);
      if (!card) return prev;
      if (prev.matched.includes(card.pairId)) return prev;
      if (prev.flipped.includes(cardId)) return prev;
      if (prev.flipped.length >= 2) return prev;

      const newFlipped = [...prev.flipped, cardId];
      const newSeen = { ...prev.seen, [cardId]: card.pairId };

      if (newFlipped.length < 2) {
        return { ...prev, flipped: newFlipped, seen: newSeen };
      }

      const [id1, id2] = newFlipped;
      const c1 = prev.cards.find(c => c.id === id1)!;
      const c2 = prev.cards.find(c => c.id === id2)!;
      const isMatch = c1.pairId === c2.pairId;
      const newTurns = prev.turns + 1;
      const turnOwner = isDuel ? prev.currentTurn : 'player';

      if (isMatch) {
        const newMatched = [...prev.matched, c1.pairId];
        const playerPairs = prev.playerPairs + (turnOwner === 'player' ? 1 : 0);
        const opponentPairs = prev.opponentPairs + (turnOwner === 'opponent' ? 1 : 0);
        const finished = newMatched.length === pairs;
        const won = isDuel ? playerPairs > opponentPairs : true;
        return {
          ...prev,
          flipped: [],
          matched: newMatched,
          matchedBy: { ...prev.matchedBy, [c1.pairId]: turnOwner },
          seen: newSeen,
          playerPairs,
          opponentPairs,
          turns: newTurns,
          phase: finished ? (won ? 'win' : 'lose') : 'playing',
        };
      }

      return { ...prev, flipped: newFlipped, seen: newSeen, turns: newTurns };
    });
  }, [isDuel, pairs, maxTurns]);

  const handleCardClick = useCallback((cardId: number) => {
    if (isDuel && state.currentTurn !== 'player') return;
    selectCard(cardId);
  }, [isDuel, selectCard, state.currentTurn]);

  // Mismatch flip-back: in useEffect to avoid StrictMode double-timer bug
  useEffect(() => {
    if (state.flipped.length !== 2) return;
    const [id1, id2] = state.flipped;
    const c1 = state.cards.find(c => c.id === id1)!;
    const c2 = state.cards.find(c => c.id === id2)!;
    if (c1.pairId === c2.pairId) return;
    lockRef.current = true;
    const timer = setTimeout(() => {
      setState(s => ({
        ...s,
        flipped: [],
        currentTurn: isDuel
          ? (s.currentTurn === 'player' ? 'opponent' : 'player')
          : s.currentTurn,
        phase: !isDuel && maxTurns > 0 && s.turns >= maxTurns ? 'lose' : s.phase,
      }));
      lockRef.current = false;
    }, 900);
    return () => {
      clearTimeout(timer);
      lockRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.flipped]);

  // Opponent AI
  useEffect(() => {
    if (!isDuel || state.phase !== 'playing' || state.currentTurn !== 'opponent' || lockRef.current) return;
    const delay = state.flipped.length === 0 ? 650 : 820;
    const timer = setTimeout(() => {
      const cardId = pickOpponentCard(state);
      if (cardId !== null) selectCard(cardId);
    }, delay);
    return () => clearTimeout(timer);
  }, [isDuel, selectCard, state]);

  const turnsLeft = maxTurns > 0 ? maxTurns - state.turns : null;
  const turnsWarning = turnsLeft !== null && turnsLeft <= 5;
  const playerFaceSrc = resolveAsset(config.assetsBaseUrl, config.playerFaceImage);
  const opponentFaceSrc = resolveAsset(config.assetsBaseUrl, config.opponentFaceImage);
  const playerName = config.playerName ?? 'こちら';
  const opponentName = config.opponentName ?? '相手';
  const bgImageSrc = resolveAsset(config.assetsBaseUrl, config.backgroundImage);

  const activeSpeech = isDuel
    ? (state.currentTurn === 'player' ? playerSpeech : opponentSpeech)
    : null;
  const activeSpeakerName = isDuel
    ? (state.currentTurn === 'player' ? playerName : opponentName)
    : null;
  const activeSpeakerSide = isDuel
    ? (state.currentTurn === 'player' ? 'left' : 'right') as 'left' | 'right'
    : null;

  return (
    <div style={{
      width: '100vw', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a14', overflow: 'hidden',
    }}>
      <div style={{
        width: W, height: H,
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
        flexShrink: 0,
        transformOrigin: 'center center',
        transform: `scale(${scale})`,
        fontFamily: FONT,
        ...(bgImageSrc
          ? { backgroundImage: `url(${bgImageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'linear-gradient(150deg, #0d0d1a 0%, #0a0a14 60%, #0e0a1c 100%)' }
        ),
      }}>

        {/* Background dim overlay */}
        {bgImageSrc && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(4,4,12,0.56)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Header bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4,
          borderBottom: '1px solid rgba(36,40,68,0.5)',
          background: 'rgba(6,6,20,0.7)',
        }}>
          <span style={{ color: '#c5cae9', fontSize: 15, letterSpacing: '0.14em' }}>
            {config.title ?? '神経衰弱'}
          </span>

          {/* Solo mode counts */}
          {!isDuel && (
            <>
              <span style={{
                position: 'absolute', left: 20,
                color: '#8bc34a', fontSize: 13,
              }}>
                {state.matched.length} / {pairs} ペア
              </span>
              <span style={{
                position: 'absolute', right: 20,
                color: turnsWarning ? '#ef9a9a' : '#4a4d62',
                fontSize: 13,
              }}>
                {maxTurns > 0 ? `残り ${turnsLeft} 手` : `${state.turns} 手`}
              </span>
            </>
          )}
        </div>

        {/* Duel: side character panels */}
        {isDuel && (
          <>
            <SideCharacterPanel
              side="left" name={playerName} faceSrc={playerFaceSrc}
              score={state.playerPairs}
              active={state.currentTurn === 'player' && state.phase === 'playing'}
            />
            <SideCharacterPanel
              side="right" name={opponentName} faceSrc={opponentFaceSrc}
              score={state.opponentPairs}
              active={state.currentTurn === 'opponent' && state.phase === 'playing'}
            />
          </>
        )}

        {/* Card grid */}
        {state.cards.map((card, idx) => {
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          const x = gridX + col * (CARD_W + GAP_X);
          const y = gridY + row * (effectiveCardH + GAP_Y);
          const isFaceUp = state.flipped.includes(card.id) || state.matched.includes(card.pairId);
          const isMatched = state.matched.includes(card.pairId);
          const def = PAIR_DEFS[card.pairId % PAIR_DEFS.length];
          const matchOwner = isMatched ? state.matchedBy[card.pairId] : undefined;
          const matchColor = matchOwner === 'opponent' ? '#80deea' : def.color;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                position: 'absolute',
                left: x, top: y,
                width: CARD_W, height: effectiveCardH,
                borderRadius: 10,
                cursor: isFaceUp || (isDuel && state.currentTurn !== 'player') || lockRef.current
                  ? 'default' : 'pointer',
                background: isFaceUp ? '#141426' : '#0c0c1c',
                border: isMatched
                  ? `2px solid ${matchColor}88`
                  : isFaceUp ? '2px solid #3a3a5a' : '2px solid #1c1c30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isMatched
                  ? `0 0 20px ${matchColor}36, 0 2px 8px rgba(0,0,0,0.55)`
                  : isFaceUp ? '0 4px 14px rgba(0,0,0,0.65)' : '0 2px 6px rgba(0,0,0,0.45)',
                transition: 'background 0.12s, border-color 0.12s, box-shadow 0.2s',
                zIndex: 2,
              }}
            >
              {isFaceUp ? (
                <span style={{
                  fontSize: isDuel ? 44 : 52,
                  color: isMatched ? `${def.color}80` : def.color,
                  lineHeight: 1,
                }}>
                  {def.symbol}
                </span>
              ) : (
                <span style={{ fontSize: 24, color: '#1c1e38' }}>✦</span>
              )}
            </div>
          );
        })}

        {/* Duel: bottom novel-style dialogue box */}
        {isDuel && state.phase === 'playing' && (
          <GameDialogueBox
            speakerName={activeSpeakerName}
            speakerSide={activeSpeakerSide}
            text={activeSpeech}
          />
        )}

        {/* Win overlay */}
        {state.phase === 'win' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 30,
            background: 'rgba(6,6,16,0.90)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 20,
          }}>
            <div style={{
              fontSize: 46, color: '#fff176', letterSpacing: '0.25em',
              textShadow: '0 0 40px rgba(255,241,118,0.45)',
            }}>
              勝　利
            </div>
            <div style={{ fontSize: 16, color: '#c5cae9', letterSpacing: '0.08em' }}>
              {isDuel ? `${state.playerPairs} — ${state.opponentPairs}` : `${state.turns} 手でクリア`}
            </div>
          </div>
        )}

        {/* Lose overlay */}
        {state.phase === 'lose' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 30,
            background: 'rgba(6,6,16,0.90)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 20,
          }}>
            <div style={{
              fontSize: 46, color: '#ef9a9a', letterSpacing: '0.25em',
              textShadow: '0 0 40px rgba(239,154,154,0.35)',
            }}>
              惜　敗
            </div>
            <div style={{ fontSize: 16, color: '#667', letterSpacing: '0.06em' }}>
              {isDuel ? `${state.playerPairs} — ${state.opponentPairs}` : 'もう一度チャレンジしてください'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const MemoryGameEngine: IGameEngine<MemoryGameConfig> = {
  component: MemoryGameComponent,
};
