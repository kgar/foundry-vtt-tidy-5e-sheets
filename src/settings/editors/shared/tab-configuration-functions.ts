import { CONSTANTS } from 'src/constants';
import type {
  ConfigTabInfo,
  TabConfigContextEntry,
  TabConfigSnapshot,
  TabInfo,
  VisibilityLevelConfig,
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

/**
 * {@link TabConfigContextEntry} stores the tab order and who can see them.
 * It contains the full list of tabs (with their ids and show/hide state)
 * and a map of viewer visibility levels by tab ID.
 */
export function getCanonicalTabSelection(entry: TabConfigContextEntry): {
  tabs: { id: string; show: boolean }[];
  visibilityLevels: Record<string, number | null>;
} {
  const visibilityLevels: Record<string, number | null> = {};

  for (const level of [...entry.visibilityLevels].sort((a, b) =>
    a.id.localeCompare(b.id),
  )) {
    visibilityLevels[level.id] = level.visibilityLevel;
  }

  return {
    tabs: entry.tabs.map((tab) => ({ id: tab.id, show: tab.show })),
    visibilityLevels,
  };
}

export function getItemTabContext(
  type: string,
  settings: SheetTabsConfiguration | undefined | null,
  useWorldSettings: boolean,
) {
  const documentName = CONSTANTS.DOCUMENT_NAME_ITEM;

  let defaultSelectedIds = ItemSheetQuadroneRuntime.getDefaultTabIds(type);
  let worldDefaultSelectedIds = useWorldSettings
    ? (getWorldDefaultSelectedTabIds(documentName, type) ?? [
        ...defaultSelectedIds,
      ])
    : undefined;
  let allRegisteredTabs = ItemSheetQuadroneRuntime.getAllRegisteredTabs(type);

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds,
    worldDefaultSelectedIds,
  );
}

export function getActorTabContext(
  runtime: ActorSheetQuadroneRuntime<any>,
  type: string,
  settings: SheetTabsConfiguration | undefined | null,
  useWorldSettings: boolean,
  docTypeKeyOverride?: string,
): TabConfigContextEntry {
  let documentName = CONSTANTS.DOCUMENT_NAME_ACTOR;
  const allRegisteredTabs = runtime.getAllRegisteredTabs();
  let defaultSelectedIds = runtime.getDefaultTabIds();
  let worldDefaultSelectedIds = useWorldSettings
    ? (getWorldDefaultSelectedTabIds(
        documentName,
        type,
        docTypeKeyOverride,
      ) ?? [...defaultSelectedIds])
    : undefined;

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds,
    worldDefaultSelectedIds,
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
  defaultSelectedIds: string[],
  worldDefaultSelectedIds?: string[],
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

  // Check world defaults when present.
  const defaultSelectedIdsEffective = worldDefaultSelectedIds?.length
    ? worldDefaultSelectedIds
    : defaultSelectedIds;

  const defaultTabs = buildOrderedTabs(registry, defaultSelectedIdsEffective);

  // Effective ordered tabs. Prefer the new per-tab config that with order and
  // player visibility, otherwise get from the old model (visible in order with a
  // second array for hidden).
  const savedTabs = settings?.tabs;
  let tabs: ConfigTabInfo[];
  if (savedTabs && Object.keys(savedTabs).length) {
    const present = new Set<string>();
    tabs = Object.values(savedTabs)
      .filter((entry) => registry[entry.key])
      .sort((a, b) => a.order - b.order)
      .map<ConfigTabInfo>((entry) => {
        present.add(entry.key);
        return {
          id: entry.key,
          title: registry[entry.key].title,
          iconClass: registry[entry.key].iconClass,
          show: entry.show,
        };
      });
    // Append any newly-registered tabs not yet in the saved config (hidden).
    for (const tab of Object.values(registry)) {
      if (!present.has(tab.id)) {
        tabs.push({
          id: tab.id,
          title: tab.title,
          iconClass: tab.iconClass,
          show: false,
        });
      }
    }
  } else {
    const effectiveSelections =
      Object.entries(settings?.tabs ?? {})
        .filter(([tabId, setting]) => registry[tabId] && setting.show)
        .map(([tabId]) => tabId) ?? [];
    const effectiveSelectedIds = effectiveSelections.length
      ? effectiveSelections
      : defaultSelectedIdsEffective;
    tabs = buildOrderedTabs(registry, effectiveSelectedIds);
  }

  const showById = new Map(tabs.map((t) => [t.id, t.show]));
  const allTabs = Object.values(registry).reduce<Record<string, ConfigTabInfo>>(
    (prev, tab) => {
      prev[tab.id] = { ...tab, show: showById.get(tab.id) ?? false };
      return prev;
    },
    {},
  );

  // Per-tab visibility levels: prefer the value folded into the saved tabs map,
  // falling back to the legacy visibilityLevels map.
  // TODO: Migrate off legacy visibilityLevels
  const savedLevelByKey = new Map(
    Object.values(savedTabs ?? {}).map((entry) => [
      entry.key,
      entry.visibilityLevel,
    ]),
  );
  const visibilityLevels: VisibilityLevelConfig[] = Object.values(allTabs)
    .map((t) => ({
      id: t.id,
      title: t.title,
      iconClass: t.iconClass,
      show: t.show,
      visibilityLevel: savedLevelByKey.has(t.id)
        ? (savedLevelByKey.get(t.id) ?? null)
        : (settings?.tabs[t.id]?.visibilityLevel ?? null),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, game.i18n.lang));

  return {
    documentName: documentName,
    documentType: type,
    title: configSectionTitle,
    allTabs,
    defaultTabs,
    tabs,
    visibilityLevels,
    docTypeKeyOverride,
  };
}

/**
 * Create the saved tab configuration using the current tab list,
 * with sort order and player visibility level.
 */
export function buildTabConfigMap(
  tabs: { id: string; show: boolean }[],
  visibilityLevels: { id: string; visibilityLevel: number | null }[],
): Record<string, SheetTabConfigEntry> {
  const levelById = new Map(
    visibilityLevels.map((l) => [l.id, l.visibilityLevel]),
  );
  return tabs.reduce<Record<string, SheetTabConfigEntry>>(
    (prev, tab, order) => {
      prev[tab.id] = {
        key: tab.id,
        order,
        show: tab.show,
        visibilityLevel: levelById.get(tab.id) ?? null,
      };
      return prev;
    },
    {},
  );
}

/**
 * Combine all tabs into one list: first the selected tabs (in order, `show: true`),
 * then the rest (in any order, `show: false`).
 * TODO: Migrate off legacy selected/unselected arrays.
 */
function buildOrderedTabs(
  all: Record<string, TabInfo>,
  selectedIds: string[],
): ConfigTabInfo[] {
  const selectedSet = new Set(selectedIds);

  const selected = selectedIds
    .filter((tabId) => all[tabId])
    .map<ConfigTabInfo>((tabId) => ({
      id: tabId,
      title: all[tabId].title,
      iconClass: all[tabId].iconClass,
      show: true,
    }));

  const unselected = Object.values(all)
    .filter((tab) => !selectedSet.has(tab.id))
    .map<ConfigTabInfo>((tab) => ({
      id: tab.id,
      title: tab.title,
      iconClass: tab.iconClass,
      show: false,
    }));

  return [...selected, ...unselected];
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
  const currentTabs = new Map<string, ConfigTabInfo>(
    entry.tabs.map((tab) => [tab.id, tab]),
  );

  const tabs = initialEntry.tabs.reduce<ConfigTabInfo[]>((prev, tab) => {
    const currentTab = currentTabs.get(tab.id);

    if (currentTab) {
      prev.push({
        ...currentTab,
        ...tab,
      });
    }

    return prev;
  }, []);

  // Rebuild visibilityLevels and replace
  const currentVisibilityLevels = new Map<string, VisibilityLevelConfig>(
    entry.visibilityLevels.map((level) => [level.id, level]),
  );

  const visibilityLevels = Object.entries(initialEntry.visibilityLevels).reduce<
    VisibilityLevelConfig[]
  >((prev, [tabId, level]) => {
    const currentLevel = currentVisibilityLevels.get(tabId);

    if (currentLevel) {
      prev.push({
        ...currentLevel,
        visibilityLevel: level,
      });
    }

    return prev;
  }, []);

  return {
    ...entry,
    sidebarExpandedByTabId: initialEntry.sidebarExpandedByTabId,
    tabs: tabs,
    visibilityLevels: visibilityLevels,
  };
}
