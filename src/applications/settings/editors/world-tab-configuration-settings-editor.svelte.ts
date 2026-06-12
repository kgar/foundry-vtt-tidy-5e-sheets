import {
  buildTabConfigMap,
  getActorTabContext,
  getCanonicalTabSelection,
  getItemTabContext,
} from 'src/applications/tab-configuration/tab-configuration-functions';
import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
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
>;

export function getWorldTabConfigurationSettingsEditor(): WorldTabConfigurationSettingsEditor {
  const current = $state<TabConfigContextEntry[]>([]);

  let initialSnapshot = $state<string>('');

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  /**
   * Canonical, order-independent snapshot of every sheet type's tab selection.
   * SortableListbox rewrites visibilityLevels in display order on mount, so a
   * raw JSON.stringify of `_config` would always look dirty.
   */
  function snapshotConfig(config: TabConfigContextEntry[]): string {
    return JSON.stringify(
      $state.snapshot(config).map((entry) => ({
        documentName: entry.documentName,
        documentType: entry.documentType,
        docTypeKeyOverride: entry.docTypeKeyOverride ?? null,
        ...getCanonicalTabSelection(entry),
      })),
    );
  }

  function getConfig() {
    let setting = settings.value.tabConfiguration;

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

  return {
    get hasChanges() {
      return hasChanges;
    },

    initialize() {
      this.value = getConfig();
      initialSnapshot = snapshotConfig(this.value);
    },

    resetToDefault() {
      this.value = this.value.map((entry) => ({
        ...entry,
        tabs: entry.defaultTabs.map((t) => ({ ...t })),
        visibilityLevels: entry.visibilityLevels.map((l) => ({
          ...l,
          visibilityLevel: null,
        })),
      }));
    },

    async save() {
      await save();
      this.initialize();
    },

    canUndo: false,

    canUseDefault: false,

    useDefaultLabel: undefined,

    async useDefault() {
      // noop
    },

    undoChanges() {
      // noop
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
