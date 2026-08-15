import { CONSTANTS } from 'src/constants';
import type { RegisteredTab } from 'src/runtime/types';
import type { CharacterSheetQuadroneContext } from 'src/types/types';
import type { SheetTabsConfiguration } from './settings.types';
import {
  buildTabConfigContextEntry,
  buildTabConfigMap,
} from './editors/shared/tab-configuration-functions';
import type { TabConfigContextEntry } from './editors/shared/tab-configuration.types';
import { settings } from './settings.svelte';

const COMBINED_TAB_ID = CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS_TRAITS;
const SKILLS_TAB_ID = CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS;
const TRAITS_TAB_ID = CONSTANTS.TAB_TRAITS;

export function getDefaultSkillsTraitsCombined(): boolean {
  return true;
}

function getWorldSidebarTabConfiguration(): SheetTabsConfiguration | undefined {
  return settings.value.tabConfiguration?.[CONSTANTS.DOCUMENT_NAME_ACTOR]?.[
    CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR
  ];
}

export function getSkillsTraitsCombined(
  config?: SheetTabsConfiguration | null,
): boolean {
  if (config?.skillsTraitsCombined != null) {
    return config.skillsTraitsCombined;
  }

  const worldOverride = getWorldSidebarTabConfiguration()?.skillsTraitsCombined;
  if (worldOverride != null) {
    return worldOverride;
  }

  return getDefaultSkillsTraitsCombined();
}

export function isCharacterSidebarSkillsTraitsTab(tabId: string): boolean {
  return (
    tabId === COMBINED_TAB_ID ||
    tabId === SKILLS_TAB_ID ||
    tabId === TRAITS_TAB_ID
  );
}

export function isCharacterSidebarTabValid(
  tabId: string,
  skillsTraitsCombined: boolean,
): boolean {
  if (!isCharacterSidebarSkillsTraitsTab(tabId)) {
    return true;
  }

  if (skillsTraitsCombined) {
    return tabId === COMBINED_TAB_ID;
  }

  return tabId === SKILLS_TAB_ID || tabId === TRAITS_TAB_ID;
}

export function filterCharacterSidebarTabs<
  TContext extends CharacterSheetQuadroneContext,
>(tabs: RegisteredTab<TContext>[], skillsTraitsCombined: boolean) {
  return tabs.filter((tab) =>
    isCharacterSidebarTabValid(tab.id, skillsTraitsCombined),
  );
}

export function getCharacterSidebarDefaultTabIds(
  skillsTraitsCombined: boolean,
): string[] {
  if (skillsTraitsCombined) {
    return [CONSTANTS.TAB_FAVORITES, COMBINED_TAB_ID];
  }

  return [CONSTANTS.TAB_FAVORITES, SKILLS_TAB_ID, TRAITS_TAB_ID];
}

export function getCharacterSidebarTabContext(
  allRegisteredTabs: RegisteredTab<CharacterSheetQuadroneContext>[],
  type: string,
  settings: SheetTabsConfiguration | undefined | null,
  options?: { useWorldAsDefault?: boolean },
): TabConfigContextEntry {
  const skillsTraitsCombined = getSkillsTraitsCombined(settings);
  const migratedSettings = migrateLegacySidebarTabConfiguration(
    settings,
    skillsTraitsCombined,
  );
  const filteredTabs = filterCharacterSidebarTabs(
    allRegisteredTabs,
    skillsTraitsCombined,
  );

  const entry = buildTabConfigContextEntry(
    CONSTANTS.DOCUMENT_NAME_ACTOR,
    type,
    filteredTabs.map(({ id, title, iconClass }) => ({ id, title, iconClass })),
    migratedSettings,
    CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
  );

  entry.skillsTraitsCombined = skillsTraitsCombined;
  entry.defaultSkillsTraitsCombined = options?.useWorldAsDefault
    ? getSkillsTraitsCombined(null)
    : getDefaultSkillsTraitsCombined();

  return entry;
}

/**
 * Maps a saved config keyed by the old `TAB_TRAITS` tab ID onto whichever
 * tab ID is currently valid for the effective layout, so pre-existing
 * player configurations survive the split.
 */
function migrateLegacySidebarTabConfiguration(
  settings: SheetTabsConfiguration | undefined | null,
  skillsTraitsCombined: boolean,
): SheetTabsConfiguration | undefined | null {
  if (!settings?.tabs) {
    return settings;
  }

  const tabs = { ...settings.tabs };

  if (skillsTraitsCombined) {
    const legacyTraits = tabs[TRAITS_TAB_ID];
    const combined = tabs[COMBINED_TAB_ID];

    if (legacyTraits && !combined) {
      tabs[COMBINED_TAB_ID] = { ...legacyTraits, key: COMBINED_TAB_ID };
      delete tabs[TRAITS_TAB_ID];
      return { ...settings, tabs };
    }

    return settings;
  }

  const legacyTraits = tabs[TRAITS_TAB_ID];
  const skills = tabs[SKILLS_TAB_ID];

  if (legacyTraits && !skills) {
    tabs[SKILLS_TAB_ID] = {
      ...legacyTraits,
      key: SKILLS_TAB_ID,
      order: legacyTraits.order,
    };
  }

  return { ...settings, tabs };
}

/**
 * When the layout is toggled, carries over each affected tab's order,
 * visibility, and show state onto its counterpart(s) in the new layout,
 * so switching layouts doesn't reset the user's existing arrangement.
 */
function migrateSkillsTraitsTabConfig(
  savedTabs: Record<string, SheetTabsConfiguration['tabs'][string]>,
  previousCombined: boolean,
  nextCombined: boolean,
  oldTabsById: Map<string, TabConfigContextEntry['tabs'][number]>,
) {
  if (!previousCombined && nextCombined) {
    const skills = oldTabsById.get(SKILLS_TAB_ID);
    const traits = oldTabsById.get(TRAITS_TAB_ID);

    if (skills || traits) {
      savedTabs[COMBINED_TAB_ID] = {
        key: COMBINED_TAB_ID,
        order: Math.min(skills?.order ?? 99, traits?.order ?? 99),
        show: (skills?.show ?? false) || (traits?.show ?? false),
        visibilityLevel: Math.max(
          skills?.visibilityLevel ?? 0,
          traits?.visibilityLevel ?? 0,
        ),
      };
    }

    delete savedTabs[SKILLS_TAB_ID];
    delete savedTabs[TRAITS_TAB_ID];
    return;
  }

  if (previousCombined && !nextCombined) {
    const combined = oldTabsById.get(COMBINED_TAB_ID);
    if (combined) {
      savedTabs[SKILLS_TAB_ID] = {
        key: SKILLS_TAB_ID,
        order: combined.order,
        show: combined.show,
        visibilityLevel: combined.visibilityLevel,
      };
      savedTabs[TRAITS_TAB_ID] = {
        key: TRAITS_TAB_ID,
        order: combined.order + 1,
        show: combined.show,
        visibilityLevel: combined.visibilityLevel,
      };
    }
    delete savedTabs[COMBINED_TAB_ID];
  }
}

export function rebuildCharacterSidebarTabConfigEntry(
  entry: TabConfigContextEntry,
  skillsTraitsCombined: boolean,
  allRegisteredTabs: RegisteredTab<CharacterSheetQuadroneContext>[],
) {
  const previousCombined =
    entry.skillsTraitsCombined ?? getSkillsTraitsCombined(null);
  const oldTabsById = new Map(entry.tabs.map((tab) => [tab.id, tab]));
  const savedTabs = buildTabConfigMap(entry.tabs);

  for (const tabId of Object.keys(savedTabs)) {
    if (!isCharacterSidebarTabValid(tabId, skillsTraitsCombined)) {
      delete savedTabs[tabId];
    }
  }

  migrateSkillsTraitsTabConfig(
    savedTabs,
    previousCombined,
    skillsTraitsCombined,
    oldTabsById,
  );

  const rebuilt = getCharacterSidebarTabContext(
    allRegisteredTabs,
    entry.documentType,
    {
      tabs: savedTabs,
      skillsTraitsCombined,
    },
  );

  entry.tabs = rebuilt.tabs;
  entry.defaultTabs = rebuilt.defaultTabs;
  entry.allTabs = rebuilt.allTabs;
  entry.skillsTraitsCombined = skillsTraitsCombined;
}
