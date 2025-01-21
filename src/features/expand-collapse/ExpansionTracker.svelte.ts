import { CONSTANTS } from 'src/constants';
import { debug, warn } from 'src/utils/logging';
import { getContext, setContext } from 'svelte';

interface ExpansionState {
  expanded: boolean;
}

interface TrackedTabs {
  [tabId: string]: {
    [location: string]: {
      [entityId: string]: ExpansionState;
    };
  };
}

export class ExpansionTracker {
  #tabs = $state<TrackedTabs>({});
  #initialState: boolean;

  constructor(initialState: boolean) {
    this.#initialState = initialState;
  }

  toggle(entityId: string, tabId: string, location: string, value?: boolean) {
    const expansionState = this.#tabs[tabId]?.[location]?.[entityId];

    if (!expansionState) {
      warn('Expansion State not found :| (TODO: Delete after implementing)');
      return;
    }

    expansionState.expanded = value ?? !expansionState.expanded;
  }

  getContextKeys() {
    const tabId =
      getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID) ?? 'DefaultTab';
    const location =
      getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION) ??
      'DefaultLocation';
    return { tabId, location };
  }

  register(
    entityId: string,
    tabId: string,
    location: string,
    expanded: boolean = true
  ) {
    const expansionState = this.getOrCreateExpansionState(
      tabId,
      location,
      entityId
    );

    expansionState.expanded = expanded;

    debug('ExpansionTracker: Registered tracked entity with ID ' + entityId);
  }

  private getOrCreateExpansionState(
    tabId: string,
    location: string,
    entityId: string
  ) {
    let tabMap = this.#tabs[tabId];
    if (!tabMap) {
      this.#tabs[tabId] = {};
      tabMap = this.#tabs[tabId];
    }

    let locationMap = tabMap[location];
    if (!locationMap) {
      tabMap[location] = {};
      locationMap = tabMap[location];
    }

    let expansionState = locationMap[entityId];
    if (!expansionState) {
      locationMap[entityId] = {
        expanded: this.#initialState,
      };
      expansionState = locationMap[entityId];
    }

    return expansionState;
  }

  unregister(entityId: string, tabId: string, location: string) {
    delete this.#tabs[tabId]?.[location]?.[entityId];

    debug('ExpansionTracker: Unregistered tracked entity with ID ' + entityId);
  }

  isExpanded(entityId: string, tabId: string, location: string) {
    return (
      this.#tabs[tabId]?.[location]?.[entityId]?.expanded ?? this.#initialState
    );
  }

  setAll(tabId: string, value: boolean) {
    const tabMap = this.#tabs[tabId] ?? {};
    for (let locationMap of Object.values(tabMap)) {
      for (let state of Object.values(locationMap)) {
        state.expanded = value;
      }
    }
  }

  f() {
    // for each tab, sort the locations by length asc
    // determine if shallow expand
    // determine if deep expand

    let tabStats: Record<
      string,
      { topHasExpansion: boolean; hasExpansion: boolean }
    > = {};

    for (let [tabId, locations] of Object.entries(this.#tabs)) {
      let hasExpansionAtIndex: boolean[] = [];

      for (let [location, expansions] of Object.entries(locations)) {
        if (hasExpansionAtIndex[location.length]) {
          break;
        }

        for (let [_, expansion] of Object.entries(expansions)) {
          hasExpansionAtIndex[location.length] ||= expansion.expanded;

          if (expansion.expanded) {
            break;
          }
        }
      }

      let expansions = hasExpansionAtIndex.filter((x) => x !== undefined);
      tabStats[tabId] = {
        hasExpansion: expansions.some((x) => x),
        topHasExpansion: !!expansions[0],
      };
    }

    return tabStats;
  }
}
