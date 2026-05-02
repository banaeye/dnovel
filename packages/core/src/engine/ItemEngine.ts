import type { GameState } from '../types/gameState';
import type { ItemGive } from '../types/scene';
import type { MasterData } from '../loaders/dataLoader';
import { evaluateCondition } from './ConditionEvaluator';

export function tryGiveItems(
  itemGive: ItemGive[] | undefined,
  state: GameState,
): GameState {
  if (!itemGive || itemGive.length === 0) return state;

  const ctx = {
    flags: state.flags,
    inventory: state.inventory,
    locationId: state.currentLocationId,
  };

  let inventory = [...state.inventory];
  for (const give of itemGive) {
    if (evaluateCondition(give.condition, ctx)) {
      if (!inventory.includes(give.item_id)) {
        inventory = [...inventory, give.item_id];
      }
    }
  }

  return { ...state, inventory };
}

export function removeItem(itemId: string, state: GameState): GameState {
  return {
    ...state,
    inventory: state.inventory.filter((id) => id !== itemId),
  };
}

export function canUseItem(itemId: string, state: GameState, masterData: MasterData): boolean {
  const item = masterData.items[itemId];
  if (!item || !item.usable) return false;

  const ctx = {
    flags: state.flags,
    inventory: state.inventory,
    locationId: state.currentLocationId,
  };

  return evaluateCondition(item.use_condition, ctx);
}

export function useItem(
  itemId: string,
  state: GameState,
  masterData: MasterData,
): { newState: GameState; sceneId: string | null } {
  const item = masterData.items[itemId];
  if (!item || !item.usable) return { newState: state, sceneId: null };

  let newState = state;
  if (!item.stackable) {
    newState = removeItem(itemId, state);
  }

  return { newState, sceneId: item.use_scene ?? null };
}
