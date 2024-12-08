// kgar-migration-task - consider a SvelteSet for this one.
/** Service for tracking which inline entities are currently expanded to show their contents. */
export class InlineToggleService {
  /** Entity IDs which represent all entities that are currently expanded. */
  map: Map<string, Set<string>> = $state(new Map<string, Set<string>>());

  /** Toggle an entity to be expanded or collapsed, based on its current state. */
  toggle(tabId: string, entityId: string) {
    const tabs = this.map;

    if (!tabs.has(tabId)) {
      tabs.set(tabId, new Set<string>());
    }

    const tab = tabs.get(tabId)!;

    if (tab.has(entityId)) {
      tab.delete(entityId);
    } else {
      tab.add(entityId);
    }

    this.map = tabs;
  }
}
