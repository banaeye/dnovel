import type { Condition } from './scene';

export interface LocationConnection {
  location_id: string;
  label: string;
  condition: Condition | null;
}

export interface LocationDefinition {
  id: string;
  name: string;
  description?: string;
  background_default?: string;
  background_night?: string;
  default_commands: string[];
  connections: LocationConnection[];
  entry_scene: string;
}
