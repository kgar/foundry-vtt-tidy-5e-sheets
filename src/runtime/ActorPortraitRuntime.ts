import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import type { RegisteredPortraitContextMenuCommand } from './types';

export class ActorPortraitRuntime {
  private static _portraitContextMenuCommands: RegisteredPortraitContextMenuCommand[] =
    [
      {
        label: 'T5EK.ShowPortraitArt',
        execute: (actor: any) => {
          FoundryAdapter.renderImagePopout(actor.img, {
            title: 'Portrait: ' + actor.name,
            shareable: true,
            uuid: actor.uuid,
          }).render(true);
        },
      },
      {
        label: 'T5EK.ShowTokenArt',
        execute: (actor: any) => {
          FoundryAdapter.renderImagePopout(actor.prototypeToken.texture.src, {
            title: 'Portrait: ' + actor.name,
            shareable: true,
            uuid: actor.uuid,
          }).render(true);
        },
      },
    ];

  static registerPortraitContextMenuCommands(
    commands: RegisteredPortraitContextMenuCommand[]
  ) {
    ActorPortraitRuntime._portraitContextMenuCommands.push(...commands);
  }

  static getEnabledPortraitContextMenuCommands(actor: Actor5e) {
    return ActorPortraitRuntime._portraitContextMenuCommands.filter(
      (c) => c.enabled?.(actor) ?? true
    );
  }
}
