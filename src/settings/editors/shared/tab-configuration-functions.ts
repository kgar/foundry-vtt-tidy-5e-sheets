import { CONSTANTS } from 'src/constants';
import type {
  TabConfigContextEntry,
  TabConfigSnapshot,
  TabInfo,
  TabConfig,
} from './tab-configuration.types';
import type {
  SheetTabConfigEntry,
  SheetTabsConfiguration,
} from 'src/settings/settings.types';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { getSelectedTabIds } from 'src/settings/settings-data-models';
import type { CustomTabTitle } from 'src/api';
import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';

/**
 * {@link TabConfigContextEntry} stores the tab order and who can see them.
 * It contains the full list of tabs (with their ids and show/hide state)
 * and a map of viewer visibility levels by tab ID.
 */
export function getCanonicalTabSelection(entry: TabConfigContextEntry): {
  tabs: TabConfig[];
} {
  const visibilityLevels: Record<string, number | null> = {};

  for (const level of [...entry.tabs].sort((a, b) =>
    a.id.localeCompare(b.id),
  )) {
    visibilityLevels[level.id] = level.visibilityLevel;
  }

  return {
    tabs: entry.tabs.map((tab) => ({ ...tab })),
  };
}

export function getItemTabContext(
  type: string,
  settings: SheetTabsConfiguration | undefined | null,
) {
  const documentName = CONSTANTS.DOCUMENT_NAME_ITEM;

  let allRegisteredTabs = ItemSheetQuadroneRuntime.getAllRegisteredTabs(type);

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
  );
}

export function getActorTabContext(
  runtime: ActorSheetQuadroneRuntime<any>,
  type: string,
  settings: SheetTabsConfiguration | undefined | null,
  docTypeKeyOverride?: string,
): TabConfigContextEntry {
  let documentName = CONSTANTS.DOCUMENT_NAME_ACTOR;
  const allRegisteredTabs = runtime.getAllRegisteredTabs();

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    docTypeKeyOverride,
  );
}

function getWorldDefaultSelectedTabIds(
  documentName: string,
  type: string,
  typeOverride?: string,
): string[] | undefined {
  const selected = getSelectedTabIds(
    SettingsProvider.settings.tabConfiguration.get()?.[documentName]?.[
      typeOverride ?? type
    ],
  );

  if (selected.length > 0) {
    return selected;
  }
}

export function buildTabConfigContextEntry(
  documentName: string,
  type: string,
  allRegisteredTabs: {
    id: string;
    title: CustomTabTitle;
    iconClass?: string;
  }[],
  settings: SheetTabsConfiguration | undefined | null,
  docTypeKeyOverride?: string,
): TabConfigContextEntry {
  let configSectionTitle = FoundryAdapter.localize(
    `TYPES.${documentName}.${type}`,
  );

  // Registry of every currently-registered tab (title/icon lookup).
  const registry = allRegisteredTabs.reduce<Record<string, TabInfo>>(
    (prev, tab) => {
      prev[tab.id] = {
        id: tab.id,
        title: FoundryAdapter.localize(
          typeof tab.title === 'function' ? tab.title() : tab.title,
        ).titleCase(),
        iconClass: tab.iconClass,
      };
      return prev;
    },
    {},
  );

  const defaultTabs = buildTabConfigEntries(registry, {}, documentName);

  // Effective ordered tabs. Prefer the new per-tab config that with order and
  // player visibility, otherwise get from the old model (visible in order with a
  // second array for hidden).
  const savedTabs = settings?.tabs;
  let tabs: TabConfig[];
  if (savedTabs && Object.keys(savedTabs).length) {
    const present = new Set<string>();
    tabs = Object.values(savedTabs)
      .filter((entry) => registry[entry.key])
      .sort((a, b) => a.order - b.order)
      .map<TabConfig>((entry) => {
        present.add(entry.key);
        return {
          id: entry.key,
          title: registry[entry.key].title,
          iconClass: registry[entry.key].iconClass,
          show: entry.show,
          order: entry.order,
          visibilityLevel: entry.visibilityLevel,
        };
      });

    const defaultVisibility =
      VisibilityLevels.getDefaultLevelValue(documentName);
    const afterMaxConfiguredOrder =
      tabs.reduce<number>((prev, curr) => Math.max(prev, curr.order), 0) + 1000;

    // Append any newly-registered tabs not yet in the saved config
    for (const tab of Object.values(registry)) {
      if (!present.has(tab.id)) {
        tabs.push({
          id: tab.id,
          title: tab.title,
          iconClass: tab.iconClass,
          show: true,
          order: afterMaxConfiguredOrder + tabs.length,
          visibilityLevel: defaultVisibility,
        });
      }
    }
  } else {
    tabs = buildTabConfigEntries(registry, settings?.tabs ?? {}, documentName);
  }

  const allTabs = Object.values(registry).reduce<Record<string, TabInfo>>(
    (prev, tab) => {
      prev[tab.id] = { ...tab };
      return prev;
    },
    {},
  );

  return {
    documentName: documentName,
    documentType: type,
    title: configSectionTitle,
    allTabs,
    defaultTabs,
    tabs,
    docTypeKeyOverride,
  };
}

/**
 * Create the saved tab configuration using the current tab list,
 * with sort order and player visibility level.
 */
export function buildTabConfigMap(
  tabs: TabConfig[],
): Record<string, SheetTabConfigEntry> {
  return tabs.reduce<Record<string, SheetTabConfigEntry>>((prev, tab) => {
    prev[tab.id] = {
      key: tab.id,
      order: tab.order,
      show: tab.show,
      visibilityLevel: tab.visibilityLevel ?? null,
    };
    return prev;
  }, {});
}

/**
 * Combine all tabs into one list: first the selected tabs (in order, `show: true`),
 * then the rest (in any order, `show: false`).
 * TODO: Migrate off legacy selected/unselected arrays.
 */
function buildTabConfigEntries(
  all: Record<string, TabInfo>,
  settings: Record<string, SheetTabConfigEntry>,
  documentName: string,
): TabConfig[] {
  const configured = Object.values(settings).reduce<TabConfig[]>(
    (tabs, tab) => {
      const tabInfo = all[tab.key];

      if (tabInfo) {
        tabs.push({
          ...tabInfo,
          show: tab.show,
          visibilityLevel: tab.visibilityLevel,
          order: tab.order,
        });
      }

      return tabs;
    },
    [],
  );

  const defaultVisibility = VisibilityLevels.getDefaultLevelValue(documentName);
  const afterMaxConfiguredOrder =
    configured.reduce((prev, curr) => Math.max(prev, curr.order), 0) + 1000;

  const additional = Object.values(all).reduce<TabConfig[]>((tabs, tab) => {
    // Include tab info if it was not configured already
    if (!settings[tab.id]) {
      tabs.push({
        ...tab,
        show: true,
        visibilityLevel: defaultVisibility,
        order: afterMaxConfiguredOrder + tabs.length + 1,
      });
    }

    return tabs;
  }, []);

  return [...configured, ...additional].sort((a, b) => a.order - b.order);
}

/**
 * Given a tab config entry, create a stable snapshot model.
 */
export function mapTabConfigContextEntryToSnapshot(
  entry: TabConfigContextEntry,
): TabConfigSnapshot {
  return {
    title: entry.title,
    documentName: entry.documentName,
    documentType: entry.documentType,
    docTypeKeyOverride: entry.docTypeKeyOverride ?? null,
    sidebarExpandedByTabId: entry.sidebarExpandedByTabId,
    ...getCanonicalTabSelection(entry),
  };
}

/**
 * Searches an array of initial snapshot entries, finds a match by
 * tab ID, and rebuilds the tab configurations from the initial data.
 * Returns the rebuilt context entry restored to the found initial
 * settings, else returns the config that was provided when no initial entry
 * is found.
 */
export function getInitialTabConfigContextEntry(
  initialEntries: TabConfigSnapshot[],
  entry: TabConfigContextEntry,
): TabConfigContextEntry {
  const initialEntry = initialEntries.find(
    (i) =>
      i.documentName === entry.documentName &&
      i.documentType === entry.documentType &&
      (i.docTypeKeyOverride ?? null) === (entry.docTypeKeyOverride ?? null),
  );

  if (!initialEntry) {
    return entry;
  }

  // Rebuild tabs and replace
  const currentTabs = new Map<string, TabConfig>(
    entry.tabs.map((tab) => [tab.id, tab]),
  );

  const tabs = initialEntry.tabs.reduce<TabConfig[]>((prev, tab) => {
    const currentTab = currentTabs.get(tab.id);

    if (currentTab) {
      prev.push({
        ...currentTab,
        ...tab,
      });
    }

    return prev;
  }, []);

  return {
    ...entry,
    sidebarExpandedByTabId: initialEntry.sidebarExpandedByTabId,
    tabs: tabs,
  };
}
