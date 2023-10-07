import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ItemCardStore,
  NpcSheetContext,
  SheetStats,
} from 'src/types/types';
import { writable } from 'svelte/store';
import NpcSheet from './NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import { applyTitleToWindow } from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { isLessThanOneIsOne } from 'src/utils/numbers';
import NpcShortRestDialog from 'src/dialogs/NpcShortRestDialog';
import LongRestDialog from 'src/dialogs/NpcLongRestDialog';
import { d20Roll } from 'src/utils/rolls';
import { isNil } from 'src/utils/data';
import type { SvelteComponent } from 'svelte';

export class Tidy5eNpcSheet extends dnd5e.applications.actor.ActorSheet5eNPC {
  store = writable<NpcSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  selectedTabId: string | undefined = undefined;

  constructor(...args: any[]) {
    super(...args);

    settingStore.subscribe(() => {
      this.getContext().then((context) => this.store.set(context));
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
  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });
    const initialContext = await this.getContext();
    this.store.set(initialContext);

    this.component = new NpcSheet({
      target: node,
      props: {
        selectedTabId: this.#getSelectedTabId(),
      },
      context: new Map<any, any>([
        ['store', this.store],
        ['stats', this.stats],
        ['card', this.card],
      ]),
    });

    initTidy5eContextMenu.call(this, html);
  }

  #getSelectedTabId(): string {
    if (
      !game.modules.get('character-actions-list-5e')?.active &&
      SettingsProvider.settings.defaultActionsTab.get() ===
        CONSTANTS.TAB_ALL_ACTIONS
    ) {
      return CONSTANTS.TAB_NPC_ABILITIES;
    }

    return (
      this.selectedTabId ??
      (SettingsProvider.settings.defaultActionsTab.get() !==
      CONSTANTS.TAB_ALL_DEFAULT
        ? SettingsProvider.settings.defaultActionsTab.get()
        : CONSTANTS.TAB_NPC_ABILITIES)
    );
  }

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  private async getContext(): Promise<NpcSheetContext> {
    const editable = FoundryAdapter.canEditActor(this.actor) && this.isEditable;

    return {
      ...(await super.getData(this.options)),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      shortRest: this._onShortRest.bind(this),
      longRest: this._onLongRest.bind(this),
      rollDeathSave: this._rollDeathSave.bind(this),
      tokenState: this.#getTokenState(),
      lockSensitiveFields:
        !editable && SettingsProvider.settings.editTotalLockEnabled.get(),
      editable,
      allowEffectsManagement: true,
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      owner: this.actor.isOwner,
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
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
      this.store.update(() => context);
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
  async shortRest(config = {}) {
    config = foundry.utils.mergeObject(
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
    if (Hooks.call('dnd5e.preShortRest', this.actor, config) === false) return;

    // Take note of the initial hit points and number of hit dice the Actor has
    const hd0 = isLessThanOneIsOne(this.actor.system.details.cr); // this.actor.system.attributes.hd;
    const hp0 = this.actor.system.attributes.hp.value;

    // Display a Dialog for rolling hit dice
    if (config.dialog) {
      try {
        config.newDay = await NpcShortRestDialog.shortRestDialog({
          actor: this.actor,
          canRoll: hd0 > 0,
        });
      } catch (err) {
        // error(err?.message, true);
        return;
      }
    }

    // Automatically spend hit dice
    else if (config.autoHD)
      await this.autoSpendHitDice({ threshold: config.autoHDThreshold });

    // Return the rest result
    const dhd = hd0; // this.system.attributes.hd - hd0;
    const dhp = this.actor.system.attributes.hp.value - hp0;
    return this._rest(config.chat, config.newDay, false, dhd, dhp);
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, recovering hit points, hit dice, resources, item uses, and spell slots.
   * @param {RestConfiguration} [config]  Configuration options for a long rest.
   * @returns {Promise<RestResult>}       A Promise which resolves once the long rest workflow has completed.
   */
  async longRest(config = {}) {
    config = foundry.utils.mergeObject(
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
    if (Hooks.call('dnd5e.preLongRest', this.actor, config) === false) return;

    if (config.dialog) {
      try {
        config.newDay = await LongRestDialog.longRestDialog({
          actor: this.actor,
        });
      } catch (err) {
        error(
          'An error occurred while attempting a long rest for the NPC. See devtool console for more information.',
          true,
          err
        );
        return;
      }
    }

    return this._rest(config.chat, config.newDay, true);
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
  async _rest(chat, newDay, longRest, dhd = 0, dhp = 0) {
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
      const roll_value = await new Roll(
        isLessThanOneIsOne(dhd) + 'd6',
        rollData
      ).roll();
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
    const rolls = [];

    // Recover hit points & hit dice on long rest
    if (longRest) {
      ({ updates: hitPointUpdates, hitPointsRecovered } =
        this.actor._getRestHitPointRecovery());
      ({ updates: hitDiceUpdates, hitDiceRecovered } =
        this.actor._getRestHitDiceRecovery());
    }

    // Figure out the rest of the changes
    const result = {
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
    if (Hooks.call('dnd5e.preRestCompleted', this.actor, result) === false)
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
    Hooks.callAll('dnd5e.restCompleted', this.actor, result);

    // Return data summarizing the rest effects
    return result;
  }

  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {object} options          Additional options which modify the roll
   * @returns {Promise<D20Roll|null>} A Promise which resolves to the Roll instance
   */
  async _rollDeathSave(options = {}) {
    const death = this.actor.flags[CONSTANTS.MODULE_ID].death ?? {};

    // Display a warning if we are not at zero HP or if we already have reached 3
    if (
      this.actor.system.attributes.hp.value > 0 ||
      death.failure >= 3 ||
      death.success >= 3
    ) {
      ui.notifications.warn(game.i18n.localize('DND5E.DeathSaveUnnecessary'));
      return null;
    }

    // Evaluate a global saving throw bonus
    const speaker = options.speaker || ChatMessage.getSpeaker({ actor: this });
    const globalBonuses = this.actor.system.bonuses?.abilities ?? {};
    const parts = [];
    const data = this.actor.getRollData();

    // Diamond Soul adds proficiency
    if (this.actor.getFlag('dnd5e', 'diamondSoul')) {
      parts.push('@prof');
      data.prof = new Proficiency(this.actor.system.attributes.prof, 1).term;
    }

    // Include a global actor ability save bonus
    if (globalBonuses.save) {
      parts.push('@saveBonus');
      data.saveBonus = Roll.replaceFormulaData(globalBonuses.save, data);
    }

    // Evaluate the roll
    const flavor = game.i18n.localize('DND5E.DeathSavingThrow');
    const rollData = foundry.utils.mergeObject(
      {
        data,
        title: `${flavor}: ${this.actor.name}`,
        flavor,
        halflingLucky: this.actor.getFlag('dnd5e', 'halflingLucky'),
        targetValue: 10,
        messageData: {
          speaker: speaker,
          'flags.dnd5e.roll': { type: 'death' },
        },
      },
      options
    );
    rollData.parts = parts.concat(options.parts ?? []);

    const roll = await d20Roll(rollData);
    if (!roll) return null;

    // Take action depending on the result
    const details = {};

    // Save success
    if (roll.total >= (roll.options.targetValue ?? 10)) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1hp
      if (roll.isCritical) {
        details.updates = {
          [`flags.${CONSTANTS.MODULE_ID}.death.success`]: 0,
          [`flags.${CONSTANTS.MODULE_ID}.death.failure`]: 0,
          'system.attributes.hp.value': 1,
        };
        details.chatString = 'DND5E.DeathSaveCriticalSuccess';
      }

      // 3 Successes = survive and reset checks
      else if (successes === 3) {
        details.updates = {
          [`flags.${CONSTANTS.MODULE_ID}.death.success`]: 0,
          [`flags.${CONSTANTS.MODULE_ID}.death.failure`]: 0,
        };
        details.chatString = 'DND5E.DeathSaveSuccess';
      }

      // Increment successes
      else
        details.updates = {
          [`flags.${CONSTANTS.MODULE_ID}.death.success`]: Math.clamped(
            successes,
            0,
            3
          ),
        };
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (roll.isFumble ? 2 : 1);
      details.updates = {
        [`flags.${CONSTANTS.MODULE_ID}.death.failure`]: Math.clamped(
          failures,
          0,
          3
        ),
      };
      if (failures >= 3) {
        // 3 Failures = death
        details.chatString = 'DND5E.DeathSaveFailure';
      }
    }

    if (!foundry.utils.isEmpty(details.updates))
      await this.actor.update(details.updates);

    // Display success/failure chat message
    if (details.chatString) {
      let chatData = {
        content: game.i18n.format(details.chatString, {
          name: this.actor.name,
        }),
        speaker,
      };
      ChatMessage.applyRollMode(chatData, roll.options.rollMode);
      await ChatMessage.create(chatData);
    }

    // Return the rolled result
    return roll;
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
