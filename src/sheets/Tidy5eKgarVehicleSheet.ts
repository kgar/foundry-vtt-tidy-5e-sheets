import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import type {
  ItemCardStore,
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  TidyExpandedItemData,
  TidyExpandedItems,
  VehicleSheetContext,
} from 'src/types/types';
import { get, writable } from 'svelte/store';
import VehicleSheet from './vehicle/VehicleSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { applyTitleToWindow } from 'src/utils/applications';
import type { SvelteComponent } from 'svelte';
import { debug } from 'src/utils/logging';
import { getPercentage } from 'src/utils/numbers';
import type { ItemChatData } from 'src/types/item';

declare var dnd5e: {
  applications: {
    actor: {
      ActorSheet5eVehicle: any;
    };
  };
};

declare var $: any;

export class Tidy5eVehicleSheet
  extends dnd5e.applications.actor.ActorSheet5eVehicle
  implements SheetTabCacheable, SheetExpandedItemsCacheable
{
  context = writable<VehicleSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  currentTabId: string;
  tidyExpandedItems: TidyExpandedItems = new Map<string, Set<string>>();
  tidyExpandedItemData: TidyExpandedItemData = new Map<string, ItemChatData>();

  constructor(...args: any[]) {
    super(...args);

    settingStore.subscribe(() => {
      this.getContext().then((context) => this.context.set(context));
    });

    this.currentTabId = SettingsProvider.settings.defaultVehicleSheetTab.get();
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'actor', CONSTANTS.SHEET_TYPE_VEHICLE],
      height: 840,
      width: SettingsProvider.settings.vehicleSheetWidth.get(),
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    const contextAtInit = get(this.context);

    this.component = new VehicleSheet({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['stats', this.stats],
        ['card', this.card],
        ['currentTabId', this.currentTabId],
        ['onTabSelected', this.onTabSelected.bind(this)],
        ['onItemToggled', this.onItemToggled.bind(this)],
        ['expandedData', contextAtInit.expandedData],
        ['location', ''],
        ['tidyExpandedItems', new Map(this.tidyExpandedItems)],
        ['tidyExpandedItemData', new Map(this.tidyExpandedItemData)],
      ]),
    });

    initTidy5eContextMenu.call(this, html);
  }

  async getData(options = {}) {
    this.context.set(await this.getContext());
    await this.setExpandedItemData();
    return get(this.context);
  }

  private async setExpandedItemData() {
    this.tidyExpandedItemData.clear();
    for (const id of this.tidyExpandedItems.keys()) {
      const item = this.actor.items.get(id);
      if (item) {
        this.tidyExpandedItemData.set(
          id,
          await item.getChatData({ secrets: this.actor.isOwner })
        );
      }
    }
  }

  private async getContext(): Promise<VehicleSheetContext> {
    const editable = FoundryAdapter.canEditActor(this.actor) && this.isEditable;

    const context = {
      ...(await super.getData(this.options)),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
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
      useRoundedPortraitStyle: [
        CONSTANTS.ROUNDED_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.ROUNDED_PORTRAIT_OPTION_NPCVEHICLE as string,
      ].includes(SettingsProvider.settings.portraitStyle.get()),
      classicControlsEnabled:
        SettingsProvider.settings.enableClassicControlsForVehicle.get(),
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
    };

    debug('Vehicle Sheet context data', context);

    return context;
  }

  render(force = false, ...args: any[]) {
    if (force) {
      this._saveScrollPositions(this.element);
      this._destroySvelteComponent();
      return super.render(force, ...args);
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

  async _onDropSingleItem(...args: any[]) {
    return super._onDropSingleItem(...args);
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    return super.close(options);
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
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
      this.tidyExpandedItems.get(itemId) ??
      this.tidyExpandedItems.set(itemId, new Set<string>()).get(itemId);

    if (isVisible) {
      locationSet?.add(location);
    } else {
      locationSet?.delete(location);
    }

    debug('Item Toggled', {
      expandedItems: this.tidyExpandedItems,
    });
  }
}
