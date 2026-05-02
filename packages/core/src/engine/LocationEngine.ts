import type { GameState } from '../types/gameState';
import type { LocationConnection } from '../types/location';
import type { MasterData } from '../loaders/dataLoader';
import { evaluateCondition } from './ConditionEvaluator';
import { transitionTo } from './SceneEngine';

export function getAvailableConnections(
  locationId: string,
  state: GameState,
  masterData: MasterData,
): LocationConnection[] {
  const location = masterData.locations[locationId];
  if (!location) return [];

  const ctx = {
    flags: state.flags,
    inventory: state.inventory,
    locationId,
  };

  return location.connections.filter((conn) => evaluateCondition(conn.condition, ctx));
}

export function moveTo(
  targetLocationId: string,
  state: GameState,
  masterData: MasterData,
): GameState {
  const location = masterData.locations[targetLocationId];
  if (!location) return state;

  const nextState: GameState = {
    ...state,
    currentLocationId: targetLocationId,
    currentCharacters: [],
    sceneHistory: [],
    phase: 'message',
  };

  return transitionTo(location.entry_scene, nextState, masterData);
}
