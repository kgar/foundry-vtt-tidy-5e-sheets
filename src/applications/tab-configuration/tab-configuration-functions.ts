import { CONSTANTS } from 'src/constants';
import type {
  ConfigTabInfo,
  TabConfigContextEntry,
  VisibilityLevelConfig,
} from './tab-configuration.types';
import type { SheetTabConfiguration } from 'src/settings/settings.types';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import type { RegisteredTab } from 'src/runtime/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';
import type { CustomTabTitle } from 'src/api';

export function getItemTabContext(
  type: string,
  settings: SheetTabConfiguration | undefined | null
) {
  const documentName = CONSTANTS.DOCUMENT_NAME_ITEM;

  let defaultSelectedIds =
    getWorldDefaultSelectedTabId(documentName, type) ??
    ItemSheetQuadroneRuntime.getDefaultTabIds(type);
  let allRegisteredTabs = ItemSheetQuadroneRuntime.getAllRegisteredTabs(type);

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds
  );
}

export function getActorTabContext(
  runtime: ActorSheetQuadroneRuntime<any>,
  type: string,
  settings: SheetTabConfiguration | undefined | null
): TabConfigContextEntry {
  let documentName = CONSTANTS.DOCUMENT_NAME_ACTOR;
  const allRegisteredTabs = runtime.getAllRegisteredTabs();
  let defaultSelectedIds =
    getWorldDefaultSelectedTabId(documentName, type) ??
    runtime.getDefaultTabIds();

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds
  );
}

function getWorldDefaultSelectedTabId(
  documentName: string,
  type: string
): string[] | undefined {
  const selected =
    SettingsProvider.settings.tabConfiguration.get()?.[documentName]?.[type]
      ?.selected;

  if (selected?.length > 0) {
    return selected;
  }
}

export function buildTabConfigContextEntry(
  documentName: string,
  type: string,
  allRegisteredTabs: { id: string; title: CustomTabTitle }[],
  settings: SheetTabConfiguration | undefined | null,
  defaultSelectedIds: string[]
): TabConfigContextEntry {
  let configSectionTitle = FoundryAdapter.localize(
    `TYPES.${documentName}.${type}`
  );

  let allTabs = allRegisteredTabs.reduce<Record<string, ConfigTabInfo>>(
    (prev, tab) => {
      prev[tab.id] = {
        id: tab.id,
        title: FoundryAdapter.localize(
          typeof tab.title === 'function' ? tab.title() : tab.title
        ).titleCase(),
      };
      return prev;
    },
    {}
  );

  const effectiveSelections =
    settings?.selected.filter((tabId) =>
      allRegisteredTabs.some((t) => t.id === tabId)
    ) ?? [];

  let selected = mapTabIdsToOptions(allTabs, effectiveSelections);

  let defaultSelected = mapTabIdsToOptions(allTabs, defaultSelectedIds);

  if (!selected.length) {
    selected = [...defaultSelected];
  }

  const visibilityLevels: VisibilityLevelConfig[] = Object.values(allTabs).map(
    (t) => ({
      id: t.id,
      title: t.title,
      visibilityLevel: settings?.visibilityLevels[t.id] ?? null,
    })
  );

  return {
    documentName: documentName,
    documentType: type,
    title: configSectionTitle,
    allTabs,
    defaultSelected,
    defaultUnselected: getUnselectedTabs(allTabs, defaultSelected),
    selected: selected,
    unselected: getUnselectedTabs(allTabs, selected),
    visibilityLevels,
  };
}

function mapTabIdsToOptions(
  all: Record<string, ConfigTabInfo>,
  tabIds: string[]
) {
  return tabIds.map<ConfigTabInfo>((tabId) => ({
    id: tabId,
    title: all[tabId]?.title ?? tabId,
  }));
}

function getUnselectedTabs(
  all: Record<string, ConfigTabInfo>,
  selected: ConfigTabInfo[]
) {
  return Object.values(all)
    .filter((tab) => !selected.some((selectedTab) => selectedTab.id == tab.id))
    .map<ConfigTabInfo>((t) => ({
      id: t.id,
      title: all[t.id]?.title ?? t.id,
    }));
}
