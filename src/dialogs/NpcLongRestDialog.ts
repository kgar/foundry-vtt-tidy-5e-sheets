import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';

export type LongRestDialogResult = {
  confirmed: boolean;
  newDay?: boolean;
};

declare var Dialog: any;

/**
 * A helper Dialog subclass for completing a long rest.
 *
 * @param {Actor5e} actor           Actor that is taking the long rest.
 * @param {object} [dialogData={}]  An object of dialog data which configures how the modal window is rendered.
 * @param {object} [options={}]     Dialog rendering options.
 */
export default class LongRestDialog extends Dialog {
  constructor(
    actor: Actor5e,
    dialogData: Record<string, any> = {},
    options = {}
  ) {
    super(dialogData, options);
    this.actor = actor;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      template: 'systems/dnd5e/templates/apps/long-rest.hbs',
      classes: ['dnd5e', 'dialog'],
    });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  getData() {
    const data = super.getData();
    const variant = FoundryAdapter.getGameSetting('dnd5e', 'restVariant');
    data.promptNewDay = variant !== 'gritty'; // It's always a new day when resting 1 week
    data.newDay = variant === 'normal'; // It's probably a new day when resting normally (8 hours)
    return data;
  }

  /* -------------------------------------------- */

  /**
   * A helper constructor function which displays the Long Rest confirmation dialog and returns a Promise once it's
   * workflow has been resolved.
   * @param {object} [options={}]
   * @param {Actor5e} [options.actor]  Actor that is taking the long rest.
   * @returns {Promise}                Promise that resolves when the rest is completed or rejects when canceled.
   */
  static async longRestDialog({
    actor,
  }: {
    actor: Actor5e;
  }): Promise<LongRestDialogResult> {
    return new Promise((resolve) => {
      const dlg = new this(actor, {
        title: `${FoundryAdapter.localize('DND5E.LongRest')}: ${actor.name}`,
        buttons: {
          rest: {
            icon: '<i class="fas fa-bed"></i>',
            label: FoundryAdapter.localize('DND5E.Rest'),
            callback: (html: any) => {
              let newDay = true;
              if (
                FoundryAdapter.getGameSetting('dnd5e', 'restVariant') !==
                'gritty'
              ) {
                newDay = html.find('input[name="newDay"]')[0].checked;
              }
              resolve({ confirmed: true, newDay });
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: FoundryAdapter.localize('Cancel'),
            callback: () => resolve({ confirmed: false }),
          },
        },
        default: 'rest',
        close: () => resolve({ confirmed: false }),
      });
      dlg.render(true);
    });
  }
}
