import { useState, useRef, useEffect } from 'react';
import type { GameContext, EngineTransition, IGameEngine } from './types';

type TransitionEffect = 'fade' | 'wipe' | 'flash' | 'speedline' | 'rift' | 'cardflip' | 'numberstorm' | 'timing' | 'none';
type TransitionPhase = 'idle' | 'out' | 'in';

const DURATION: Record<TransitionEffect, number> = {
  fade:  400,
  wipe:  350,
  flash: 150,
  speedline: 720,
  rift: 820,
  cardflip: 680,
  numberstorm: 860,
  timing: 760,
  none:  0,
};

const NUMBER_STORM_DIGITS = [
  { value: '7', left: '8%', top: '14%', size: 66, delay: 0, rotate: -18, color: '#fff2a8' },
  { value: '3', left: '20%', top: '72%', size: 52, delay: 90, rotate: 14, color: '#8be9ff' },
  { value: '+', left: '34%', top: '24%', size: 46, delay: 150, rotate: -9, color: '#ff9fd5' },
  { value: '12', left: '48%', top: '68%', size: 74, delay: 40, rotate: 11, color: '#ffffff' },
  { value: '5', left: '62%', top: '18%', size: 58, delay: 220, rotate: 17, color: '#b6ff8b' },
  { value: '9', left: '78%', top: '58%', size: 68, delay: 120, rotate: -13, color: '#ffd18b' },
  { value: '=', left: '86%', top: '30%', size: 48, delay: 260, rotate: 8, color: '#fff2a8' },
  { value: '21', left: '12%', top: '46%', size: 82, delay: 300, rotate: 10, color: '#ffffff' },
  { value: '4', left: '42%', top: '8%', size: 44, delay: 360, rotate: -16, color: '#8be9ff' },
  { value: '6', left: '70%', top: '78%', size: 50, delay: 430, rotate: 18, color: '#ff9fd5' },
];

const KEYFRAMES = `
@keyframes hub-fade-out  { from { opacity: 0 } to { opacity: 1 } }
@keyframes hub-fade-in   { from { opacity: 1 } to { opacity: 0 } }
@keyframes hub-wipe-out  { from { transform: translateX(-100%) } to { transform: translateX(0%) } }
@keyframes hub-wipe-in   { from { transform: translateX(0%)    } to { transform: translateX(100%) } }
@keyframes hub-flash-out { from { opacity: 0 } to { opacity: 1 } }
@keyframes hub-flash-in  { from { opacity: 1 } to { opacity: 0 } }
@keyframes hub-speedline-out {
  0%   { opacity: 0; transform: scaleX(0.25) skewX(-10deg); filter: brightness(1); }
  45%  { opacity: 1; transform: scaleX(1.15) skewX(-10deg); filter: brightness(1.9); }
  100% { opacity: 1; transform: scaleX(1) skewX(0deg); filter: brightness(1.35); }
}
@keyframes hub-speedline-in {
  0%   { opacity: 1; transform: scaleX(1) skewX(0deg); filter: brightness(1.35); }
  55%  { opacity: 0.82; transform: scaleX(1.2) skewX(10deg); filter: brightness(1.8); }
  100% { opacity: 0; transform: scaleX(0.35) skewX(10deg); filter: brightness(1); }
}
@keyframes hub-rift-out {
  0%   { opacity: 0; transform: scale(1.18) rotate(0deg); filter: blur(0px) brightness(1); }
  40%  { opacity: 1; transform: scale(1.04) rotate(-1deg); filter: blur(2px) brightness(1.4); }
  100% { opacity: 1; transform: scale(0.98) rotate(0deg); filter: blur(0px) brightness(0.78); }
}
@keyframes hub-rift-in {
  0%   { opacity: 1; transform: scale(0.98) rotate(0deg); filter: blur(0px) brightness(0.78); }
  45%  { opacity: 0.85; transform: scale(1.06) rotate(1deg); filter: blur(2px) brightness(1.35); }
  100% { opacity: 0; transform: scale(1.2) rotate(0deg); filter: blur(0px) brightness(1); }
}
@keyframes hub-cardflip-out {
  0%   { opacity: 0; transform: perspective(900px) rotateY(-90deg) scale(0.85); filter: brightness(1); }
  42%  { opacity: 1; transform: perspective(900px) rotateY(8deg) scale(1.02); filter: brightness(1.35); }
  100% { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); filter: brightness(0.9); }
}
@keyframes hub-cardflip-in {
  0%   { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); filter: brightness(0.9); }
  46%  { opacity: 0.9; transform: perspective(900px) rotateY(-10deg) scale(1.02); filter: brightness(1.3); }
  100% { opacity: 0; transform: perspective(900px) rotateY(90deg) scale(0.85); filter: brightness(1); }
}
@keyframes hub-numberstorm-out {
  0%   { opacity: 0; transform: scale(0.92) rotate(-2deg); filter: brightness(1); }
  35%  { opacity: 1; transform: scale(1.04) rotate(1deg); filter: brightness(1.35); }
  100% { opacity: 1; transform: scale(1.01) rotate(0deg); filter: brightness(1.12); }
}
@keyframes hub-numberstorm-in {
  0%   { opacity: 1; transform: scale(1.01) rotate(0deg); filter: brightness(1.12); }
  45%  { opacity: 0.86; transform: scale(1.05) rotate(-1deg); filter: brightness(1.25); }
  100% { opacity: 0; transform: scale(1.16) rotate(2deg); filter: brightness(1); }
}
@keyframes hub-number-fly {
  0%   { opacity: 0; transform: translate3d(-42vw, 22vh, 0) rotate(-28deg) scale(0.35); }
  18%  { opacity: 1; }
  55%  { opacity: 1; transform: translate3d(0, 0, 0) rotate(0deg) scale(1.08); }
  100% { opacity: 0; transform: translate3d(38vw, -24vh, 0) rotate(30deg) scale(0.62); }
}
@keyframes hub-number-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.84; }
  50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}
@keyframes hub-timing-out {
  0%   { opacity: 0; transform: scale(1.12); filter: brightness(1); }
  42%  { opacity: 1; transform: scale(1.02); filter: brightness(1.55); }
  100% { opacity: 1; transform: scale(1); filter: brightness(0.88); }
}
@keyframes hub-timing-in {
  0%   { opacity: 1; transform: scale(1); filter: brightness(0.88); }
  48%  { opacity: 0.88; transform: scale(1.05); filter: brightness(1.45); }
  100% { opacity: 0; transform: scale(1.16); filter: brightness(1); }
}
@keyframes hub-timing-sweep {
  0%   { transform: translateX(-58vw); opacity: 0; }
  14%  { opacity: 1; }
  100% { transform: translateX(58vw); opacity: 0; }
}
@keyframes hub-timing-ring {
  0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.66; }
  50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}
`;

interface CurrentEngine {
  engineId: string;
  config: unknown;
  returnEngineId?: string;
  returnConfig?: unknown;
  returnTransition?: string;
}

interface GameHubProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  engines: Record<string, IGameEngine<any>>;
  initial: { engineId: string; config: unknown };
  initialContext: GameContext;
  /** エンジン遷移時のデフォルトエフェクト（YAML の transition: で上書き可） */
  defaultTransition?: TransitionEffect;
}

export function GameHub({ engines, initial, initialContext, defaultTransition = 'none' }: GameHubProps) {
  const [context, setContext]   = useState<GameContext>(initialContext);
  const [current, setCurrent]   = useState<CurrentEngine>(initial);
  const [phase,   setPhase]     = useState<TransitionPhase>('idle');
  const [effect,  setEffect]    = useState<TransitionEffect>('none');
  const pendingRef = useRef<{ updated: GameContext; next: CurrentEngine } | null>(null);

  function handleExit(updated: GameContext, next?: EngineTransition) {
    let nextEngine: CurrentEngine | null = null;
    if (next) {
      nextEngine = {
        engineId:       next.engineId,
        config:         next.config,
        returnEngineId: next.returnEngineId,
        returnConfig:   next.returnConfig,
        returnTransition: next.returnTransition,
      };
    } else if (current.returnEngineId) {
      nextEngine = { engineId: current.returnEngineId, config: current.returnConfig };
    }
    if (!nextEngine) return;

    const eff = ((next ? next.transition : current.returnTransition) ?? defaultTransition ?? 'none') as TransitionEffect;
    if (eff === 'none' || !(eff in DURATION)) {
      setContext(updated);
      setCurrent(nextEngine);
      return;
    }

    pendingRef.current = { updated, next: nextEngine };
    setEffect(eff);
    setPhase('out');
  }

  // アウト完了後: エンジン切り替え → インフェーズへ
  useEffect(() => {
    if (phase !== 'out') return;
    const t = setTimeout(() => {
      if (pendingRef.current) {
        setContext(pendingRef.current.updated);
        setCurrent(pendingRef.current.next);
        pendingRef.current = null;
      }
      setPhase('in');
    }, DURATION[effect]);
    return () => clearTimeout(t);
  }, [phase, effect]);

  // イン完了後: アイドルへ
  useEffect(() => {
    if (phase !== 'in') return;
    const t = setTimeout(() => setPhase('idle'), DURATION[effect]);
    return () => clearTimeout(t);
  }, [phase, effect]);

  const engine = engines[current.engineId];
  if (!engine) {
    return <div style={{ padding: 24, color: 'red' }}>Engine not found: {current.engineId}</div>;
  }
  const EngineComponent = engine.component;

  const overlayActive = phase !== 'idle';
  const overlayBackground = effect === 'flash'
    ? '#fff'
    : effect === 'speedline'
      ? [
          'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0 5%, rgba(255,210,90,0.78) 9%, rgba(255,120,70,0.38) 18%, rgba(0,0,0,0.92) 58%)',
          'repeating-linear-gradient(100deg, rgba(255,255,255,0.95) 0 8px, rgba(255,210,90,0.35) 8px 14px, rgba(0,0,0,0) 14px 34px)',
          '#050505',
        ].join(', ')
      : effect === 'rift'
        ? [
            'radial-gradient(circle at 50% 50%, rgba(190,120,255,0.95) 0 4%, rgba(80,20,120,0.82) 13%, rgba(12,2,24,0.98) 54%, #000 100%)',
            'repeating-conic-gradient(from 0deg, rgba(210,170,255,0.24) 0deg 7deg, rgba(0,0,0,0) 7deg 18deg)',
            '#000',
          ].join(', ')
        : effect === 'cardflip'
          ? [
              'radial-gradient(circle at 50% 50%, rgba(255,245,210,0.9) 0 8%, rgba(110,45,80,0.84) 34%, rgba(12,8,22,0.98) 74%)',
              'linear-gradient(90deg, rgba(255,255,255,0.20) 0 1px, transparent 1px 80px)',
              'linear-gradient(0deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 112px)',
              '#0d0712',
            ].join(', ')
          : effect === 'numberstorm'
            ? [
                'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.98) 0 6%, rgba(255,230,92,0.74) 14%, rgba(25,190,220,0.38) 33%, rgba(21,24,60,0.96) 72%)',
                'repeating-linear-gradient(24deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 28px)',
                'repeating-linear-gradient(116deg, rgba(255,223,92,0.17) 0 2px, transparent 2px 34px)',
                '#11183c',
              ].join(', ')
            : effect === 'timing'
              ? [
                  'radial-gradient(circle at 50% 50%, rgba(255,246,160,0.95) 0 5%, rgba(255,80,124,0.58) 16%, rgba(18,12,32,0.96) 68%, #05050a 100%)',
                  'repeating-linear-gradient(90deg, rgba(255,235,120,0.28) 0 3px, transparent 3px 54px)',
                  'repeating-linear-gradient(0deg, rgba(255,95,135,0.16) 0 2px, transparent 2px 42px)',
                ].join(', ')
      : '#000';

  const overlayStyle: React.CSSProperties = overlayActive ? {
    position:   'fixed',
    inset:      0,
    zIndex:     9999,
    pointerEvents: 'all',
    background: overlayBackground,
    backgroundSize: effect === 'speedline'
      ? '100% 100%, 220px 100%, 100% 100%'
      : effect === 'rift'
        ? '100% 100%, 180px 180px, 100% 100%'
        : effect === 'cardflip'
          ? '100% 100%, 80px 100%, 100% 112px, 100% 100%'
          : effect === 'numberstorm'
            ? '100% 100%, 120px 120px, 150px 150px, 100% 100%'
            : effect === 'timing'
              ? '100% 100%, 54px 100%, 100% 42px'
        : undefined,
    animation:  `hub-${effect}-${phase} ${DURATION[effect]}ms ease forwards`,
  } : {
    position:      'fixed',
    inset:         0,
    zIndex:        9999,
    pointerEvents: 'none',
    opacity:       0,
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <EngineComponent
        context={context}
        config={current.config}
        onExit={handleExit}
      />
      <div style={overlayStyle}>
        {overlayActive && effect === 'speedline' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff7c8',
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 96,
              letterSpacing: 0,
              textShadow: '0 0 18px rgba(255,118,54,0.95), 0 8px 0 rgba(0,0,0,0.55)',
              transform: phase === 'out' ? 'rotate(-5deg) scale(1.08)' : 'rotate(5deg) scale(0.96)',
            }}
          >
            RUN!
          </div>
        )}
        {overlayActive && effect === 'cardflip' && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 190,
              height: 260,
              borderRadius: 8,
              border: '2px solid rgba(255,245,210,0.95)',
              background: 'linear-gradient(145deg, rgba(255,245,210,0.96), rgba(170,80,130,0.92))',
              boxShadow: '0 0 30px rgba(255,230,160,0.8), inset 0 0 0 10px rgba(70,22,48,0.32)',
              transform: `translate(-50%, -50%) ${phase === 'out' ? 'rotate(-4deg)' : 'rotate(4deg)'}`,
            }}
          />
        )}
        {overlayActive && effect === 'numberstorm' && (
          <>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 210,
                height: 210,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.96) 0 18%, rgba(255,222,82,0.84) 31%, rgba(34,206,230,0.22) 56%, transparent 70%)',
                boxShadow: '0 0 34px rgba(255,234,94,0.85), 0 0 72px rgba(73,220,255,0.48)',
                animation: 'hub-number-pulse 520ms ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#162057',
                fontFamily: "'Arial Black', 'Impact', sans-serif",
                fontSize: 64,
                letterSpacing: 0,
                textShadow: '0 2px 0 rgba(255,255,255,0.8), 0 0 16px rgba(255,241,124,0.9)',
              }}
            >
              COUNT!
            </div>
            {NUMBER_STORM_DIGITS.map((digit, index) => (
              <span
                key={`${digit.value}-${index}`}
                style={{
                  position: 'absolute',
                  left: digit.left,
                  top: digit.top,
                  color: digit.color,
                  fontFamily: "'Arial Black', 'Impact', sans-serif",
                  fontSize: digit.size,
                  lineHeight: 1,
                  letterSpacing: 0,
                  textShadow: '0 0 16px rgba(255,255,255,0.92), 0 5px 0 rgba(7,11,34,0.42)',
                  transform: `rotate(${digit.rotate}deg)`,
                  animation: `hub-number-fly 620ms cubic-bezier(0.2, 0.9, 0.2, 1) ${digit.delay}ms both`,
                }}
              >
                {digit.value}
              </span>
            ))}
          </>
        )}
        {overlayActive && effect === 'timing' && (
          <>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 260,
                height: 260,
                borderRadius: '50%',
                border: '5px solid rgba(255,232,112,0.86)',
                boxShadow: '0 0 28px rgba(255,232,112,0.86), inset 0 0 48px rgba(255,88,132,0.38)',
                animation: 'hub-timing-ring 420ms ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 16,
                height: 330,
                marginLeft: -8,
                marginTop: -165,
                borderRadius: 999,
                background: '#ff5f87',
                boxShadow: '0 0 20px rgba(255,95,135,0.95)',
                transformOrigin: '50% 50%',
                transform: `rotate(${phase === 'out' ? -36 : 36}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 560,
                height: 14,
                marginLeft: -280,
                marginTop: -7,
                borderRadius: 999,
                background: 'linear-gradient(90deg, transparent, rgba(255,244,172,0.95), transparent)',
                animation: 'hub-timing-sweep 620ms cubic-bezier(0.2, 0.9, 0.2, 1) infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff6b0',
                fontFamily: "'Arial Black', 'Impact', sans-serif",
                fontSize: 70,
                letterSpacing: 0,
                textShadow: '0 0 18px rgba(255,232,112,0.95), 0 7px 0 rgba(0,0,0,0.42)',
              }}
            >
              TIMING!
            </div>
          </>
        )}
      </div>
    </>
  );
}
