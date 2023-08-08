import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ActorSheetContext, SheetStats } from 'src/types/types';
import { writable } from 'svelte/store';
import Tidy5eNpcSheetComponent from './NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import { Tidy5eKgarUserSettings } from 'src/settings/user-settings-form';
import { applyTitleToWindow } from 'src/utils/applications';
import { error } from 'src/utils/logging';

const ActorSheet5eNpc = FoundryAdapter.getActorSheetNpcClass();

export class Tidy5eNpcSheet extends ActorSheet5eNpc {
  store = writable<ActorSheetContext>();
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
      classes: ['tidy5e-kgar', 'sheet', 'actor', 'npc'],
      height: 840,
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    const initialContext = await this.getContext();
    this.store.set(initialContext);

    new Tidy5eNpcSheetComponent({
      target: node,
      props: {
        selectedTabId: this.selectedTabId ?? CONSTANTS.TAB_NPC_ABILITIES,
      },
      context: new Map<any, any>([
        ['store', this.store],
        ['stats', this.stats],
      ]),
    });

    // initTidy5eContextMenu.call(this, html);
  }

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  private async getContext(): Promise<ActorSheetContext> {
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

  #cacheSelectedTabId() {
    const selectedTabId = this.element
      ?.get(0)
      ?.querySelector(`.${CONSTANTS.TAB_OPTION_CLASS}.active`)?.dataset?.tabId;

    if (!isNil(selectedTabId, '')) {
      this.selectedTabId = selectedTabId;
    }
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
