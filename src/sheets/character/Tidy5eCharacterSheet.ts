import { FoundryAdapter } from '../../foundry/foundry-adapter';
import CharacterSheet from './CharacterSheet.svelte';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import type { Actor5e } from 'src/types/actor';
import { isNil } from 'src/utils/data';
import { CONSTANTS } from 'src/constants';
import { writable } from 'svelte/store';
import {
  type ItemCardStore,
  type CharacterSheetContext,
  type SheetStats,
} from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';
import type { SvelteComponent } from 'svelte';

export class Tidy5eCharacterSheet extends dnd5e.applications.actor
  .ActorSheet5eCharacter {
  context = writable<CharacterSheetContext>();
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
      classes: [
        'tidy5e-kgar',
        'sheet',
        'actor',
        CONSTANTS.SHEET_TYPE_CHARACTER,
      ],
      height: 840,
      width: SettingsProvider.settings.playerSheetWidth.get(),
    });
  }

  component: SvelteComponent | undefined;
  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });
    const initialContext = await this.getContext();
    this.context.set(initialContext);

    this.component = new CharacterSheet({
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

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  onShortRest(event: Event) {
    return this._onShortRest(event);
  }

  onLongRest(event: Event) {
    return this._onLongRest(event);
  }

  private async getContext(): Promise<CharacterSheetContext> {
    const editable = FoundryAdapter.canEditActor(this.actor) && this.isEditable;

    const context: CharacterSheetContext = {
      ...(await super.getData(this.options)),
      actorClassesToImages: getActorClassesToImages(this.actor),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      lockSensitiveFields:
        !editable && SettingsProvider.settings.editTotalLockEnabled.get(),
      editable,
      allowEffectsManagement: FoundryAdapter.allowCharacterEffectsManagement(
        this.actor
      ),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      owner: this.actor.isOwner,
      allowMaxHpOverride:
        SettingsProvider.settings.allowHpMaxOverride.get() &&
        (!SettingsProvider.settings.lockHpMaxChanges.get() ||
          FoundryAdapter.userIsGm()),
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      useRoundedPortraitStyle: [
        CONSTANTS.ROUNDED_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.ROUNDED_PORTRAIT_OPTION_CHARACTER as string,
      ].includes(SettingsProvider.settings.portraitStyle.get()),
      classicControlsEnabled:
        SettingsProvider.settings.enableClassicControlsForCharacter.get(),
      characterJournalTabDisabled:
        SettingsProvider.settings.characterJournalTabDisabled.get(),
    };

    debug('Character Sheet context data', context);

    return context;
  }

  #getSelectedTabId(): string {
    return (
      this.selectedTabId ??
      SettingsProvider.settings.defaultCharacterSheetTab.get()
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

  async _onDropSingleItem(...args: any[]) {
    this.#cacheSelectedTabId();
    return super._onDropSingleItem(...args);
  }

  close(options: unknown = {}) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(
        `Unable to save view state for ${Tidy5eCharacterSheet.name}. Ignoring.`
      );
    } finally {
      this.component?.$destroy();
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
