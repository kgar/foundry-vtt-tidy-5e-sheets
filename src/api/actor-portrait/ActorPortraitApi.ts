import type { PortraitContextMenuCommand as PortraitMenuCommand } from '..';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';

export class ActorPortraitApi {
  registerMenuCommands(commands: PortraitMenuCommand[]) {
    ActorPortraitRuntime.registerMenuCommands([...commands]);
  }
}
