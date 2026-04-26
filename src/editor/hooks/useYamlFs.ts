import { useState, useCallback } from 'react';
import * as yaml from 'js-yaml';

export interface RawScene {
  id: string;
  location_id?: string;
  background?: string;
  bgm?: string;
  overlay_image?: string;
  messages?: RawMessage[];
  characters?: RawCharacterDisplay[];
  commands?: string[];
  clickable_areas?: RawArea[];
  branches?: RawBranches;
  next_scene?: string | null;
  flags_set?: RawFlagSet[];
  item_give?: RawItemGive[];
  item_remove?: string[];
  child_scenes?: RawScene[];
  [key: string]: unknown;
}

export interface RawMessage {
  text: string;
  voice_character_id: string | null;
  voice_style?: string;
  characters?: RawCharacterDisplay[];
}

export interface RawCharacterDisplay {
  character_id: string;
  position: 'left' | 'center' | 'right';
  expression: string;
}

export interface RawArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  next_scene: string | null;
  condition: unknown;
}

export interface RawChoice {
  label: string;
  condition: unknown;
  next_scene: string | null;
}

export interface RawBranches {
  type: 'choice' | 'auto' | 'none';
  choices?: RawChoice[];
}

export interface RawFlagSet {
  flag: string;
  value: boolean | number | string;
}

export interface RawItemGive {
  item_id: string;
  condition: unknown | null;
}

export interface RawCharacter {
  id: string;
  name: string;
}

export interface RawLocation {
  id: string;
  name: string;
}

export interface RawItem {
  id: string;
  name: string;
}

export function useYamlFs() {
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [rawScenes, setRawScenes] = useState<RawScene[]>([]);
  const [rawCharacters, setRawCharacters] = useState<RawCharacter[]>([]);
  const [rawLocations, setRawLocations] = useState<RawLocation[]>([]);
  const [rawItems, setRawItems] = useState<RawItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const openDirectory = useCallback(async () => {
    try {
      const handle = await (window as Window & typeof globalThis & {
        showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
      }).showDirectoryPicker();
      setDirHandle(handle);

      async function readYaml<T>(filename: string): Promise<T> {
        const fh = await handle.getFileHandle(filename);
        const file = await fh.getFile();
        return yaml.load(await file.text()) as T;
      }

      const [scenesData, charsData, locsData, itemsData] = await Promise.all([
        readYaml<{ scenes: RawScene[] }>('scenes.yaml'),
        readYaml<{ characters: RawCharacter[] }>('characters.yaml'),
        readYaml<{ locations: RawLocation[] }>('locations.yaml'),
        readYaml<{ items: RawItem[] }>('items.yaml'),
      ]);

      setRawScenes(scenesData.scenes ?? []);
      setRawCharacters(charsData.characters ?? []);
      setRawLocations(locsData.locations ?? []);
      setRawItems(itemsData.items ?? []);
      setError(null);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    }
  }, []);

  const saveScenes = useCallback(async (scenes: RawScene[]) => {
    if (!dirHandle) return;
    try {
      const fh = await dirHandle.getFileHandle('scenes.yaml', { create: false });
      const writable = await (fh as FileSystemFileHandle & {
        createWritable: () => Promise<FileSystemWritableFileStream>;
      }).createWritable();
      await writable.write(yaml.dump({ scenes }, { lineWidth: 120, noRefs: true, quotingType: '"' }));
      await writable.close();
      setRawScenes(scenes);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [dirHandle]);

  return { dirHandle, rawScenes, rawCharacters, rawLocations, rawItems, error, openDirectory, saveScenes };
}

export function findScene(rawScenes: RawScene[], id: string): RawScene | null {
  for (const s of rawScenes) {
    if (s.id === id) return s;
    if (s.child_scenes) {
      const found = findScene(s.child_scenes, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateSceneInTree(rawScenes: RawScene[], updated: RawScene, originalId?: string): RawScene[] {
  const lookupId = originalId ?? updated.id;
  return rawScenes.map((s) => {
    if (s.id === lookupId) return updated;
    if (s.child_scenes) return { ...s, child_scenes: updateSceneInTree(s.child_scenes, updated, lookupId) };
    return s;
  });
}

export function addSceneToTree(rawScenes: RawScene[], newScene: RawScene, parentId: string | null): RawScene[] {
  if (!parentId) return [...rawScenes, newScene];
  return rawScenes.map((s) => {
    if (s.id === parentId) return { ...s, child_scenes: [...(s.child_scenes ?? []), newScene] };
    if (s.child_scenes) return { ...s, child_scenes: addSceneToTree(s.child_scenes, newScene, parentId) };
    return s;
  });
}

export function collectAllSceneIds(rawScenes: RawScene[]): string[] {
  const ids: string[] = [];
  function walk(scenes: RawScene[]) {
    for (const s of scenes) {
      if (s.id) ids.push(s.id);
      if (s.child_scenes) walk(s.child_scenes);
    }
  }
  walk(rawScenes);
  return ids;
}
