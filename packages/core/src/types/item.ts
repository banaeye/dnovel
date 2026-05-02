import type { Condition } from './scene';

export type ItemCategory = 'key_item' | 'tool' | 'consumable' | 'misc';

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  usable: boolean;
  use_scene?: string | null;
  use_condition?: Condition | null;
  stackable: boolean;
  category: ItemCategory;
}
