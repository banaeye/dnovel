import type { VoiceDictionary, VoiceDictionaryEntry } from '../types/voice';

function compareBySpecificity(a: VoiceDictionaryEntry, b: VoiceDictionaryEntry): number {
  return b.from.length - a.from.length;
}

export function applyVoiceDictionary(text: string, dictionary?: VoiceDictionary): string {
  if (!dictionary?.entries?.length) return text;

  return [...dictionary.entries]
    .filter((entry) => entry.from.length > 0)
    .sort(compareBySpecificity)
    .reduce((current, entry) => {
      if (entry.match === 'exact') return current === entry.from ? entry.to : current;
      return current.split(entry.from).join(entry.to);
    }, text);
}

