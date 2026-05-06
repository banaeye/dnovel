import { useState, useRef, useEffect } from 'react';
import type { GameContext, EngineTransition, IGameEngine } from './types';

type TransitionEffect = 'fade' | 'wipe' | 'flash' | 'none';
type TransitionPhase = 'idle' | 'out' | 'in';

const DURATION: Record<TransitionEffect, number> = {
  fade:  400,
  wipe:  350,
  flash: 150,
  none:  0,
};

const KEYFRAMES = `
@keyframes hub-fade-out  { from { opacity: 0 } to { opacity: 1 } }
@keyframes hub-fade-in   { from { opacity: 1 } to { opacity: 0 } }
@keyframes hub-wipe-out  { from { transform: translateX(-100%) } to { transform: translateX(0%) } }
@keyframes hub-wipe-in   { from { transform: translateX(0%)    } to { transform: translateX(100%) } }
@keyframes hub-flash-out { from { opacity: 0 } to { opacity: 1 } }
@keyframes hub-flash-in  { from { opacity: 1 } to { opacity: 0 } }
`;

interface CurrentEngine {
  engineId: string;
  config: unknown;
  returnEngineId?: string;
  returnConfig?: unknown;
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
      };
    } else if (current.returnEngineId) {
      nextEngine = { engineId: current.returnEngineId, config: current.returnConfig };
    }
    if (!nextEngine) return;

    const eff = ((next?.transition ?? defaultTransition) || 'none') as TransitionEffect;
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
  const overlayStyle: React.CSSProperties = overlayActive ? {
    position:   'fixed',
    inset:      0,
    zIndex:     9999,
    pointerEvents: 'all',
    background: effect === 'flash' ? '#fff' : '#000',
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
      <div style={overlayStyle} />
    </>
  );
}
