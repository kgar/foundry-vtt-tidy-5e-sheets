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

interface TabStats {
  topHasExpansion: boolean;
  topAllExpanded: boolean;
  hasExpansion: boolean;
  allExpanded: boolean;
}

export class ExpansionTracker {
  #tabs = $state<TrackedTabs>({});
  #initialState: boolean;
  #locationSegment: string;

  tabStats = $derived.by(() => {
    this.#tabs;
    return this.getTabStats();
  });

  constructor(initialState: boolean, locationSegment: string = '') {
    this.#initialState = initialState;
    this.#locationSegment = locationSegment;
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

  getTabStats() {
    let tabStats: Record<string, TabStats> = {};

    for (let [tabId, locations] of Object.entries(this.#tabs)) {
      let expansionStatesAtIndex: { expanded: number; collapsed: number }[] =
        [];

      for (let [location, expansions] of Object.entries(locations)) {
        const lastTargetLocationSegmentIndex = location.lastIndexOf(
          this.#locationSegment
        );

        let targetLocationSegment =
          lastTargetLocationSegmentIndex >= 0
            ? location.slice(0, lastTargetLocationSegmentIndex)
            : null;

        if (targetLocationSegment === null) {
          continue;
        }

        for (let [_, expansion] of Object.entries(expansions)) {
          expansionStatesAtIndex[targetLocationSegment.length] ??= {
            collapsed: 0,
            expanded: 0,
          };

          if (expansion.expanded) {
            expansionStatesAtIndex[targetLocationSegment.length].expanded++;
          } else {
            expansionStatesAtIndex[targetLocationSegment.length].collapsed++;
          }
        }
      }

      let expansions = expansionStatesAtIndex.filter((x) => x !== undefined);
      tabStats[tabId] = {
        hasExpansion: expansions.some((x) => x),
        topAllExpanded: expansions[0]?.collapsed === 0,
        topHasExpansion: !!expansions[0],
        allExpanded: expansions.every((e) => e.collapsed === 0),
      };
    }

    debug('ExpansionTracker: Recalculated tab stats.');

    return tabStats;
  }
}
