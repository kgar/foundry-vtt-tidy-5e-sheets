import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import type { RegisteredPortraitMenuCommand, RegisteredPortraitMenuCommandExecuteParams } from './types';
import { error } from 'src/utils/logging';

export class ActorPortraitRuntime {
  private static _portraitMenuCommands: RegisteredPortraitMenuCommand[] = [
    {
      label: 'T5EK.ShowPortraitArt',
      execute: (params: RegisteredPortraitMenuCommandExecuteParams) => {
        FoundryAdapter.renderImagePopout(params.actor.img, {
          title: 'Portrait: ' + params.actor.name,
          shareable: true,
          uuid: params.actor.uuid,
        }).render(true);
      },
    },
    {
      label: 'T5EK.ShowTokenArt',
      execute: (params: RegisteredPortraitMenuCommandExecuteParams) => {
        FoundryAdapter.renderImagePopout(params.actor.prototypeToken.texture.src, {
          title: 'Portrait: ' + params.actor.name,
          shareable: true,
          uuid: params.actor.uuid,
        }).render(true);
      },
    },
  ];

  static registerMenuCommands(commands: RegisteredPortraitMenuCommand[]) {
    ActorPortraitRuntime._portraitMenuCommands.push(...commands);
  }

  static getEnabledPortraitMenuCommands(actor: Actor5e) {
    return ActorPortraitRuntime._portraitMenuCommands.filter((c) => {
      try {
        return c.enabled?.({ actor }) ?? true;
      } catch (e) {
        error(
          'Failed to check if actor portrait menu command is enabled',
          false,
          { error: e, actor }
        );
        return false;
      }
    });
  }
}
