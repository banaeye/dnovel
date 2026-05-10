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

export interface RawFlag {
  id: string;
  type: 'boolean' | 'integer' | 'string';
  default: boolean | number | string;
  description?: string;
}

export interface SharedFsProps {
  dirHandle: FileSystemDirectoryHandle | null;
  sceneFilename: string;
  sceneFilenames: string[];
  rawScenes: RawScene[];
  rawCharacters: RawCharacter[];
  rawLocations: RawLocation[];
  rawItems: RawItem[];
  rawFlags: RawFlag[];
  error: string | null;
  openDirectory: () => Promise<void>;
  selectSceneFile: (filename: string) => Promise<void>;
  saveScenes: (scenes: RawScene[]) => Promise<void>;
}

const SCENE_FILENAMES = ['scenes_ch1.yaml', 'scenes_ch2.yaml', 'scenes_ch3.yaml', 'scenes_ch4.yaml', 'scenes_ch5.yaml'];

export function useYamlFs() {
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [sceneFilename, setSceneFilename] = useState(SCENE_FILENAMES[0]);
  const [rawScenes, setRawScenes] = useState<RawScene[]>([]);
  const [rawCharacters, setRawCharacters] = useState<RawCharacter[]>([]);
  const [rawLocations, setRawLocations] = useState<RawLocation[]>([]);
  const [rawItems, setRawItems] = useState<RawItem[]>([]);
  const [rawFlags, setRawFlags] = useState<RawFlag[]>([]);
  const [error, setError] = useState<string | null>(null);

  const readYaml = useCallback(async <T,>(handle: FileSystemDirectoryHandle, filename: string): Promise<T> => {
    const fh = await handle.getFileHandle(filename);
    const file = await fh.getFile();
    return yaml.load(await file.text()) as T;
  }, []);

  const loadSceneFile = useCallback(async (handle: FileSystemDirectoryHandle, filename: string) => {
    const scenesData = await readYaml<{ scenes: RawScene[] }>(handle, filename);
    setRawScenes(scenesData.scenes ?? []);
    setSceneFilename(filename);
  }, [readYaml]);

  const openDirectory = useCallback(async () => {
    try {
      const handle = await (window as Window & typeof globalThis & {
        showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
      }).showDirectoryPicker();
      setDirHandle(handle);

      const [charsData, locsData, itemsData, flagsData] = await Promise.all([
        readYaml<{ characters: RawCharacter[] }>(handle, 'characters.yaml'),
        readYaml<{ locations: RawLocation[] }>(handle, 'locations.yaml'),
        readYaml<{ items: RawItem[] }>(handle, 'items.yaml'),
        readYaml<{ flags: RawFlag[] }>(handle, 'flags.yaml'),
      ]);

      await loadSceneFile(handle, sceneFilename);
      setRawCharacters(charsData.characters ?? []);
      setRawLocations(locsData.locations ?? []);
      setRawItems(itemsData.items ?? []);
      setRawFlags(flagsData.flags ?? []);
      setError(null);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    }
  }, [loadSceneFile, readYaml, sceneFilename]);

  const selectSceneFile = useCallback(async (filename: string) => {
    if (!dirHandle) {
      setSceneFilename(filename);
      return;
    }
    try {
      await loadSceneFile(dirHandle, filename);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [dirHandle, loadSceneFile]);

  const saveScenes = useCallback(async (scenes: RawScene[]) => {
    if (!dirHandle) return;
    try {
      const fh = await dirHandle.getFileHandle(sceneFilename, { create: false });
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
  }, [dirHandle, sceneFilename]);

  return {
    dirHandle,
    sceneFilename,
    sceneFilenames: SCENE_FILENAMES,
    rawScenes,
    rawCharacters,
    rawLocations,
    rawItems,
    rawFlags,
    error,
    openDirectory,
    selectSceneFile,
    saveScenes,
  };
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
