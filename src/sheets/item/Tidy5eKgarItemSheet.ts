import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, ItemSheetContext } from 'src/types/item';
import { writable } from 'svelte/store';
import Tidy5eKgarItemSheetComponent from './Tidy5eKgarItemSheetComponent.svelte';

export class Tidy5eKgarItemSheet extends dnd5e.applications.item.ItemSheet5e {
  _store = writable<ItemSheetContext>();

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);

    console.log('Tidy5eItemSheet', { ...args });
    this._itemSheet = new dnd5e.applications.item.ItemSheet5e(item, ...args);
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-article-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.MODULE_ID, 'sheet', 'item'],
      width: 700,
      height: 400,
      popOut: true,
      minimizable: true,
      resizable: true,
      submitOnChange: false,
    });
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    this._store.set(await this._itemSheet.getData());

    const node = html.get(0);
    new Tidy5eKgarItemSheetComponent({
      target: node,
      props: {
        store: this._store,
      },
    });
  }

  // TODO: Extract this implementation somewhere. Or at least part of it.
  async render(force = false, options = {}) {
    if (force) {
      super.render(force, options);
      return;
    }

    let t = this.element.find('.window-title')[0];
    if (t.hasChildNodes()) t = t.childNodes[0];
    t.textContent = this.title;
    this._store.set(await this.getData());
  }
}
