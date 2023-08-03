import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, ItemSheetContext } from 'src/types/item';
import { writable } from 'svelte/store';
import ItemTypeNotFound from './ItemTypeNotFound.svelte';
import ItemEquipment from './ItemEquipment.svelte';
import ItemBackpack from './ItemBackpack.svelte';
import ItemBackground from './ItemBackground.svelte';
import type { SheetStats } from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';
import { debug } from 'src/utils/logging';
import { isNil } from 'src/utils/data';

export class Tidy5eKgarItemSheet extends dnd5e.applications.item.ItemSheet5e {
  store = writable<ItemSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  selectedTabId: string;
  advancementConfigurationMode = false;

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);

    if (this.object.type === 'class') {
      this.options.width = this.position.width = 600;
      this.options.height = this.position.height = 680;
    } else if (this.object.type === 'subclass') {
      this.options.height = this.position.height = 540;
    }
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template-for-items.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'item'],
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    this.store.set(await this.getContext());

    const node = html.get(0);

    const stores = new Map<any, any>([
      ['store', this.store],
      ['stats', this.stats],
    ]);

    switch (this.item.type) {
      case CONSTANTS.ITEM_TYPE_EQUIPMENT:
        new ItemEquipment({
          target: node,
          props: {
            selectedTabId: this.selectedTabId ?? 'description',
          },
          context: stores,
        });
        break;
      case CONSTANTS.ITEM_TYPE_BACKGROUND:
        new ItemBackground({
          target: node,
          props: {
            selectedTabId: this.selectedTabId ?? 'description',
          },
          context: stores,
        });
        break;
      case CONSTANTS.ITEM_TYPE_BACKPACK:
        new ItemBackpack({
          target: node,
          props: {
            selectedTabId: this.selectedTabId ?? 'description',
          },
          context: stores,
        });
        break;
      default:
        new ItemTypeNotFound({
          target: node,
          props: {
            store: this.store,
          },
          context: stores,
        });
        break;
    }

    node
      .querySelectorAll<HTMLElement>(`.${CONSTANTS.TAB_OPTION_CLASS}`)
      .forEach((tab) => {
        tab.addEventListener(
          'click',
          (event: MouseEvent & { currentTarget: HTMLElement }) => {
            const tabId = event.currentTarget.dataset.tabId;
            this.makeWindowAutoHeightForDetailsTab(tabId);
            this.#cacheSelectedTabId();
          }
        );
      });
  }

  private makeWindowAutoHeightForDetailsTab(tabId: string | undefined) {
    if (tabId === CONSTANTS.TAB_ITEM_DETAILS_ID) {
      const scrollTop = this.element
        ?.get(0)
        ?.querySelector(
          `[data-tab-contents-for="${CONSTANTS.TAB_ITEM_DETAILS_ID}"]`
        )?.scrollTop;
      this.setPosition({
        height: 'auto',
      });
      if (scrollTop) {
        const adjustedApplication = this.element
          ?.get(0)
          ?.querySelector(
            `[data-tab-contents-for="${CONSTANTS.TAB_ITEM_DETAILS_ID}"]`
          );
        if (adjustedApplication) {
          adjustedApplication.scrollTop = scrollTop;
        }
      }
    }
  }

  // TODO: Extract this implementation somewhere. Or at least part of it.
  async render(force = false, options = {}) {
    if (force) {
      super.render(force, options);
      this.makeWindowAutoHeightForDetailsTab(this.selectedTabId);
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    await this.updateContext();
    setTimeout(() => {
      this.makeWindowAutoHeightForDetailsTab(this.selectedTabId);
    });
  }

  private async updateContext() {
    const context = await this.getContext();
    this.store.update(() => context);
  }

  private async getContext(): Promise<ItemSheetContext> {
    return {
      ...(await super.getData(this.options)),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) =>
        super.activateListeners($(node)),
      toggleAdvancementLock: this.toggleAdvancementLock.bind(this),
    };
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);

    // TODO: Figure out why multiple render calls is trashing the prose editor.
    // This setTimeout() is making it so the item prose editors don't go nonresponsive.
    // I think it may have something to do with Save -> Trigger Component Refresh (onSubmit) -> Render -> Trash Prose Editor HTML -> Render again
    setTimeout(() => {
      this.stats.update((stats) => {
        stats.lastSubmissionTime = new Date();
        return stats;
      });
    });
  }

  close(...args: any[]) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(
        `Unable to save view state for ${Tidy5eKgarItemSheet.name}. Ignoring.`
      );
    } finally {
      return super.close(...args);
    }
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

  async toggleAdvancementLock() {
    this.advancementConfigurationMode = !this.advancementConfigurationMode;
    await this.updateContext();
  }
}
