import { mapGetOrInsert } from 'src/utils/map';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

/** Service for tracking which inline entities are currently expanded to show their contents. */
export class InlineToggleService {
  /** A map of tab IDs to set of entity IDs, typically Items. */
  map = new SvelteMap<string, SvelteSet<string>>();

  /** Toggle an entity to be expanded or collapsed, based on its current state. */
  toggle(tabId: string, entityId: string, value?: boolean) {
    const tab = mapGetOrInsert(this.map, tabId, new SvelteSet<string>());

    if (value === false) {
      tab.delete(entityId);
    } else if (value === true) {
      tab.add(entityId);
    } else if (tab.has(entityId)) {
      tab.delete(entityId);
    } else {
      tab.add(entityId);
    }
  }
}
