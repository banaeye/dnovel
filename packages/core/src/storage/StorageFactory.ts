import type { IStorage } from './StorageInterface';
import { LocalStorageAdapter } from './LocalStorageAdapter';

export type StorageBackend = 'localStorage' | 'indexeddb' | 'server';

export function createStorage(backend: StorageBackend = 'localStorage'): IStorage {
  switch (backend) {
    case 'localStorage':
    default:
      return new LocalStorageAdapter();
  }
}

let instance: IStorage | null = null;

export function getStorage(): IStorage {
  if (!instance) {
    instance = createStorage();
  }
  return instance;
}
