export type FlagValue = boolean | number | string;
export type FlagMap = Record<string, FlagValue>;

export interface FlagDefinition {
  id: string;
  type: 'boolean' | 'integer' | 'string';
  default: FlagValue;
  description: string;
}
