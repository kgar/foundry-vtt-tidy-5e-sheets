import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { getContext, setContext } from 'svelte';

interface ExpansionState {
  expanded: boolean;
}

export interface TrackedTabs {
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
  topLevelLocation: string;
}

export type ExpansionTrackerToggleProvider = () => {
  expanded: boolean;
  toggle: Function;
};

export class ExpansionTracker {
  #tabs = $state<TrackedTabs>({});
  #initialState: boolean;
  #locationSegment: string;
  document: any;

  tabStats = $derived.by(() => {
    return this.getTabStats();
  });

  private debouncedPersistState = FoundryAdapter.debounce(() => {
    if (!this.document.uuid) {
      return;
    }
    const state = SettingsProvider.settings.sectionExpansionState.get();
    state[this.clientStateKey] = this.#tabs;
    FoundryAdapter.setTidySetting('sectionExpansionState', state);
  }, 250);

  get clientStateKey() {
    return `${this.document?.uuid}-${this.#locationSegment}`;
  }

  constructor(
    initialState: boolean,
    document: any,
    locationSegment: string = ''
  ) {
    this.#initialState = initialState;
    this.#locationSegment = locationSegment;
    this.document = document;

    if (this.document?.uuid) {
      const state =
        SettingsProvider.settings.sectionExpansionState.get()?.[
          this.clientStateKey
        ];

      if (state) {
        Object.assign(this.#tabs, state);
      }
    }
  }

  toggle(entityId: string, tabId: string, location: string, value?: boolean) {
    const expansionState = this.getOrCreateExpansionState(
      tabId,
      location,
      entityId
    );

    expansionState.expanded = value ?? !expansionState.expanded;

    this.debouncedPersistState();
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
    expanded?: boolean
  ) {
    const expansionState = this.getOrCreateExpansionState(
      tabId,
      location,
      entityId
    );

    if (expanded !== undefined) {
      expansionState.expanded = expanded;
    }
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
  }

  isExpanded(entityId: string, tabId: string, location: string) {
    return (
      this.#tabs[tabId]?.[location]?.[entityId]?.expanded ?? this.#initialState
    );
  }

  setAll(tabId: string, value: boolean, mode: 'shallow' | 'deep' = 'shallow') {
    let locationSegmentFilter: string | undefined = undefined;

    if (mode === 'shallow') {
      locationSegmentFilter = this.tabStats[tabId]?.topLevelLocation;
    }

    const tabMap = this.#tabs[tabId] ?? {};
    for (let [location, entities] of Object.entries(tabMap)) {
      for (let state of Object.values(entities)) {
        if (
          locationSegmentFilter !== undefined &&
          !this.locationSegmentsMatch(location, locationSegmentFilter)
        ) {
          continue;
        }
        state.expanded = value;
      }
    }

    this.debouncedPersistState();
  }

  locationSegmentsMatch(left: string, right: string) {
    return this.getLocationSegment(left) === this.getLocationSegment(right);
  }

  getLocationSegment(value?: string) {
    return value !== undefined
      ? value.slice(0, value.lastIndexOf(this.#locationSegment))
      : value;
  }

  getTabStats() {
    let tabStats: Record<string, TabStats> = {};

    for (let [tabId, locations] of Object.entries(this.#tabs)) {
      let expansionStatesAtIndex: {
        expanded: number;
        collapsed: number;
        location: string;
      }[] = [];

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
            location: location,
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
        topLevelLocation: expansions[0]?.location,
      };
    }

    return tabStats;
  }

  /**
   * Initializes to or gets existing Expansion Tracker from Context.
   * **Important**: Use this only within component initialization.
   * @param contextKey the context key for getting this tracker
   * @param initialState denotes whether it should initially be expanded (true) or collapsed (false)
   * @returns
   */
  static getOrInit(
    contextKey: string,
    initialState: boolean = true,
    locationSegment: string = '',
    document: any = undefined
  ) {
    let tracker = getContext<ExpansionTracker>(contextKey);

    if (!tracker) {
      tracker = new ExpansionTracker(initialState, document, locationSegment);
      setContext(contextKey, tracker);
    }

    return tracker;
  }
}
