import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ItemCardStore,
  NpcSheetContext,
  SheetStats,
} from 'src/types/types';
import { get, writable } from 'svelte/store';
import NpcSheet from './npc/NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import { applyTitleToWindow } from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { getPercentage, isLessThanOneIsOne } from 'src/utils/numbers';
import NpcShortRestDialog from 'src/dialogs/NpcShortRestDialog';
import LongRestDialog from 'src/dialogs/NpcLongRestDialog';
import { isNil } from 'src/utils/data';
import type { SvelteComponent } from 'svelte';

declare var dnd5e: {
  applications: {
    actor: { ActorSheet5eNPC: any };
  };
};

declare var $: any;

export class Tidy5eNpcSheet extends dnd5e.applications.actor.ActorSheet5eNPC {
  context = writable<NpcSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  selectedTabId: string | undefined = undefined;

  constructor(...args: any[]) {
    super(...args);

    settingStore.subscribe(() => {
      this.getContext().then((context) => this.context.set(context));
    });
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'actor', CONSTANTS.SHEET_TYPE_NPC],
      height: 840,
      width: SettingsProvider.settings.npcSheetWidth.get(),
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    this.component = new NpcSheet({
      target: node,
      props: {
        selectedTabId: this.#getSelectedTabId(),
      },
      context: new Map<any, any>([
        ['context', this.context],
        ['stats', this.stats],
        ['card', this.card],
      ]),
    });

    initTidy5eContextMenu.call(this, html);
  }

  async getData(options = {}) {
    this.context.set(await this.getContext());
    return get(this.context);
  }

  #getSelectedTabId(): string {
    return (
      this.selectedTabId ?? SettingsProvider.settings.defaultNpcSheetTab.get()
    );
  }

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  private async getContext(): Promise<NpcSheetContext> {
    const editable = FoundryAdapter.canEditActor(this.actor) && this.isEditable;

    const lockSensitiveFields =
      !editable && SettingsProvider.settings.editTotalLockEnabled.get();
    const defaultNpcContext = await super.getData(this.options);

    return {
      ...defaultNpcContext,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      allowEffectsManagement: true,
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.appearance`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      appId: this.appId,
      biographyEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `system.details.biography.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      bondEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.bond`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      classicControlsEnabled:
        SettingsProvider.settings.enableClassicControlsForNpc.get(),
      encumbrance: this.actor.system.attributes.encumbrance,
      editable,
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.flaw`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      hideEmptySpellbook:
        lockSensitiveFields && defaultNpcContext.spellbook.length === 0,
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
      hideSpellbookTab: SettingsProvider.settings.hideSpellbookTabNpc.get(),
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.ideal`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      lockSensitiveFields,
      longRest: this._onLongRest.bind(this),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      notes1EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes1.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes2EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes2.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes3EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes3.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes4EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes4.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notesEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      owner: this.actor.isOwner,
      rollDeathSave: this._rollDeathSave.bind(this),
      shortRest: this._onShortRest.bind(this),

      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      tokenState: this.#getTokenState(),
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.trait`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultNpcContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      useRoundedPortraitStyle: [
        CONSTANTS.ROUNDED_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.ROUNDED_PORTRAIT_OPTION_NPCVEHICLE as string,
      ].includes(SettingsProvider.settings.portraitStyle.get()),
    };
  }

  #getTokenState(): 'linked' | 'unlinked' | null {
    const { token } = this;

    const linkMarkerNpc = SettingsProvider.settings.linkMarkerNpc.get();

    if (!token) {
      return null;
    }

    if (token.actorLink && linkMarkerNpc == 'both') {
      return 'linked';
    }

    if (
      !token.actorLink &&
      (linkMarkerNpc == 'unlinked' || linkMarkerNpc == 'both')
    ) {
      return 'unlinked';
    }

    return null;
  }

  protected _saveViewState() {
    /*
      TODO: Save any state that needs to be restored to this sheet instance for rehydration on refresh.
      - Currently Selected Tab
      - Scroll Top of all scrollable areas + the tab they represent
      - Expanded entity IDs
      - Focused input element

      To do this save operation, use query selectors and data-attributes to target the appropriate things to save.
      Can it be made general-purpose? Or should it be more bespoke?
    */
    this.#cacheSelectedTabId();
  }

  #cacheSelectedTabId() {
    const selectedTabId = this.element
      ?.get(0)
      ?.querySelector(`.${CONSTANTS.TAB_OPTION_CLASS}.active`)?.dataset?.tabId;

    if (!isNil(selectedTabId, '')) {
      this.selectedTabId = selectedTabId;
    }

    /* 
      While Tidy 5e does its own thing with tabs, 
      this active tab assignment is required in order 
      to make item dropping tab-aware.
    */
    this._tabs[0].active = this.selectedTabId;
  }

  async _onDropSingleItem(...args: any[]) {
    this.#cacheSelectedTabId();
    return super._onDropSingleItem(...args);
  }

  onToggleFilter(setName: string, filterName: string) {
    const set = this._filters[setName];
    if (!set) {
      error(`Unable to find filter set for '${setName}'. Filtering failed.`);
      return;
    }
    if (set.has(filterName)) {
      set.delete(filterName);
    } else {
      set.add(filterName);
    }

    return this.render();
  }

  isFilterActive(setName: string, filterName: string): boolean {
    return this._filters[setName]?.has(filterName) === true;
  }

  render(force = false, ...args: any[]) {
    if (force) {
      this.component?.$destroy();
      super.render(force, ...args);
      return this;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    this.getContext().then((context) => {
      this.context.update(() => context);
    });
    return this;
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  /**
   * Take a short rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onShortRest(event: Event) {
    event.preventDefault();
    await this._onSubmit(event);
    if (SettingsProvider.settings.restingForNpcsChatDisabled.get()) {
      let obj = {
        dialog: true,
        chat: false,
      };
      return this.shortRest(obj);
    }
    return this.shortRest();
  }

  /**
   * Take a long rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onLongRest(event: Event) {
    event.preventDefault();
    await this._onSubmit(event);
    if (SettingsProvider.settings.restingForNpcsChatDisabled.get()) {
      let obj = {
        dialog: true,
        chat: false,
      };
      return this.longRest(obj);
    }
    return this.longRest();
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
  }

  /**
   * Take a short rest, possibly spending hit dice and recovering resources, item uses, and pact slots.
   * @param {RestConfiguration} [config]  Configuration options for a short rest.
   * @returns {Promise<RestResult>}       A Promise which resolves once the short rest workflow has completed.
   */
  async shortRest(config: any = {}) {
    config = FoundryAdapter.mergeObject(
      {
        dialog: true,
        chat: true,
        newDay: false,
        autoHD: false,
        autoHDThreshold: 3,
      },
      config
    );

    /**
     * A hook event that fires before a short rest is started.
     * @function dnd5e.preShortRest
     * @memberof hookEvents
     * @param {Actor5e} actor             The actor that is being rested.
     * @param {RestConfiguration} config  Configuration options for the rest.
     * @returns {boolean}                 Explicitly return `false` to prevent the rest from being started.
     */
    if (
      FoundryAdapter.hooksCall('dnd5e.preShortRest', this.actor, config) ===
      false
    ) {
      return;
    }

    // Take note of the initial hit points and number of hit dice the Actor has
    const hd0 = isLessThanOneIsOne(this.actor.system.details.cr); // this.actor.system.attributes.hd;
    const hp0 = this.actor.system.attributes.hp.value;

    // Display a Dialog for rolling hit dice
    if (config.dialog) {
      try {
        const result = await NpcShortRestDialog.shortRestDialog({
          actor: this.actor,
          canRoll: hd0 > 0,
        });

        if (result.confirmed) {
          config.newDay = result.newDay === true;
          // Return the rest result
          const dhd = hd0; // this.system.attributes.hd - hd0;
          const dhp = this.actor.system.attributes.hp.value - hp0;
          this._rest(config.chat, config.newDay, false, dhd, dhp);
        }
      } catch (err) {
        error(
          'An error occurred while attempting a short rest for the NPC. See devtool console for more information.',
          true,
          err
        );
        return;
      }
    } else if (config.autoHD) {
      // Automatically spend hit dice
      await this.autoSpendHitDice({ threshold: config.autoHDThreshold });
    }
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, recovering hit points, hit dice, resources, item uses, and spell slots.
   * @param {RestConfiguration} [config]  Configuration options for a long rest.
   * @returns {Promise<RestResult>}       A Promise which resolves once the long rest workflow has completed.
   */
  async longRest(config: any = {}) {
    config = FoundryAdapter.mergeObject(
      {
        dialog: true,
        chat: true,
        newDay: true,
      },
      config
    );

    /**
     * A hook event that fires before a long rest is started.
     * @function dnd5e.preLongRest
     * @memberof hookEvents
     * @param {Actor5e} actor             The actor that is being rested.
     * @param {RestConfiguration} config  Configuration options for the rest.
     * @returns {boolean}                 Explicitly return `false` to prevent the rest from being started.
     */
    if (
      FoundryAdapter.hooksCall('dnd5e.preLongRest', this.actor, config) ===
      false
    )
      return;

    if (!config.dialog) {
      return;
    }

    try {
      const result = await LongRestDialog.longRestDialog({
        actor: this.actor,
      });

      if (result.confirmed) {
        config.newDay = result.newDay === true;
        return this._rest(config.chat, config.newDay, true);
      }
    } catch (err) {
      error(
        'An error occurred while attempting a long rest for the NPC. See devtool console for more information.',
        true,
        err
      );
    }
  }

  /* -------------------------------------------- */

  /**
   * Perform all of the changes needed for a short or long rest.
   *
   * @param {boolean} chat           Summarize the results of the rest workflow as a chat message.
   * @param {boolean} newDay         Has a new day occurred during this rest?
   * @param {boolean} longRest       Is this a long rest?
   * @param {number} [dhd=0]         Number of hit dice spent during so far during the rest.
   * @param {number} [dhp=0]         Number of hit points recovered so far during the rest.
   * @returns {Promise<RestResult>}  Consolidated results of the rest workflow.
   * @private
   */
  async _rest(
    chat: boolean,
    newDay: boolean,
    longRest: boolean,
    dhd: number = 0,
    dhp: number = 0
  ): Promise<unknown> {
    // Recover hit points & hit dice on long rest
    if (longRest || newDay) {
      this.actor.update({
        'system.attributes.hp.value': Number(
          this.actor.system.attributes.hp.max ?? 0
        ),
      });
      // Patch for NPC
      if (this.actor.flags[CONSTANTS.MODULE_ID].exhaustion > 0) {
        const exhaustion = this.actor.flags[CONSTANTS.MODULE_ID].exhaustion;
        debug('tidy5e-npc | _rest | exhaustion = ' + exhaustion);
        await this.actor.update({
          [`flags.${CONSTANTS.MODULE_ID}.exhaustion`]: exhaustion - 1,
        });
        // TODO: Implement:
        // await updateExhaustion(this.actor);
      }
    } else {
      const rollData = this.actor.getRollData();
      const roll_value = await FoundryAdapter.roll(
        isLessThanOneIsOne(dhd).toString() + 'd6',
        rollData
      );
      const value = roll_value.total;
      let newHpValue =
        this.actor.system.attributes.hp.value + Number(value ?? 0);
      if (newHpValue > this.actor.system.attributes.hp.max) {
        newHpValue = this.actor.system.attributes.hp.max;
      }
      await this.actor.update({ 'system.attributes.hp.value': newHpValue });
    }
    // TODO for some reason doen't work...i copy and paste the code from the system
    // return this.actor._rest(chat, newDay, longRest, dhd, dhp);
    let hitPointsRecovered = 0;
    let hitPointUpdates = {};
    let hitDiceRecovered = 0;
    let hitDiceUpdates = [];
    const rolls: any[] = [];

    // Recover hit points & hit dice on long rest
    if (longRest) {
      ({ updates: hitPointUpdates, hitPointsRecovered } =
        this.actor._getRestHitPointRecovery());
      ({ updates: hitDiceUpdates, hitDiceRecovered } =
        this.actor._getRestHitDiceRecovery());
    }

    // Figure out the rest of the changes
    const result: Record<string, unknown> = {
      dhd: dhd + hitDiceRecovered,
      dhp: dhp + hitPointsRecovered,
      updateData: {
        ...hitPointUpdates,
        ...this.actor._getRestResourceRecovery({
          recoverShortRestResources: !longRest,
          recoverLongRestResources: longRest,
        }),
        ...this.actor._getRestSpellRecovery({ recoverSpells: longRest }),
      },
      updateItems: [
        ...hitDiceUpdates,
        ...(await this.actor._getRestItemUsesRecovery({
          recoverLongRestUses: longRest,
          recoverDailyUses: newDay,
          rolls,
        })),
      ],
      longRest,
      newDay,
    };
    result.rolls = rolls;

    /**
     * A hook event that fires after rest result is calculated, but before any updates are performed.
     * @function dnd5e.preRestCompleted
     * @memberof hookEvents
     * @param {Actor5e} actor      The actor that is being rested.
     * @param {RestResult} result  Details on the rest to be completed.
     * @returns {boolean}          Explicitly return `false` to prevent the rest updates from being performed.
     */
    if (
      FoundryAdapter.hooksCall('dnd5e.preRestCompleted', this.actor, result) ===
      false
    )
      return result;

    // Perform updates
    await this.actor.update(result.updateData);
    await this.actor.updateEmbeddedDocuments('Item', result.updateItems);

    // Display a Chat Message summarizing the rest effects
    if (chat) await this.actor._displayRestResultMessage(result, longRest);

    /**
     * A hook event that fires when the rest process is completed for an actor.
     * @function dnd5e.restCompleted
     * @memberof hookEvents
     * @param {Actor5e} actor      The actor that just completed resting.
     * @param {RestResult} result  Details on the rest completed.
     */
    FoundryAdapter.hooksCallAll('dnd5e.restCompleted', this.actor, result);

    // Return data summarizing the rest effects
    return result;
  }

  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {object} options          Additional options which modify the roll
   * @returns {Promise<D20Roll|null>} A Promise which resolves to the Roll instance
   */
  async _rollDeathSave(options: Record<string, any> = {}) {
    return FoundryAdapter.rollNpcDeathSave(this.actor, options);
  }

  close(options: unknown = {}) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(`Unable to save view state for ${Tidy5eNpcSheet.name}. Ignoring.`);
    } finally {
      this.component?.$destroy();
      return super.close(options);
    }
  }
}
