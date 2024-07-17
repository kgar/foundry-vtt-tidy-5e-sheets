import { writable, type Writable } from 'svelte/store';

/** Service for tracking which inline containers are currently expanded to show their contents. */
export class InlineContainerToggleService {
  /** Container IDs which represent all containers that are currently expanded. */
  store: Writable<Set<string>> = writable(new Set());

  /** Toggle a container to be expanded or collapsed, based on its current state. */
  toggle(containerId: string) {
    this.store.update((set) => {
      if (set.has(containerId)) {
        set.delete(containerId);
      } else {
        set.add(containerId);
      }

      return set;
    });
  }
}
