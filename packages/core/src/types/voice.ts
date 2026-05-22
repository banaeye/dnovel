export interface VoiceDictionaryEntry {
  from: string;
  to: string;
  match?: 'contains' | 'exact';
}

export interface VoiceDictionary {
  entries: VoiceDictionaryEntry[];
}

