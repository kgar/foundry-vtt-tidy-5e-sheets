import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings';
import { Tidy5eKgarUserSettings } from 'src/settings/user-settings-form';
import type { SheetStats, VehicleSheetContext } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { writable } from 'svelte/store';
import VehicleSheet from './VehicleSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { applyTitleToWindow } from 'src/utils/applications';

const ActorSheet5eVehicle = FoundryAdapter.getActorSheetVehicleClass();

export class Tidy5eVehicleSheet extends ActorSheet5eVehicle {
  store = writable<VehicleSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  selectedTabId: string | undefined = undefined;

  constructor(...args: any[]) {
    super(...args);
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'actor', 'vehicle'],
      height: 840,
      width: SettingsProvider.settings.vehicleSheetWidth.get(),
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    const initialContext = await this.getContext();
    this.store.set(initialContext);

    new VehicleSheet({
      target: node,
      props: {
        selectedTabId: this.#getSelectedTabId(),
      },
      context: new Map<any, any>([
        ['store', this.store],
        ['stats', this.stats],
      ]),
    });

    initTidy5eContextMenu.call(this, html);
  }

  private async getContext(): Promise<VehicleSheetContext> {
    return {
      ...(await super.getData(this.options)),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
    };
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
  }

  async render(force: boolean, ...args: any[]) {
    if (force) {
      super.render(force, ...args);
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    const context = await this.getContext();
    this.store.update(() => context);
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    buttons.unshift({
      class: 'configure-tidy5e',
      icon: 'far fa-newspaper',
      label: 'Tidy5e',
      onclick: () => {
        return new Tidy5eKgarUserSettings({}, undefined).render(true);
      },
    });
    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }
}
