import type { ActorItemSectionFooterCommand } from 'src/api/api.types';
import type {
  RegisteredActorItemSectionFooterCommand,
  RegisteredActorItemSectionFooterCommandEnabledParams,
} from './types';
import type { Actor5e } from 'src/types/types';
import { error } from 'src/utils/logging';

export class ActorItemRuntime {
  private static _actorItemSectionCommands: RegisteredActorItemSectionFooterCommand[] =
    [];

  static registerActorItemSectionCommands(
    commands: ActorItemSectionFooterCommand[]
  ) {
    ActorItemRuntime._actorItemSectionCommands.push(...commands);
  }

  static getActorItemSectionCommands({
    section,
    actor,
  }: RegisteredActorItemSectionFooterCommandEnabledParams): RegisteredActorItemSectionFooterCommand[] {
    return [...ActorItemRuntime._actorItemSectionCommands].filter((c) => {
      try {
        return section && (c.enabled?.({ section, actor }) ?? true);
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
