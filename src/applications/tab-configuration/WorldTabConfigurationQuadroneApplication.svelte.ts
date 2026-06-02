import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import WorldTabConfigurationQuadrone from './WorldTabConfigurationQuadrone.svelte';
import { settings, SettingsProvider } from 'src/settings/settings.svelte';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import type { TabConfiguration } from 'src/settings/settings.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import type { TabConfigContextEntry } from './tab-configuration.types';
import {
  buildTabConfigContextEntry,
  getActorTabContext,
  getCanonicalTabSelection,
  getItemTabContext,
} from './tab-configuration-functions';
import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';
import type { SettingsPane } from 'src/applications/settings/settings-pane.types';

export type WorldTabConfigContext = TabConfigContextEntry[];

export class WorldTabConfigurationQuadroneApplication
  extends SvelteApplicationMixin<Partial<ApplicationConfiguration>>(
    foundry.applications.api.ApplicationV2
  )
  implements SettingsPane
{
  _config: WorldTabConfigContext = $state([]);

  _initialSnapshot = $state('');

  hasChanges = $derived(
    this._snapshotConfig($state.snapshot(this._config)) !==
      this._initialSnapshot
  );

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'world-tab-configuration',
    ],
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.SettingsMenu.TabConfiguration.label',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 750,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this._config = this._getConfig();
    this._resetToGlobalDefaults();

    const component = mount(WorldTabConfigurationQuadrone, {
      target: node,
      props: {
        app: this,
        config: this._config,
      },
    });

    return component;
  }

  _getConfig() {
    let setting = settings.value.tabConfiguration;

    let config: WorldTabConfigContext = [];

    let actorConfigs = setting?.[CONSTANTS.DOCUMENT_NAME_ACTOR];

    config.push(
      getActorTabContext(
        CharacterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_CHARACTER,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_CHARACTER],
        false
      )
    );

    const characterSidebarContext = getActorTabContext(
      CharacterSheetQuadroneSidebarRuntime,
      CONSTANTS.SHEET_TYPE_CHARACTER,
      actorConfigs?.[CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR],
      false,
      CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR
    );

    characterSidebarContext.title = FoundryAdapter.localize(
      'TIDY5E.Character.Sidebar.Title'
    );

    config.push(characterSidebarContext);

    config.push(
      getActorTabContext(
        NpcSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_NPC,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_NPC],
        false
      )
    );

    config.push(
      getActorTabContext(
        GroupSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_GROUP,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_GROUP],
        false
      )
    );

    config.push(
      getActorTabContext(
        EncounterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_ENCOUNTER,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_ENCOUNTER],
        false
      )
    );

    config.push(
      getActorTabContext(
        VehicleSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_VEHICLE,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_VEHICLE],
        false
      )
    );

    let itemConfigs = setting?.[CONSTANTS.DOCUMENT_NAME_ITEM];

    let allItemTypes = ItemSheetQuadroneRuntime.getSheetTypes();
    for (let type of allItemTypes) {
      config.push(getItemTabContext(type, itemConfigs?.[type], false));
    }

    return config;
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    let toSave = this._config.reduce<TabConfiguration>((prev, curr) => {
      let docName = (prev[curr.documentName] ??= {});

      // When selected tabs exactly match default selections, exclude that sheet type from settings, which represents taking the default tabs.
      let selected =
        curr.defaultSelected.length === curr.selected.length &&
        curr.defaultSelected.every((d, i) => d.id === curr.selected[i]?.id)
          ? undefined
          : curr.selected;

      if (selected || curr.visibilityLevels.some((l) => !!l)) {
        const docTypeKey = curr.docTypeKeyOverride ?? curr.documentType;

        docName[docTypeKey] = {
          selected: selected?.map((s) => s.id) ?? [],
          visibilityLevels: curr.visibilityLevels.reduce((levels, level) => {
            levels[level.id] = level.visibilityLevel;
            return levels;
          }, {} as Record<string, number | null>),
        };
      }

      return prev;
    }, {});

    const result = await FoundryAdapter.setTidySetting(
      'tabConfiguration',
      toSave
    );

    this._resetToGlobalDefaults();

    return result;
  }

  _resetToGlobalDefaults() {
    this._initialSnapshot = this._snapshotConfig($state.snapshot(this._config));
  }

  /**
   * Canonical, order-independent snapshot of every sheet type's tab selection.
   * TabSelectionList rewrites visibilityLevels in display order on mount, so a
   * raw JSON.stringify of `_config` would always look dirty.
   */
  _snapshotConfig(config: WorldTabConfigContext): string {
    return JSON.stringify(
      config.map((entry) => ({
        documentName: entry.documentName,
        documentType: entry.documentType,
        docTypeKeyOverride: entry.docTypeKeyOverride ?? null,
        ...getCanonicalTabSelection(entry),
      }))
    );
  }

  undoChanges() {
    // Reassign so the per-sheet entries get fresh objects; TabSelectionList
    // rebuilds its rows when its entry reference changes.
    this._config = this._getConfig();
    this._resetToGlobalDefaults();
  }

  /**
   * Stage every sheet type back to its default tab selection with no visibility
   * overrides. Persisted on the dialog's Save, reversible via Undo.
   */
  resetToDefault() {
    this._config = this._config.map((entry) => ({
      ...entry,
      selected: entry.defaultSelected.map((t) => ({ ...t })),
      unselected: entry.defaultUnselected.map((t) => ({ ...t })),
      visibilityLevels: entry.visibilityLevels.map((l) => ({
        ...l,
        visibilityLevel: null,
      })),
    }));
  }
}
