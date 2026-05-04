import { createStore } from 'zustand';
import type { StoreApi } from 'zustand';
import type { GameState } from '../types/gameState';
import type { MasterData } from '../loaders/dataLoader';
import type { SaveData } from '../storage/StorageInterface';
import { SAVE_DATA_VERSION } from '../storage/StorageInterface';

export interface DebugStartConfig {
  sceneId: string;
  locationId: string;
  flags?: Record<string, boolean | number | string>;
  inventory?: string[];
}

import { initializeFlags } from '../engine/FlagEngine';
import { transitionTo, advanceMessage, selectChoice, pushHistory, completeCgSequence } from '../engine/SceneEngine';
import { executeCommand } from '../engine/CommandEngine';
import { moveTo } from '../engine/LocationEngine';
import { useItem } from '../engine/ItemEngine';
import { evaluateCondition } from '../engine/ConditionEvaluator';

export interface GameStore {
  state: GameState;
  masterData: MasterData;
  chapterId: string;
  playtimeStart: number;

  startNewGame: () => void;
  startDebugGame: (config: DebugStartConfig) => void;
  loadGame: (saveData: SaveData) => void;
  toSaveData: () => SaveData;

  advanceMessage: () => void;
  selectChoice: (index: number) => void;
  executeCommand: (commandId: string) => void;
  selectTalkTarget: (index: number) => void;
  completeCgSequence: () => void;
  moveToLocation: (locationId: string) => void;
  clickArea: (areaId: string) => void;
  useItem: (itemId: string) => void;
  closeOverlay: () => void;
  goToTitle: () => void;
  startFromScene: (
    sceneId: string,
    locationId: string,
    initialFlags?: Record<string, boolean | number | string>,
  ) => void;

  debugSetFlag: (flagId: string, value: boolean | number | string) => void;
  debugSetInventory: (inventory: string[]) => void;
  debugJumpToScene: (sceneId: string, locationId: string) => void;
}

export type GameStoreApi = StoreApi<GameStore>;

export interface GameStoreOptions {
  chapterId?: string;
  initialFlags?: Record<string, boolean | number | string>;
  initialInventory?: string[];
}

function buildInitialState(
  masterData: MasterData,
  initialSceneId: string,
  initialLocationId: string,
  options?: GameStoreOptions,
): GameState {
  const baseFlags = initializeFlags(masterData.flags);
  const flags = options?.initialFlags ? { ...baseFlags, ...options.initialFlags } : baseFlags;
  return {
    currentSceneId: initialSceneId,
    currentLocationId: initialLocationId,
    currentMessageIndex: 0,
    flags,
    inventory: options?.initialInventory ?? [],
    sceneHistory: [],
    phase: 'title',
    currentCharacters: [],
    talkCandidates: [],
  };
}

export function createGameStore(
  masterData: MasterData,
  initialSceneId: string,
  initialLocationId: string,
  options?: GameStoreOptions,
): GameStoreApi {
  const initialState = buildInitialState(masterData, initialSceneId, initialLocationId, options);

  return createStore<GameStore>((set, get) => ({
    state: initialState,
    masterData,
    chapterId: options?.chapterId ?? 'chapter1',
    playtimeStart: Date.now(),

    startNewGame: () => {
      const md = get().masterData;
      const fresh = buildInitialState(md, initialSceneId, initialLocationId, options);
      const started = transitionTo(initialSceneId, { ...fresh, phase: 'message' }, md);
      set({ state: started, playtimeStart: Date.now() });
    },

    startDebugGame: (config: DebugStartConfig) => {
      const md = get().masterData;
      const base = buildInitialState(md, initialSceneId, initialLocationId, options);
      const seed: GameState = {
        ...base,
        currentSceneId: config.sceneId,
        currentLocationId: config.locationId,
        flags: { ...base.flags, ...(config.flags ?? {}) },
        inventory: config.inventory ?? [],
        phase: 'message',
      };
      set({ state: transitionTo(config.sceneId, seed, md), playtimeStart: Date.now() });
    },

    loadGame: (saveData: SaveData) => {
      set({
        state: {
          currentSceneId: saveData.currentSceneId,
          currentLocationId: saveData.currentLocationId,
          currentMessageIndex: 0,
          flags: saveData.flags,
          inventory: saveData.inventory,
          sceneHistory: saveData.sceneHistory,
          phase: 'command',
          currentCharacters: saveData.currentCharacters ?? [],
          talkCandidates: [],
        },
        playtimeStart: Date.now() - saveData.playtime * 1000,
      });
    },

    toSaveData: (): SaveData => {
      const { state, playtimeStart } = get();
      return {
        version: SAVE_DATA_VERSION,
        chapterId: get().chapterId,
        timestamp: Date.now(),
        currentSceneId: state.currentSceneId,
        currentLocationId: state.currentLocationId,
        flags: state.flags,
        inventory: state.inventory,
        sceneHistory: state.sceneHistory,
        currentCharacters: state.currentCharacters,
        playtime: Math.floor((Date.now() - playtimeStart) / 1000),
      };
    },

    advanceMessage: () => {
      const { state, masterData } = get();
      if (state.phase !== 'message') return;
      set({ state: advanceMessage(state, masterData) });
    },

    selectChoice: (index: number) => {
      const { state, masterData } = get();
      if (state.phase !== 'choice') return;
      set({ state: selectChoice(index, state, masterData) });
    },

    executeCommand: (commandId: string) => {
      const { state, masterData } = get();
      if (state.phase !== 'command') return;
      const result = executeCommand(commandId, state, masterData);
      if (result.transitionSceneId) {
        const withHistory = pushHistory(state.currentSceneId, state);
        set({ state: transitionTo(result.transitionSceneId, withHistory, masterData) });
      } else {
        set({ state: { ...state, phase: result.newPhase, talkCandidates: result.talkCandidates ?? [] } });
      }
    },

    selectTalkTarget: (index: number) => {
      const { state, masterData } = get();
      if (state.phase !== 'talk_select') return;
      if (index < 0) {
        set((s) => ({ state: { ...s.state, phase: 'command', talkCandidates: [] } }));
        return;
      }
      const target = state.talkCandidates[index];
      if (!target) return;
      const withHistory = pushHistory(state.currentSceneId, state);
      set({ state: { ...transitionTo(target.sceneId, withHistory, masterData), talkCandidates: [] } });
    },

    completeCgSequence: () => {
      const { state, masterData } = get();
      if (state.phase !== 'cg_sequence') return;
      set({ state: completeCgSequence(state, masterData) });
    },

    moveToLocation: (locationId: string) => {
      const { state, masterData } = get();
      set({ state: moveTo(locationId, state, masterData) });
    },

    clickArea: (areaId: string) => {
      const { state, masterData } = get();
      if (state.phase !== 'examine') return;
      const scene = masterData.scenes[state.currentSceneId];
      const area = scene?.clickable_areas?.find((a) => a.id === areaId);
      if (!area) return;

      const ctx = {
        flags: state.flags,
        inventory: state.inventory,
        locationId: state.currentLocationId,
      };
      if (!evaluateCondition(area.condition, ctx)) return;

      const withHistory = pushHistory(state.currentSceneId, state);
      set({ state: transitionTo(area.next_scene, withHistory, masterData) });
    },

    useItem: (itemId: string) => {
      const { state, masterData } = get();
      const { newState, sceneId } = useItem(itemId, state, masterData);
      if (sceneId) {
        const withHistory = pushHistory(state.currentSceneId, { ...newState, phase: 'command' });
        set({ state: transitionTo(sceneId, withHistory, masterData) });
      } else {
        set({ state: newState });
      }
    },

    closeOverlay: () => {
      set((prev) => ({ state: { ...prev.state, phase: 'command' } }));
    },

    goToTitle: () => {
      set((prev) => ({ state: { ...prev.state, phase: 'title' } }));
    },

    startFromScene: (sceneId: string, locationId: string, initialFlags) => {
      const { state, masterData } = get();
      const seed: GameState = {
        ...buildInitialState(masterData, sceneId, locationId, {}),
        flags: { ...state.flags, ...(initialFlags ?? {}) },
        inventory: state.inventory,
        phase: 'message',
      };
      set({ state: transitionTo(sceneId, seed, masterData), playtimeStart: Date.now() });
    },

    debugSetFlag: (flagId, value) => {
      set(s => ({ state: { ...s.state, flags: { ...s.state.flags, [flagId]: value } } }));
    },

    debugSetInventory: (inventory) => {
      set(s => ({ state: { ...s.state, inventory } }));
    },

    debugJumpToScene: (sceneId, locationId) => {
      const { state, masterData } = get();
      set({ state: transitionTo(sceneId, { ...state, currentLocationId: locationId, phase: 'message' }, masterData) });
    },
  }));
}
