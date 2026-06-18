import {
  buildTabConfigMap,
  getActorTabContext,
  getCanonicalTabSelection,
  getItemTabContext,
} from 'src/applications/tab-configuration/tab-configuration-functions';
import type {
  ConfigTabInfo,
  TabConfigContextEntry,
  VisibilityLevelConfig,
} from 'src/applications/tab-configuration/tab-configuration.types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { settings } from 'src/settings/settings.svelte';
import type { TabConfiguration } from 'src/settings/settings.types';
import type { SettingsEditor } from './settings-editors.svelte';

export type WorldTabConfigurationSettingsEditor = SettingsEditor<
  TabConfigContextEntry[]
> & {
  resetEntryToDefault(documentName: string, documentType: string): void;
  undoEntryChanges(documentName: string, documentType: string): void;
};

export function getWorldTabConfigurationSettingsEditor(): WorldTabConfigurationSettingsEditor {
  const current = $state<TabConfigContextEntry[]>(getConfig());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  /**
   * Canonical, order-independent snapshot of every sheet type's tab selection.
   * SortableListbox rewrites visibilityLevels in display order on mount, so a
   * raw JSON.stringify of `_config` would always look dirty.
   */
  function snapshotConfig(config: TabConfigContextEntry[]) {
    return $state.snapshot(config).map((entry) => ({
      documentName: entry.documentName,
      documentType: entry.documentType,
      docTypeKeyOverride: entry.docTypeKeyOverride ?? null,
      ...getCanonicalTabSelection(entry),
    }));
  }

  function getConfig(settingOverride?: TabConfiguration) {
    let setting = settingOverride ?? settings.value.tabConfiguration;

    let config: TabConfigContextEntry[] = [];

    let actorConfigs = setting?.[CONSTANTS.DOCUMENT_NAME_ACTOR];

    config.push(
      getActorTabContext(
        CharacterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_CHARACTER,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_CHARACTER],
        false,
      ),
    );

    const characterSidebarContext = getActorTabContext(
      CharacterSheetQuadroneSidebarRuntime,
      CONSTANTS.SHEET_TYPE_CHARACTER,
      actorConfigs?.[CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR],
      false,
      CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    );

    characterSidebarContext.title = FoundryAdapter.localize(
      'TIDY5E.Character.Sidebar.Title',
    );

    config.push(characterSidebarContext);

    config.push(
      getActorTabContext(
        NpcSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_NPC,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_NPC],
        false,
      ),
    );

    config.push(
      getActorTabContext(
        GroupSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_GROUP,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_GROUP],
        false,
      ),
    );

    config.push(
      getActorTabContext(
        EncounterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_ENCOUNTER,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_ENCOUNTER],
        false,
      ),
    );

    config.push(
      getActorTabContext(
        VehicleSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_VEHICLE,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_VEHICLE],
        false,
      ),
    );

    let itemConfigs = setting?.[CONSTANTS.DOCUMENT_NAME_ITEM];

    let allItemTypes = ItemSheetQuadroneRuntime.getSheetTypes();
    for (let type of allItemTypes) {
      config.push(getItemTabContext(type, itemConfigs?.[type], false));
    }

    return config;
  }

  function getDefaultEntry(entry: TabConfigContextEntry) {
    return {
      ...entry,
      tabs: entry.defaultTabs.map((t) => ({ ...t })),
      visibilityLevels: entry.visibilityLevels.map((l) => ({
        ...l,
        visibilityLevel: null,
      })),
    };
  }

  async function save() {
    let toSave = current.reduce<TabConfiguration>((prev, curr) => {
      let docName = (prev[curr.documentName] ??= {});

      // When the tab array exactly matches the default (order + show), exclude
      // that sheet type from settings, which represents taking the default tabs.
      const matchesDefault =
        curr.tabs.length === curr.defaultTabs.length &&
        curr.tabs.every((t, i) => {
          const d = curr.defaultTabs[i];
          return d && d.id === t.id && d.show === t.show;
        });

      const hasVisibilityOverride = curr.visibilityLevels.some(
        (l) => l.visibilityLevel != null,
      );

      if (!matchesDefault || hasVisibilityOverride) {
        const docTypeKey = curr.docTypeKeyOverride ?? curr.documentType;
        const selectedIds = curr.tabs.filter((t) => t.show).map((t) => t.id);

        docName[docTypeKey] = {
          // Legacy fields kept in sync for any sheets not yet migrated.
          // TODO: Drop these once all reads go through the keyed `tabs` map.
          selected: matchesDefault ? [] : selectedIds,
          visibilityLevels: curr.visibilityLevels.reduce(
            (levels, level) => {
              levels[level.id] = level.visibilityLevel;
              return levels;
            },
            {} as Record<string, number | null>,
          ),

          tabs: matchesDefault
            ? {}
            : buildTabConfigMap(curr.tabs, curr.visibilityLevels),
        };
      }

      return prev;
    }, {});

    await FoundryAdapter.setTidySetting('tabConfiguration', toSave);
  }

  function getInitialEntry(
    initial: ReturnType<typeof snapshotConfig>,
    entry: TabConfigContextEntry,
  ) {
    const initialEntry = initial.find(
      (i) =>
        i.documentName === entry.documentName &&
        i.documentType === entry.documentType,
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

    const visibilityLevels = Object.entries(
      initialEntry.visibilityLevels,
    ).reduce<VisibilityLevelConfig[]>((prev, [tabId, level]) => {
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
      tabs: tabs,
      visibilityLevels: visibilityLevels,
    };
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    resetToDefault() {
      this.value = this.value.map((entry) => getDefaultEntry(entry));
    },

    resetEntryToDefault(
      documentName: string,
      documentType: string,
      // docTypeKeyOverride?: string,
    ) {
      for (const [index, entry] of this.value.entries()) {
        if (
          entry.documentName === documentName &&
          entry.documentType === documentType
          // &&
          // entry.docTypeKeyOverride === docTypeKeyOverride
        ) {
          this.value[index] = getDefaultEntry(entry);

          return;
        }
      }
    },

    async save() {
      await save();
      this.value = getConfig();
      initialSnapshot = JSON.stringify(snapshotConfig(this.value));
    },

    canUndo: true,

    canUseDefault: true,

    useDefaultLabel: undefined,

    async useDefault() {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
        },
        content: `<p>${FoundryAdapter.localize(
          'TIDY5E.UseDefaultDialog.text',
        )}</p>`,
      });

      if (!proceed) {
        return;
      }

      this.resetToDefault();
    },

    undoChanges() {
      const initial = JSON.parse(initialSnapshot) as ReturnType<
        typeof snapshotConfig
      >;

      this.value = this.value.map((entry) => getInitialEntry(initial, entry));
    },

    undoEntryChanges(documentName: string, documentType: string) {
      const initial = JSON.parse(initialSnapshot) as ReturnType<
        typeof snapshotConfig
      >;

      for (const [index, entry] of this.value.entries()) {
        if (
          entry.documentName === documentName &&
          entry.documentType === documentType
        ) {
          this.value[index] = getInitialEntry(initial, entry);
          break;
        }
      }
    },

    get value() {
      return current;
    },

    set value(value: TabConfigContextEntry[]) {
      current.length = 0;
      current.push(...value);
    },
  };
}
