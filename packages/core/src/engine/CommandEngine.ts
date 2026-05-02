import type { GameState, GamePhase, TalkCandidate } from '../types/gameState';
import type { CommandDefinition } from '../types/command';
import type { Scene } from '../types/scene';
import type { LocationDefinition } from '../types/location';
import type { MasterData } from '../loaders/dataLoader';
import { evaluateCondition } from './ConditionEvaluator';

export function getAvailableCommands(
  scene: Scene | undefined,
  location: LocationDefinition | undefined,
  masterData: MasterData,
): CommandDefinition[] {
  const commandIds =
    scene?.commands ?? location?.default_commands ?? Object.keys(masterData.commands);
  return commandIds
    .map((id) => masterData.commands[id])
    .filter((cmd): cmd is CommandDefinition => Boolean(cmd));
}

export interface CommandResult {
  newPhase: GamePhase;
  transitionSceneId?: string;
  talkCandidates?: TalkCandidate[];
}

export function executeCommand(
  commandId: string,
  state: GameState,
  masterData: MasterData,
): CommandResult {
  const command = masterData.commands[commandId];
  if (!command) return { newPhase: state.phase };

  switch (command.action_type) {
    case 'examine':
      return { newPhase: 'examine' };
    case 'move':
      return { newPhase: 'map' };
    case 'inventory':
      return { newPhase: 'inventory' };
    case 'talk': {
      const scene = masterData.scenes[state.currentSceneId];
      const talkable = scene?.talkable ?? [];
      const ctx = { flags: state.flags, inventory: state.inventory, locationId: state.currentLocationId };
      const candidates: TalkCandidate[] = talkable
        .filter((t) => evaluateCondition(t.condition ?? null, ctx))
        .map((t) => ({ characterId: t.character_id, sceneId: t.scene_id }));

      if (candidates.length === 0) return { newPhase: 'command' };
      if (candidates.length === 1) {
        return { newPhase: 'message', transitionSceneId: candidates[0].sceneId };
      }
      return { newPhase: 'talk_select', talkCandidates: candidates };
    }
    case 'system':
      return { newPhase: 'system_menu' };
    default:
      return { newPhase: state.phase };
  }
}
