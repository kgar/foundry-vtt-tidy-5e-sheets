import { writable, type Writable } from 'svelte/store';

/** Service for tracking which inline containers are currently expanded to show their contents. */
export class InlineContainerToggleService {
  /** Container IDs which represent all containers that are currently expanded. */
  store: Writable<Map<string, Set<string>>> = writable(
    new Map<string, Set<string>>()
  );

  /** Toggle a container to be expanded or collapsed, based on its current state. */
  toggle(tabId: string, containerId: string) {
    this.store.update((tabs) => {
      if (!tabs.has(tabId)) {
        tabs.set(tabId, new Set<string>());
      }

      const tab = tabs.get(tabId)!;

      if (tab.has(containerId)) {
        tab.delete(containerId);
      } else {
        tab.add(containerId);
      }

      return tabs;
    });
  }
}
