import type { FlagMap } from '../types/flag';
import type { CharacterDisplay } from '../types/scene';

export interface SaveData {
  version: number;
  timestamp: number;
  currentSceneId: string;
  currentLocationId: string;
  flags: FlagMap;
  inventory: string[];
  sceneHistory: string[];
  currentCharacters: CharacterDisplay[];
  playtime: number;
}

export interface GameSettings {
  bgmVolume: number;
  seVolume: number;
  voiceVolume: number;
  textSpeed: number;
  autoMode: boolean;
  fullscreen: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  bgmVolume: 0.4,
  seVolume: 0.8,
  voiceVolume: 0.8,
  textSpeed: 40,
  autoMode: false,
  fullscreen: false,
};

export const SAVE_DATA_VERSION = 1;
export const MAX_SAVE_SLOTS = 3;

export interface IStorage {
  save(slotId: number, data: SaveData): Promise<void>;
  load(slotId: number): Promise<SaveData | null>;
  deleteSave(slotId: number): Promise<void>;
  listSaves(): Promise<Array<{ slotId: number; data: SaveData } | null>>;
  saveSettings(settings: GameSettings): Promise<void>;
  loadSettings(): Promise<GameSettings | null>;
  autoSave(data: SaveData): Promise<void>;
  loadAutoSave(): Promise<SaveData | null>;
}
