import type { FlagMap } from './flag';
import type { CharacterDisplay } from './scene';

export type GamePhase =
  | 'title'
  | 'message'
  | 'choice'
  | 'command'
  | 'map'
  | 'examine'
  | 'inventory'
  | 'system_menu'
  | 'talk_select'
  | 'cg_sequence'
  | 'ending';

export interface TalkCandidate {
  characterId: string;
  sceneId: string;
}

export interface GameState {
  currentSceneId: string;
  currentLocationId: string;
  currentMessageIndex: number;
  flags: FlagMap;
  inventory: string[];
  sceneHistory: string[];
  phase: GamePhase;
  currentCharacters: CharacterDisplay[];
  talkCandidates: TalkCandidate[];
}

