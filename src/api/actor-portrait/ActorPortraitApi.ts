import type { PortraitContextMenuCommand } from '..';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';

export class ActorPortraitApi {
  registerContextMenuCommands(commands: PortraitContextMenuCommand[]) {
    ActorPortraitRuntime.registerPortraitContextMenuCommands([...commands]);
  }
}
