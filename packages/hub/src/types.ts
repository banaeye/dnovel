import type { ComponentType } from 'react';

export interface GameContext {
  flags: Record<string, boolean | number | string>;
  inventory: string[];
  playerStats: Record<string, number>;
}

export interface EngineTransition {
  engineId: string;
  config?: unknown;
  returnEngineId?: string;
  returnConfig?: unknown;
  returnTransition?: string;
  /** 遷移エフェクト: 'fade' | 'wipe' | 'flash' | 'speedline' | 'rift' | 'cardflip' | 'numberstorm' | 'none' */
  transition?: string;
}

export interface EngineProps<TConfig = unknown> {
  context: GameContext;
  config: TConfig;
  onExit: (updatedContext: GameContext, next?: EngineTransition) => void;
}

export interface IGameEngine<TConfig = unknown> {
  component: ComponentType<EngineProps<TConfig>>;
}
