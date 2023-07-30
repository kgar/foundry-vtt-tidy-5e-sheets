import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, ItemSheetContext } from 'src/types/item';
import { writable } from 'svelte/store';
import ItemTypeNotFound from './ItemTypeNotFound.svelte';
import ItemEquipment from './ItemEquipment.svelte';
import type { SheetStats } from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';

export class Tidy5eKgarItemSheet extends dnd5e.applications.item.ItemSheet5e {
  store = writable<ItemSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  selectedTabId = 'description';

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template-for-items.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'item'],
      width: 700,
      height: 400,
      popOut: true,
      minimizable: true,
      resizable: true,
      submitOnChange: false,
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
  }

  // TODO: Extract this implementation somewhere. Or at least part of it.
  async render(force = false, options = {}) {
    if (force) {
      super.render(force, options);
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    const context = await this.getContext();
    this.store.update(() => context);
  }

  private async getContext(): Promise<ItemSheetContext> {
    return {
      ...(await super.getData(this.options)),
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) =>
        super.activateListeners($(node)),
    };
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
  }

  close(...args: any[]) {
    try {
      console.log('Item sheet TODO: memoize the selected tab', this.element);
    } finally {
      super.close(...args);
    }
  }
}
