import { CONSTANTS } from 'src/constants';
import type {
  ConfigTabInfo,
  TabConfigContextEntry,
  VisibilityLevelConfig,
} from './tab-configuration.types';
import type { SheetTabConfiguration } from 'src/settings/settings.types';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';
import type { CustomTabTitle } from 'src/api/tab/CustomTabBase';

export function getItemTabContext(
  type: string,
  settings: SheetTabConfiguration | undefined | null,
  useWorldSettings: boolean
) {
  const documentName = CONSTANTS.DOCUMENT_NAME_ITEM;

  let defaultSelectedIds = ItemSheetQuadroneRuntime.getDefaultTabIds(type);
  let worldDefaultSelectedIds = useWorldSettings
    ? getWorldDefaultSelectedTabIds(documentName, type) ?? [
        ...defaultSelectedIds,
      ]
    : undefined;
  let allRegisteredTabs = ItemSheetQuadroneRuntime.getAllRegisteredTabs(type);

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds,
    worldDefaultSelectedIds
  );
}

export function getActorTabContext(
  runtime: ActorSheetQuadroneRuntime<any>,
  type: string,
  settings: SheetTabConfiguration | undefined | null,
  useWorldSettings: boolean,
  docTypeKeyOverride?: string
): TabConfigContextEntry {
  let documentName = CONSTANTS.DOCUMENT_NAME_ACTOR;
  const allRegisteredTabs = runtime.getAllRegisteredTabs();
  let defaultSelectedIds = runtime.getDefaultTabIds();
  let worldDefaultSelectedIds = useWorldSettings
    ? getWorldDefaultSelectedTabIds(documentName, type, docTypeKeyOverride) ?? [
        ...defaultSelectedIds,
      ]
    : undefined;

  return buildTabConfigContextEntry(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds,
    worldDefaultSelectedIds,
    docTypeKeyOverride
  );
}

function getWorldDefaultSelectedTabIds(
  documentName: string,
  type: string,
  typeOverride?: string
): string[] | undefined {
  const selected =
    SettingsProvider.settings.tabConfiguration.get()?.[documentName]?.[
      typeOverride ?? type
    ]?.selected;

  if (selected?.length > 0) {
    return selected;
  }
}

export function buildTabConfigContextEntry(
  documentName: string,
  type: string,
  allRegisteredTabs: { id: string; title: CustomTabTitle }[],
  settings: SheetTabConfiguration | undefined | null,
  defaultSelectedIds: string[],
  worldDefaultSelectedIds?: string[],
  docTypeKeyOverride?: string
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

  if (worldDefaultSelectedIds) {
    let worldDefaultSelected = mapTabIdsToOptions(
      allTabs,
      worldDefaultSelectedIds
    );

    if (worldDefaultSelected.length) {
      defaultSelected = worldDefaultSelected;
    }
  }

  if (!selected.length) {
    selected = [...defaultSelected];
  }

  const visibilityLevels: VisibilityLevelConfig[] = Object.values(allTabs)
    .map((t) => ({
      id: t.id,
      title: t.title,
      visibilityLevel: settings?.visibilityLevels[t.id] ?? null,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, game.i18n.lang));

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
    docTypeKeyOverride,
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
