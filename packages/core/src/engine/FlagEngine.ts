import type { FlagDefinition, FlagMap, FlagValue } from '../types/flag';
import type { FlagSet } from '../types/scene';

export function initializeFlags(flagDefs: FlagDefinition[]): FlagMap {
  return Object.fromEntries(flagDefs.map((def) => [def.id, def.default]));
}

export function applyFlagsSet(flagsSet: FlagSet[] | undefined, flags: FlagMap): FlagMap {
  if (!flagsSet || flagsSet.length === 0) return flags;
  const next = { ...flags };
  for (const { flag, value } of flagsSet) {
    next[flag] = value;
  }
  return next;
}

export function setFlag(id: string, value: FlagValue, flags: FlagMap): FlagMap {
  return { ...flags, [id]: value };
}

export function getFlag(id: string, flags: FlagMap): FlagValue {
  return flags[id];
}
