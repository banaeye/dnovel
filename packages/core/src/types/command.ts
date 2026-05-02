export type CommandActionType =
  | 'examine'
  | 'talk'
  | 'move'
  | 'inventory'
  | 'system';

export interface CommandDefinition {
  id: string;
  label: string;
  icon?: string | null;
  description: string;
  action_type: CommandActionType;
}
