import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, ItemSheetContext } from 'src/types/item';
import { writable } from 'svelte/store';
import ItemTypeNotFound from './ItemTypeNotFound.svelte';
import ItemEquipment from './ItemEquipment.svelte';

export class Tidy5eKgarItemSheet extends dnd5e.applications.item.ItemSheet5e {
  store = writable<ItemSheetContext>();
  selectedTabId?: string | undefined;

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'item', 'flexcol'],
      width: 700,
      height: 400,
      popOut: true,
      minimizable: true,
      resizable: true,
      submitOnChange: false,
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    this.store.set(await this.getData());

    const node = html.get(0);

    switch (this.item.type) {
      case CONSTANTS.ITEM_TYPE_EQUIPMENT:
        new ItemEquipment({
          target: node,
          props: {
            store: this.store,
            selectedTabId: this.selectedTabId ?? 'description',
          },
        });
        break;
      default:
        new ItemTypeNotFound({
          target: node,
          props: {
            store: this.store,
          },
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

    let t = this.element.get(0).querySelector('.window-title');
    if (t.hasChildNodes()) t = t.childNodes[0];
    t.textContent = this.title;
    this.store.set(await this.getData());
  }

  close(...args: any[]) {
    try {
      console.log('Item sheet TODO: memoize the selected tab', this.element);
    } finally {
      super.close(...args);
    }
  }
}
