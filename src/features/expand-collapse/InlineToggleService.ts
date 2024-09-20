import { writable, type Writable } from 'svelte/store';

/** Service for tracking which inline entities are currently expanded to show their contents. */
export class InlineToggleService {
  /** Entity IDs which represent all entities that are currently expanded. */
  store: Writable<Map<string, Set<string>>> = writable(
    new Map<string, Set<string>>()
  );

  /** Toggle an entity to be expanded or collapsed, based on its current state. */
  toggle(tabId: string, entityId: string) {
    this.store.update((tabs) => {
      if (!tabs.has(tabId)) {
        tabs.set(tabId, new Set<string>());
      }

      const tab = tabs.get(tabId)!;

      if (tab.has(entityId)) {
        tab.delete(entityId);
      } else {
        tab.add(entityId);
      }

      return tabs;
    });
  }
}
