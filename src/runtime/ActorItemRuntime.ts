import type { ActorItemSectionCommand } from 'src/api/api.types';
import type {
  RegisteredActorItemSectionCommand,
  RegisteredActorItemSectionCommandEnabledParams,
} from './types';
import type { Actor5e } from 'src/types/types';
import { error } from 'src/utils/logging';

export class ActorItemRuntime {
  private static _actorItemSectionCommands: RegisteredActorItemSectionCommand[] =
    [];

  static registerActorItemSectionCommands(commands: ActorItemSectionCommand[]) {
    ActorItemRuntime._actorItemSectionCommands.push(...commands);
  }

  static getActorItemSectionCommands({
    section,
    actor,
    unlocked,
  }: RegisteredActorItemSectionCommandEnabledParams): RegisteredActorItemSectionCommand[] {
    return [...ActorItemRuntime._actorItemSectionCommands].filter((c) => {
      try {
        return section && (c.enabled?.({ section, actor, unlocked }) ?? true);
      } catch (e) {
        error(
          'Failed to check if actor item section command is enabled',
          false,
          { error: e, actor, section }
        );
        return false;
      }
    });
  }
}
