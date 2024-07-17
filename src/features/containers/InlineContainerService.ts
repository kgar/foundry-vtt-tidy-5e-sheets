import { readable, writable, type Readable, type Writable } from 'svelte/store';

export class InlineContainerService {
  store: Writable<Set<string>> = writable(new Set());

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