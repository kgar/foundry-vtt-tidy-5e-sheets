import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ItemCardStore,
  NpcSheetContext,
  SearchFilterCacheable,
  LocationToSearchTextMap,
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  ExpandedItemIdToLocationsMap,
  ExpandedItemData,
} from 'src/types/types';
import { get, writable } from 'svelte/store';
import NpcSheet from './npc/NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import {
  applyModuleSheetDataAttributeToWindow,
  applyThemeDataAttributeToWindow,
  applyTitleToWindow,
} from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { getPercentage, isLessThanOneIsOne } from 'src/utils/numbers';
import NpcShortRestDialog from 'src/dialogs/NpcShortRestDialog';
import LongRestDialog from 'src/dialogs/NpcLongRestDialog';
import type { SvelteComponent } from 'svelte';
import type { ItemChatData } from 'src/types/item';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import {
  actorUsesActionFeature,
  getActorActions,
} from 'src/features/actions/actions';
import { isNil } from 'src/utils/data';
import { SheetCompatibilityManager } from './SheetCompatibilityManager';

export class Tidy5eNpcSheet
  extends dnd5e.applications.actor.ActorSheet5eNPC
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = writable<NpcSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();

  constructor(...args: any[]) {
    super(...args);

    settingStore.subscribe(() => {
      this.getData().then((context) => this.context.set(context));
      applyThemeDataAttributeToWindow(
        SettingsProvider.settings.colorScheme.get(),
        this.element?.get(0)
      );
    });

    this.currentTabId = SettingsProvider.settings.initialNpcSheetTab.get();
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'actor', CONSTANTS.SHEET_TYPE_NPC],
      height: 840,
      width: SettingsProvider.settings.npcSheetWidth.get(),
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    this.component = new NpcSheet({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['stats', this.stats],
        ['card', this.card],
        ['currentTabId', this.currentTabId],
        ['onTabSelected', this.onTabSelected.bind(this)],
        ['onItemToggled', this.onItemToggled.bind(this)],
        ['searchFilters', new Map(this.searchFilters)],
        ['onSearch', this.onSearch.bind(this)],
        ['location', ''],
        ['expandedItems', new Map(this.expandedItems)],
        ['expandedItemData', new Map(this.expandedItemData)],
      ]),
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(this.options);

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    const lockSensitiveFields =
      (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
      !defaultDocumentContext.editable;

    const context = {
      ...defaultDocumentContext,
      actions: getActorActions(this.actor),
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
          rollData: defaultDocumentContext.rollData,
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
          rollData: defaultDocumentContext.rollData,
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
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      useClassicControls:
        SettingsProvider.settings.useClassicControlsForNpc.get(),
      encumbrance: this.actor.system.attributes.encumbrance,
      editable: defaultDocumentContext.editable,
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.flaw`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      hideEmptySpellbook:
        lockSensitiveFields && defaultDocumentContext.spellbook.length === 0,
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
      showSpellbookTab: SettingsProvider.settings.showSpellbookTabNpc.get(),
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.ideal`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      lockSensitiveFields: lockSensitiveFields,
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
          rollData: defaultDocumentContext.rollData,
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
          rollData: defaultDocumentContext.rollData,
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
          rollData: defaultDocumentContext.rollData,
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
          rollData: defaultDocumentContext.rollData,
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
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      owner: this.actor.isOwner,
      rollDeathSave: this._rollDeathSave.bind(this),
      shortRest: this._onShortRest.bind(this),
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      tabs: [],
      tokenState: this.#getTokenState(),
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.trait`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      unlocked: unlocked,
      useActionsFeature: actorUsesActionFeature(this.actor),
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NPCVEHICLE as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    let tabs = await NpcSheetRuntime.getTabs(context);

    const selectedTabs = FoundryAdapter.tryGetFlag<string[]>(
      context.actor,
      'selected-tabs'
    );

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs = SettingsProvider.settings.defaultNpcSheetTabs.get();
      tabs = tabs
        .filter((t) => defaultTabs?.includes(t.id))
        .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));
    }

    context.tabs = tabs;

    debug('NPC Sheet context data', context);

    return context;
  }

  private async setExpandedItemData() {
    this.expandedItemData.clear();
    for (const id of this.expandedItems.keys()) {
      const item = this.actor.items.get(id);
      if (item) {
        this.expandedItemData.set(
          id,
          await item.getChatData({ secrets: this.actor.isOwner })
        );
      }
    }
  }

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  #getTokenState(): 'linked' | 'unlinked' | null {
    const { token } = this;

    const showNpcActorLinkMarker =
      SettingsProvider.settings.showNpcActorLinkMarker.get();

    if (!token) {
      return null;
    }

    if (token.actorLink && showNpcActorLinkMarker == 'both') {
      return 'linked';
    }

    if (
      !token.actorLink &&
      (showNpcActorLinkMarker == 'unlinked' || showNpcActorLinkMarker == 'both')
    ) {
      return 'unlinked';
    }

    return null;
  }

  async _onDropSingleItem(...args: any[]) {
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

  async _render(force?: boolean, options = {}) {
    await this.setExpandedItemData();
    this.context.set(await this.getData());

    if (force) {
      this._saveScrollPositions(this.element);
      this._destroySvelteComponent();
      await super._render(force, options);
      applyModuleSheetDataAttributeToWindow(this.element.get(0));
      applyThemeDataAttributeToWindow(
        SettingsProvider.settings.colorScheme.get(),
        this.element.get(0)
      );
      await this.renderCustomContent({ isFullRender: true });
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    await this.renderCustomContent({ isFullRender: false });
  }

  private async renderCustomContent(args: { isFullRender: boolean }) {
    const data = get(this.context);

    await SheetCompatibilityManager.renderCustomContent({
      app: this,
      data: data,
      element: this.element,
      isFullRender: args.isFullRender,
      superActivateListeners: super.activateListeners,
      tabs: data.tabs,
    });
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  _destroySvelteComponent() {
    this.component?.$destroy();
    this.component = undefined;
  }

  _saveScrollPositions(html: any) {
    if (html.length && this.component) {
      const save = super._saveScrollPositions(html);
      debug('Saved scroll positions', this._scrollPositions);
      return save;
    }
  }

  /**
   * Take a short rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onShortRest(event: Event) {
    event.preventDefault();
    await this._onSubmit(event);
    if (SettingsProvider.settings.showNpcRestInChat.get()) {
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
    if (SettingsProvider.settings.showNpcRestInChat.get()) {
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
    if (Hooks.call('dnd5e.preShortRest', this.actor, config) === false) {
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
    if (Hooks.call('dnd5e.preLongRest', this.actor, config) === false) return;

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
  async _rollDeathSave(options: Record<string, any> = {}) {
    return FoundryAdapter.rollNpcDeathSave(this.actor, options);
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    return super.close(options);
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
  }

  /* -------------------------------------------- */
  /* SheetExpandedItemsCacheable
  /* -------------------------------------------- */

  onItemToggled(itemId: string, isVisible: boolean, location: string) {
    const locationSet =
      this.expandedItems.get(itemId) ??
      this.expandedItems.set(itemId, new Set<string>()).get(itemId);

    if (isVisible) {
      locationSet?.add(location);
    } else {
      locationSet?.delete(location);
    }

    debug('Item Toggled', {
      expandedItems: this.expandedItems,
    });
  }

  /* -------------------------------------------- */
  /* SearchFilterCacheable
  /* -------------------------------------------- */

  onSearch(location: string, text: string): void {
    debug('Searched', {
      location,
      text,
    });
    this.searchFilters.set(location, text);
  }
}
