import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import type { GameStoreApi } from '../store/gameStore';

export const GameStoreContext = createContext<GameStoreApi | null>(null);

// Drop-in replacement for the old useGameStore hook.
// Components call this exactly as before — no changes needed there.
export function useGameStore() {
  const store = useContext(GameStoreContext);
  if (!store) throw new Error('useGameStore must be used within a GameStoreContext.Provider');
  return useStore(store);
}
