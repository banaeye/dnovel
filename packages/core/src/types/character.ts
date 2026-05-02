export interface CharacterSprites {
  normal: string;
  [expression: string]: string;
}

export interface CharacterDefinition {
  id: string;
  name: string;
  name_flag?: string | null;
  voicevox_speaker_id?: number | null;
  y_offset?: number;
  sprites?: CharacterSprites;
}
