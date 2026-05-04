import type { FlagValue } from './flag';

export interface Condition {
  flag?: string;
  value?: FlagValue;
  min?: number;
  max?: number;
  negate?: boolean;
  has_item?: string;
  location_id?: string;
  and?: Condition[];
  or?: Condition[];
}

export interface SceneMessage {
  text: string;
  voice_character_id: string | null;
  voice_style?: string;
  characters?: CharacterDisplay[];
}

export interface CharacterDisplay {
  character_id: string;
  position: 'left' | 'center' | 'right';
  expression: string;
  y_offset?: number;
}

export interface ClickableArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  next_scene: string;
  condition: Condition | null;
}

export interface SceneChoice {
  label: string;
  next_scene: string;
  condition: Condition | null;
}

export interface SceneBranches {
  type: 'choice' | 'auto' | 'none';
  choices?: SceneChoice[];
}

export interface FlagSet {
  flag: string;
  value: FlagValue;
}

export interface CgFrame {
  src: string;
  position: 'left' | 'right' | 'center';
}

export interface ItemGive {
  item_id: string;
  condition: Condition | null;
}

export interface TalkableEntry {
  character_id: string;
  scene_id: string;
  condition?: Condition | null;
}

export interface EngineTransitionSpec {
  id: string;
  config?: unknown;
  return_scene?: string;
  /** 死亡時に遷移するノベルシーン ID */
  gameover_scene?: string;
  /** ボス戦死亡時に遷移するノベルシーン ID */
  gameover_boss_scene?: string;
  /** 死亡直後に戻るノベルシーン ID。省略時は gameover_scene に直接遷移 */
  gameover_landing_scene?: string;
}

export interface Scene {
  id: string;
  location_id?: string;
  background?: string;
  bgm?: string;
  characters?: CharacterDisplay[];
  messages: SceneMessage[];
  commands?: string[];
  clickable_areas?: ClickableArea[];
  talkable?: TalkableEntry[];
  overlay_image?: string;
  branches?: SceneBranches;
  next_scene?: string | null;
  flags_set?: FlagSet[];
  item_give?: ItemGive[];
  item_remove?: string[];
  cg_sequence?: CgFrame[];
  game_end?: boolean;
  next_engine?: EngineTransitionSpec;
}
