import { create } from 'zustand';
import type { GameSettings } from '../storage/StorageInterface';
import { DEFAULT_SETTINGS } from '../storage/StorageInterface';
import { getStorage } from '../storage/StorageFactory';
import { audioManager } from '../audio/AudioManager';

interface AudioStore {
  settings: GameSettings;
  updateSettings: (partial: Partial<GameSettings>) => void;
  loadSettings: () => Promise<void>;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  updateSettings: (partial) => {
    const next = { ...get().settings, ...partial };
    set({ settings: next });
    if (partial.bgmVolume !== undefined) {
      audioManager.setBgmVolume(partial.bgmVolume);
    }
    getStorage().saveSettings(next).catch(() => {});
  },

  loadSettings: async () => {
    const saved = await getStorage().loadSettings().catch(() => null);
    if (saved) {
      set({ settings: { ...DEFAULT_SETTINGS, ...saved } });
      audioManager.setBgmVolume(saved.bgmVolume ?? DEFAULT_SETTINGS.bgmVolume);
    }
  },
}));
