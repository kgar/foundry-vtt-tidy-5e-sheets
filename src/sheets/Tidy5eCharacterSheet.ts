import { FoundryAdapter } from '../foundry/foundry-adapter';
import Tidy5eCharacterSheetContent from './Tidy5eCharacterSheetContent.svelte';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import type { Actor5e } from 'src/types/actor';
import { isNil } from 'src/utils/data';
import { CONSTANTS } from 'src/constants';
import { writable } from 'svelte/store';
import type { ActorSheetContext, SheetStats } from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';

const ActorSheet5eCharacter = FoundryAdapter.getActorSheetClass();

export class Tidy5eCharacterSheet extends ActorSheet5eCharacter {
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
      classes: ['tidy5e-kgar', 'sheet', 'actor', 'character'],
      height: 840,
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    const initialContext = await this.getContext();
    this.store.set(initialContext);

    new Tidy5eCharacterSheetContent({
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

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  onShortRest(event: Event) {
    return this._onShortRest(event);
  }

  onLongRest(event: Event) {
    return this._onLongRest(event);
  }

  private async getContext(): Promise<ActorSheetContext> {
    return {
      ...(await super.getData(this.options)),
      actorClassesToImages: getActorClassesToImages(this.actor),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
    };
  }

  #getSelectedTabId(): string {
    if (
      !game.modules.get('character-actions-list-5e')?.active &&
      SettingsProvider.settings.defaultActionsTab.get() === 'actions'
    ) {
      return 'attributes';
    }

    return (
      this.selectedTabId ??
      (SettingsProvider.settings.defaultActionsTab.get() !== 'default'
        ? SettingsProvider.settings.defaultActionsTab.get()
        : 'attributes')
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

  close(options: unknown = {}) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(
        `Unable to save view state for ${Tidy5eCharacterSheet.name}. Ignoring.`
      );
    } finally {
      return super.close(options);
    }
  }

  override submit(): void {
    this._saveViewState();
    super.submit();
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
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
    // super.activateListeners($(this.form));
  }
}

// TODO: Find a better home for this.
function getActorClassesToImages(actor: Actor5e) {
  let actorClassesToImages: Record<string, string> = {};
  for (let item of actor.items) {
    if (item.type == 'class') {
      let className = item.name.toLowerCase();
      let classImg = item.img;
      actorClassesToImages[className] = classImg;
    }
  }
  return actorClassesToImages;
}
