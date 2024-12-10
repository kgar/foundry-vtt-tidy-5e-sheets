import { SvelteMap, SvelteSet } from 'svelte/reactivity';

/** Service for tracking which inline entities are currently expanded to show their contents. */
export class InlineToggleService {
  /** A map of tab IDs to set of entity IDs, typically Items. */
  map = new SvelteMap<string, SvelteSet<string>>();

  /** Toggle an entity to be expanded or collapsed, based on its current state. */
  toggle(tabId: string, entityId: string) {
    // const tabs = this.map;

    if (!this.map.has(tabId)) {
      this.map.set(tabId, new SvelteSet<string>());
    }

    const tab = this.map.get(tabId)!;

    if (tab.has(entityId)) {
      tab.delete(entityId);
    } else {
      tab.add(entityId);
    }
  }
}
