import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import type {
  RegisteredPortraitMenuCommand,
  RegisteredPortraitMenuCommandExecuteParams,
} from './types';
import { error } from 'src/utils/logging';

export class ActorPortraitRuntime {
  private static _portraitMenuCommands: RegisteredPortraitMenuCommand[] = [
    {
      label: 'TIDY5E.ShowPortraitArt',
      execute: (params: RegisteredPortraitMenuCommandExecuteParams) => {
        FoundryAdapter.renderImagePopout(params.actor.img, {
          title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
            subject: params.actor.name,
          }),
          shareable: true,
          uuid: params.actor.uuid,
        });
      },
      iconClass: 'fa-solid fa-image fa-fw',
    },
    {
      label: 'TIDY5E.ShowTokenArt',
      execute: async (params: RegisteredPortraitMenuCommandExecuteParams) => {
        // Typically, if this token is on the canvas, then this is the image we want to see.
        let imageSrc = params.actor.token?.texture?.src;

        if (!imageSrc) {
          // Account for the possibility of wildcard tokens.
          let images = (await params.actor.getTokenImages()) as string[];

          imageSrc =
            images.length > 1
              ? // Grab a random wildcard token upon request... for chaos.
                images[Math.floor(Math.random() * images.length)]
              : images[0];
        }

        FoundryAdapter.renderImagePopout(imageSrc, {
          title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
            subject: params.actor.name,
          }),
          shareable: true,
          uuid: params.actor.uuid,
        });
      },
      iconClass: 'fa-regular fa-circle-user fa-fw',
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
