import type { ActorItemSectionFooterCommand } from 'src/api/api.types';
import type {
  RegisteredActorItemSectionFooterCommand,
  RegisteredActorItemSectionFooterCommandEnabledParams,
} from './types';
import type { Actor5e } from 'src/types/types';

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
    return [...ActorItemRuntime._actorItemSectionCommands].filter(
      (c) => section && (c.enabled?.({ section, actor }) ?? true)
    );
  }
}
