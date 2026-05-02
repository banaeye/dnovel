import type { IStorage, SaveData, GameSettings } from './StorageInterface';
import { SAVE_DATA_VERSION, MAX_SAVE_SLOTS } from './StorageInterface';

export class LocalStorageAdapter implements IStorage {
  private readonly prefix = 'novel_';

  private key(suffix: string): string {
    return `${this.prefix}${suffix}`;
  }

  private setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn('[LocalStorage] Failed to save:', key);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async save(slotId: number, data: SaveData): Promise<void> {
    this.setItem(this.key(`save_${slotId}`), data);
  }

  async load(slotId: number): Promise<SaveData | null> {
    const data = this.getItem<SaveData>(this.key(`save_${slotId}`));
    if (!data) return null;
    if (data.version !== SAVE_DATA_VERSION) return null;
    return data;
  }

  async deleteSave(slotId: number): Promise<void> {
    localStorage.removeItem(this.key(`save_${slotId}`));
  }

  async listSaves(): Promise<Array<{ slotId: number; data: SaveData } | null>> {
    return Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => {
      const data = this.getItem<SaveData>(this.key(`save_${i + 1}`));
      if (!data || data.version !== SAVE_DATA_VERSION) return null;
      return { slotId: i + 1, data };
    });
  }

  async saveSettings(settings: GameSettings): Promise<void> {
    this.setItem(this.key('settings'), settings);
  }

  async loadSettings(): Promise<GameSettings | null> {
    return this.getItem<GameSettings>(this.key('settings'));
  }

  async autoSave(data: SaveData): Promise<void> {
    this.setItem(this.key('autosave'), data);
  }

  async loadAutoSave(): Promise<SaveData | null> {
    const data = this.getItem<SaveData>(this.key('autosave'));
    if (!data || data.version !== SAVE_DATA_VERSION) return null;
    return data;
  }
}
