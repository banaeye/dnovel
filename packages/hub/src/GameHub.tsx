import { useState, useRef, useEffect } from 'react';
import type { GameContext, EngineTransition, IGameEngine } from './types';

type TransitionEffect = 'fade' | 'wipe' | 'flash' | 'speedline' | 'rift' | 'none';
type TransitionPhase = 'idle' | 'out' | 'in';

const DURATION: Record<TransitionEffect, number> = {
  fade:  400,
  wipe:  350,
  flash: 150,
  speedline: 720,
  rift: 820,
  none:  0,
};

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
      </div>
    </>
  );
}
