import type { GameState, GamePhase } from '../types/gameState';
import type { Scene } from '../types/scene';
import type { MasterData } from '../loaders/dataLoader';
import { applyFlagsSet } from './FlagEngine';
import { tryGiveItems, removeItem } from './ItemEngine';
import { evaluateCondition } from './ConditionEvaluator';

export function transitionTo(
  sceneId: string,
  state: GameState,
  masterData: MasterData,
): GameState {
  const scene = masterData.scenes[sceneId];
  if (!scene) {
    console.warn(`[SceneEngine] Scene not found: ${sceneId}`);
    return state;
  }

  let next: GameState = {
    ...state,
    currentSceneId: sceneId,
    currentMessageIndex: 0,
    phase: 'message',
  };

  if (scene.location_id && scene.location_id !== state.currentLocationId) {
    next = { ...next, currentLocationId: scene.location_id, currentCharacters: [] };
  }

  if (scene.characters !== undefined) {
    next = { ...next, currentCharacters: scene.characters };
  }

  if (scene.messages[0]?.characters !== undefined) {
    next = { ...next, currentCharacters: scene.messages[0].characters };
  }

  next = { ...next, flags: applyFlagsSet(scene.flags_set, next.flags) };
  next = tryGiveItems(scene.item_give, next);
  if (scene.item_remove) {
    for (const itemId of scene.item_remove) next = removeItem(itemId, next);
  }

  if (scene.messages.length === 0) {
    if (scene.game_end) {
      return { ...next, phase: 'ending' };
    }
    if (scene.cg_sequence?.length) {
      return { ...next, phase: 'cg_sequence' };
    }
    return resolveAfterMessages(next, scene, masterData);
  }

  return next;
}

export function advanceMessage(state: GameState, masterData: MasterData): GameState {
  const scene = masterData.scenes[state.currentSceneId];
  if (!scene) return state;

  const nextIndex = state.currentMessageIndex + 1;

  if (nextIndex < scene.messages.length) {
    const nextMsg = scene.messages[nextIndex];
    const newState = { ...state, currentMessageIndex: nextIndex };
    if (nextMsg.characters !== undefined) {
      return { ...newState, currentCharacters: nextMsg.characters };
    }
    return newState;
  }

  return resolveAfterMessages(state, scene, masterData);
}

function resolveAfterMessages(
  state: GameState,
  scene: Scene,
  masterData: MasterData,
): GameState {
  if (scene.game_end) {
    return { ...state, phase: 'ending' };
  }

  const branches = scene.branches;

  if (branches?.type === 'choice' && branches.choices && branches.choices.length > 0) {
    const ctx = {
      flags: state.flags,
      inventory: state.inventory,
      locationId: state.currentLocationId,
    };
    const available = branches.choices.filter((c) => evaluateCondition(c.condition, ctx));
    if (available.length === 1 && available[0].next_scene) {
      return transitionTo(available[0].next_scene, state, masterData);
    }
    return { ...state, phase: 'choice' };
  }

  if (branches?.type === 'auto' && branches.choices) {
    const ctx = {
      flags: state.flags,
      inventory: state.inventory,
      locationId: state.currentLocationId,
    };
    for (const choice of branches.choices) {
      if (evaluateCondition(choice.condition, ctx)) {
        if (choice.next_scene) {
          return transitionTo(choice.next_scene, state, masterData);
        }
        if (choice.next_scene === null) {
          return goBack(state, masterData);
        }
        return toCommandPhase(state, scene, masterData);
      }
    }
    return goBack(state, masterData);
  }

  if (scene.next_scene) {
    return transitionTo(scene.next_scene, state, masterData);
  }

  if (scene.next_scene === null) {
    return goBack(state, masterData);
  }

  return toCommandPhase(state, scene, masterData);
}

export function selectChoice(
  choiceIndex: number,
  state: GameState,
  masterData: MasterData,
): GameState {
  const scene = masterData.scenes[state.currentSceneId];
  if (!scene?.branches?.choices) return state;

  const choice = scene.branches.choices[choiceIndex];
  if (!choice) return state;

  if (choice.next_scene) {
    return transitionTo(choice.next_scene, state, masterData);
  }
  return goBack(state, masterData);
}

function goBack(state: GameState, masterData: MasterData): GameState {
  if (state.sceneHistory.length === 0) {
    return toCommandPhase(state, masterData.scenes[state.currentSceneId], masterData);
  }
  const history = [...state.sceneHistory];
  const prevSceneId = history.pop()!;
  const prevScene = masterData.scenes[prevSceneId];
  const phase: GamePhase = prevScene ? 'command' : 'command';
  return {
    ...state,
    currentSceneId: prevSceneId,
    currentMessageIndex: 0,
    sceneHistory: history,
    phase,
  };
}

function toCommandPhase(
  state: GameState,
  _scene: Scene | undefined,
  _masterData: MasterData,
): GameState {
  return { ...state, phase: 'command' };
}

export function completeCgSequence(state: GameState, masterData: MasterData): GameState {
  const scene = masterData.scenes[state.currentSceneId];
  if (!scene) return state;
  return resolveAfterMessages(state, scene, masterData);
}

export function pushHistory(sceneId: string, state: GameState): GameState {
  return { ...state, sceneHistory: [...state.sceneHistory, sceneId] };
}
