import { useState } from 'react';
import type { GameContext, EngineTransition, IGameEngine } from './types';

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
}

export function GameHub({ engines, initial, initialContext }: GameHubProps) {
  const [context, setContext] = useState<GameContext>(initialContext);
  const [current, setCurrent] = useState<CurrentEngine>(initial);

  function handleExit(updated: GameContext, next?: EngineTransition) {
    setContext(updated);
    if (next) {
      setCurrent({
        engineId: next.engineId,
        config: next.config,
        returnEngineId: next.returnEngineId,
        returnConfig: next.returnConfig,
      });
    } else if (current.returnEngineId) {
      setCurrent({ engineId: current.returnEngineId, config: current.returnConfig });
    }
  }

  const engine = engines[current.engineId];
  if (!engine) {
    return <div style={{ padding: 24, color: 'red' }}>Engine not found: {current.engineId}</div>;
  }
  const EngineComponent = engine.component;

  return (
    <EngineComponent
      context={context}
      config={current.config}
      onExit={handleExit}
    />
  );
}
