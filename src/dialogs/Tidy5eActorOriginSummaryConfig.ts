import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

declare var DocumentSheet: any;

/**
 * A form for configuring actor hit points and bonuses.
 */
export default class Tidy5eActorOriginSummaryConfig extends DocumentSheet {
  constructor(...args: any[]) {
    super(...args);

    /**
     * Cloned copy of the actor for previewing changes.
     * @type {Actor5e}
     */
    this.clone = this.object.clone();
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['dnd5e', 'actor-origin-summary-config'],
      template: FoundryAdapter.getTemplate('tidy5e-origin-summary-config.hbs'),
      width: 320,
      height: 'auto',
      sheetConfig: false,
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${FoundryAdapter.localize('T5EK.OriginSummaryConfig')}: ${
      this.document.name
    }`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options: any) {
    return {
      race: this.clone.system.details.race,
      background: this.clone.system.details.background,
      environment: this.clone.system.details.environment,
      alignment: this.clone.system.details.alignment,
      source: this.clone.system.details.source,
      dimensions: this.clone.system.traits.dimensions,

      isCharacter: this.document.type === CONSTANTS.SHEET_TYPE_CHARACTER,
      isNPC: this.document.type === CONSTANTS.SHEET_TYPE_NPC,
      isVehicle: this.document.type === CONSTANTS.SHEET_TYPE_VEHICLE,
    };
  }

  /** @inheritdoc */
  async _updateObject(event: any, formData: any) {
    const race = FoundryAdapter.expandObject(formData).race;
    const background = FoundryAdapter.expandObject(formData).background;
    const environment = FoundryAdapter.expandObject(formData).environment;
    const alignment = FoundryAdapter.expandObject(formData).alignment;
    const source = FoundryAdapter.expandObject(formData).source;

    const dimensions = FoundryAdapter.expandObject(formData).dimensions;

    const isCharacter = this.document.type === CONSTANTS.SHEET_TYPE_CHARACTER;
    const isNPC = this.document.type === CONSTANTS.SHEET_TYPE_NPC;
    const isVehicle = this.document.type === CONSTANTS.SHEET_TYPE_VEHICLE;

    if (isCharacter) {
      return this.document.update({
        'system.details.race': race,
        'system.details.background': background,
        'system.details.alignment': alignment,
      });
    } else if (isNPC) {
      return this.document.update({
        'system.details.environment': environment,
        'system.details.alignment': alignment,
        'system.details.source': source,
      });
    } else if (isVehicle) {
      return this.document.update({
        'system.traits.dimensions': dimensions,
      });
    }
  }

  activateListeners(html: any) {
    super.activateListeners(html);
    if (this.isEditable) {
      for (const override of this._getActorOverrides()) {
        html
          .find(`input[name="${override}"],select[name="${override}"]`)
          .each((i: number, el: HTMLSelectElement) => {
            el.disabled = true;
            el.dataset.tooltip = 'DND5E.ActiveEffectOverrideWarning';
          });
      }
    }
  }

  /**
   * Retrieve the list of fields that are currently modified by Active Effects on the Actor.
   * @returns {string[]}
   * @protected
   */
  _getActorOverrides() {
    return Object.keys(
      FoundryAdapter.flattenObject(this.object.overrides || {})
    );
  }
}
