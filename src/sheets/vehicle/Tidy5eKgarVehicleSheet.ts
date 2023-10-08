import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import type {
  ItemCardStore,
  SheetStats,
  VehicleSheetContext,
} from 'src/types/types';
import { isNil } from 'src/utils/data';
import { writable } from 'svelte/store';
import VehicleSheet from './VehicleSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { applyTitleToWindow } from 'src/utils/applications';
import type { SvelteComponent } from 'svelte';
import { debug } from 'src/utils/logging';

export class Tidy5eVehicleSheet extends dnd5e.applications.actor
  .ActorSheet5eVehicle {
  store = writable<VehicleSheetContext>();
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
      classes: ['tidy5e-kgar', 'sheet', 'actor', CONSTANTS.SHEET_TYPE_VEHICLE],
      height: 840,
      width: SettingsProvider.settings.vehicleSheetWidth.get(),
    });
  }

  component: SvelteComponent | undefined;
  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });
    const initialContext = await this.getContext();
    this.store.set(initialContext);

    this.component = new VehicleSheet({
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
    };

    debug('Vehicle Sheet context data', context);

    return context;
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

  #getSelectedTabId(): string {
    if (
      !game.modules.get('character-actions-list-5e')?.active &&
      SettingsProvider.settings.defaultActionsTab.get() ===
        CONSTANTS.TAB_ALL_ACTIONS
    ) {
      return CONSTANTS.TAB_VEHICLE_ATTRIBUTES;
    }

    return (
      this.selectedTabId ??
      (SettingsProvider.settings.defaultActionsTab.get() !==
      CONSTANTS.TAB_ALL_DEFAULT
        ? SettingsProvider.settings.defaultActionsTab.get()
        : CONSTANTS.TAB_VEHICLE_ATTRIBUTES)
    );
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

  async render(force = false, ...args: any[]) {
    if (force) {
      this.component?.$destroy();
      super.render(force, ...args);
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    const context = await this.getContext();
    this.store.update(() => context);
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  async _onDropSingleItem(...args: any[]) {
    this.#cacheSelectedTabId();
    return super._onDropSingleItem(...args);
  }

  close(options: unknown = {}) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(
        `Unable to save view state for ${Tidy5eVehicleSheet.name}. Ignoring.`
      );
    } finally {
      this.component?.$destroy();
      return super.close(options);
    }
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
  }
}
