import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { isLessThanOneIsOne } from 'src/utils/numbers';

export type ShortRestDialogResult = {
  confirmed: boolean;
  newDay?: boolean;
};

/**
 * A helper Dialog subclass for rolling Hit Dice on short rest.
 *
 * @param {Actor5e} actor           Actor that is taking the short rest.
 * @param {object} [dialogData={}]  An object of dialog data which configures how the modal window is rendered.
 * @param {object} [options={}]     Dialog rendering options.
 */
export default class NpcShortRestDialog extends Dialog {
  constructor(actor: any, dialogData: any = {}, options: any = {}) {
    super(dialogData, options);
    this.actor = actor;
    this._denom = null;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      template: 'systems/dnd5e/templates/apps/short-rest.hbs',
      classes: ['dnd5e', 'dialog'],
    });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  getData() {
    const data = super.getData();

    // Determine Hit Dice
    const hd: Record<string, any> = {};
    const hitDice = isLessThanOneIsOne(this.actor.system.details.cr) + 'd6';
    const denom = hitDice ?? 'd6';
    const available = 1; //parseInt(this.actor.system.details.cr ?? 1);
    hd[denom] = denom in hd ? hd[denom] + available : available;

    data.availableHD = hd;

    data.canRoll = true; //this.actor.system.attributes.hd > 0;
    data.denomination = this._denom;

    // Determine rest type
    const variant = FoundryAdapter.getGameSetting('dnd5e', 'restVariant');
    data.promptNewDay = variant !== 'epic'; // It's never a new day when only resting 1 minute
    data.newDay = false; // It may be a new day, but not by default
    return data;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html: any) {
    super.activateListeners(html);
    let btn = html.find('#roll-hd');
    btn.click(this._onRollHitDie.bind(this));
    btn.hide(); // Added for tidy
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a Hit Die as part of a Short Rest action
   * @param {Event} event     The triggering click event
   * @protected
   */
  async _onRollHitDie(event: Event) {
    event.preventDefault();
    const btn = event.currentTarget as any;
    const hdValue = btn.form?.hd?.value;
    if (hdValue === undefined) {
      error('Unable to locate hit dice value. Unable to roll hit dice.');
      return;
    }
    this._denom = hdValue;
    // await this.actor.rollHitDie(this._denom);
    await this.rollHitDieNPC(this._denom);
    this.render();
  }

  /* -------------------------------------------- */

  /**
   * A helper constructor function which displays the Short Rest dialog and returns a Promise once it's workflow has
   * been resolved.
   * @param {object} [options={}]
   * @param {Actor5e} [options.actor]  Actor that is taking the short rest.
   * @returns {Promise}                Promise that resolves when the rest is completed or rejects when canceled.
   */
  static async shortRestDialog({
    actor,
  }: any = {}): Promise<ShortRestDialogResult> {
    return new Promise<ShortRestDialogResult>((resolve, reject) => {
      const dialogData = {
        title: `${FoundryAdapter.localize('DND5E.ShortRest')}: ${actor.name}`,
        buttons: {
          rest: {
            icon: '<i class="fas fa-bed"></i>',
            label: FoundryAdapter.localize('DND5E.Rest'),
            callback: (html: any) => {
              let newDay = false;
              if (FoundryAdapter.getGameSetting('dnd5e', 'restVariant') !== 'epic') {
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
        close: () => resolve({ confirmed: false }),
      };
      
      const dlg = new this(actor, dialogData);
      dlg.render(true);
    });
  }

  /* -------------------------------------------- */

  /**
   * Roll a hit die of the appropriate type, gaining hit points equal to the die roll plus your CON modifier.
   * @param {string} [denomination]  The hit denomination of hit die to roll. Example "d8".
   *                                 If no denomination is provided, the first available HD will be used
   * @param {object} options         Additional options which modify the roll.
   * @returns {Promise<any|null>}   The created Roll instance, or null if no hit die was rolled
   */
  async rollHitDieNPC(
    denomination: string,
    options: any = {}
  ): Promise<any | null> {
    const flavor = FoundryAdapter.localize('DND5E.HitDiceRoll');
    const actor = this.actor;

    return FoundryAdapter.rollNpcHitDie(actor, flavor, denomination, options);
  }
}
