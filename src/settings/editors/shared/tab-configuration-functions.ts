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
import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
import type { CustomTabTitle } from 'src/api/tab/CustomTabBase';

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

type GetItemTabContextParams = {
  type: string;
  settings?: SheetTabsConfiguration | null;
  defaultSettings?: SheetTabsConfiguration | null;
};

export function getItemTabContext(params: GetItemTabContextParams) {
  const { type, settings, defaultSettings } = params;

  const documentName = CONSTANTS.DOCUMENT_NAME_ITEM;

  let defaultTabIds = new Set(ItemSheetQuadroneRuntime.getDefaultTabIds(type));
  let allRegisteredTabs = ItemSheetQuadroneRuntime.getAllRegisteredTabs(
    type,
  ).map((tab) => ({
    defaultIncluded: defaultTabIds.has(tab.id),
    id: tab.id,
    title: tab.title,
    iconClass: tab.iconClass,
  }));

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSettings,
  );
}

type GetActorTabContextParams = {
  runtime: ActorSheetQuadroneRuntime<any>;
  type: string;
  settings?: SheetTabsConfiguration | null;
  defaultSettings?: SheetTabsConfiguration | null;
  docTypeKeyOverride?: string;
};

export function getActorTabContext(
  params: GetActorTabContextParams,
): TabConfigContextEntry {
  const { runtime, type, settings, docTypeKeyOverride, defaultSettings } =
    params;

  const documentName = CONSTANTS.DOCUMENT_NAME_ACTOR;
  const defaultTabIds = new Set(runtime.getDefaultTabIds());
  const allRegisteredTabs: RegisteredDefaultTabInfo[] = runtime
    .getAllRegisteredTabs()
    .map((tab) => ({
      defaultIncluded: defaultTabIds.has(tab.id),
      id: tab.id,
      title: tab.title,
      iconClass: tab.iconClass,
    }));

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSettings,
    docTypeKeyOverride,
  );
}

type RegisteredDefaultTabInfo = {
  id: string;
  title: CustomTabTitle;
  iconClass?: string;
  defaultIncluded: boolean;
};

function buildTabConfigContextEntry(
  documentName: string,
  type: string,
  allRegisteredTabs: RegisteredDefaultTabInfo[],
  settings: SheetTabsConfiguration | undefined | null,
  defaultSettings: SheetTabsConfiguration | undefined | null,
  docTypeKeyOverride?: string,
): TabConfigContextEntry {
  let configSectionTitle = FoundryAdapter.localize(
    `TYPES.${documentName}.${type}`,
  );

  const registry = allRegisteredTabs.reduce<
    Record<string, TabInfo & { defaultIncluded: boolean }>
  >((prev, tab) => {
    prev[tab.id] = {
      id: tab.id,
      title: FoundryAdapter.localize(
        typeof tab.title === 'function' ? tab.title() : tab.title,
      ).titleCase(),
      iconClass: tab.iconClass,
      defaultIncluded: tab.defaultIncluded,
    };
    return prev;
  }, {});

  const defaultVisibility = VisibilityLevels.getDefaultLevelValue(documentName);

  const defaultTabs = BuildTabConfigs(
    defaultSettings,
    registry,
    defaultVisibility,
  );

  const tabs = BuildTabConfigs(settings, registry, defaultVisibility);

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

function BuildTabConfigs(
  settings: SheetTabsConfiguration | undefined | null,
  registry: Record<string, TabInfo & { defaultIncluded: boolean }>,
  defaultVisibility: number,
) {
  let defaultTabs: TabConfig[] = [];
  const present = new Set<string>();
  const savedTabs = settings?.tabs;
  if (!!savedTabs && Object.keys(settings).length) {
    defaultTabs = Object.values(savedTabs)
      .filter((entry) => registry[entry.key])
      .sort((a, b) => a.order - b.order)
      .map((entry) => {
        present.add(entry.key);
        return {
          id: entry.key,
          order: entry.order,
          show: entry.show,
          title: registry[entry.key].title,
          visibilityLevel: entry.visibilityLevel ?? defaultVisibility,
          iconClass: registry[entry.key].iconClass,
        };
      });
  }

  const afterMaxDefaultConfiguredOrder =
    defaultTabs.reduce<number>((prev, curr) => Math.max(prev, curr.order), 0) +
    1;

  // Append any newly-registered tabs not yet in the saved config
  for (const tab of Object.values(registry)) {
    if (!present.has(tab.id)) {
      defaultTabs.push({
        id: tab.id,
        title: tab.title,
        iconClass: tab.iconClass,
        show: tab.defaultIncluded,
        order: afterMaxDefaultConfiguredOrder + defaultTabs.length,
        visibilityLevel: defaultVisibility,
      });
    }
  }

  return defaultTabs;
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
