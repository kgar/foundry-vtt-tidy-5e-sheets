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
  getItemTabContext,
} from './tab-configuration-functions';
import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';

export type WorldTabConfigContext = TabConfigContextEntry[];

export class WorldTabConfigurationQuadroneApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration>
>(foundry.applications.api.ApplicationV2) {
  _config: WorldTabConfigContext = $state([]);

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
        actorConfigs?.[CONSTANTS.SHEET_TYPE_CHARACTER]
      )
    );

    const defaultSidebarTabIds =
      CharacterSheetQuadroneSidebarRuntime.getDefaultTabIds();
    const characterSidebarContext = buildTabConfigContextEntry(
      CONSTANTS.DOCUMENT_NAME_ACTOR,
      CONSTANTS.SHEET_TYPE_CHARACTER,
      CharacterSheetQuadroneSidebarRuntime.getAllRegisteredTabs(),
      actorConfigs?.[CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR],
      defaultSidebarTabIds,
      SettingsProvider.settings.tabConfiguration.get()?.[
        CONSTANTS.DOCUMENT_NAME_ACTOR
      ]?.[CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR]?.selected ??
        defaultSidebarTabIds
    );

    characterSidebarContext.title = FoundryAdapter.localize(
      'TIDY5E.Character.Sidebar.Title'
    );

    characterSidebarContext.docTypeKeyOverride =
      CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR;

    config.push(characterSidebarContext);

    config.push(
      getActorTabContext(
        NpcSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_NPC,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_NPC]
      )
    );

    config.push(
      getActorTabContext(
        GroupSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_GROUP,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_GROUP]
      )
    );

    config.push(
      getActorTabContext(
        EncounterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_ENCOUNTER,
        actorConfigs?.[CONSTANTS.SHEET_TYPE_ENCOUNTER]
      )
    );

    if (settings.value.truesight) {
      config.push(
        getActorTabContext(
          VehicleSheetQuadroneRuntime,
          CONSTANTS.SHEET_TYPE_VEHICLE,
          actorConfigs?.[CONSTANTS.SHEET_TYPE_VEHICLE]
        )
      );
    }

    let itemConfigs = setting?.[CONSTANTS.DOCUMENT_NAME_ITEM];

    let allItemTypes = ItemSheetQuadroneRuntime.getSheetTypes();
    for (let type of allItemTypes) {
      config.push(getItemTabContext(type, itemConfigs?.[type]));
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

    return await FoundryAdapter.setTidySetting('tabConfiguration', toSave);
  }

  async useDefault() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      },
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
    });

    if (!proceed) {
      return;
    }

    await FoundryAdapter.setTidySetting('tabConfiguration', {});

    await this.close();
  }
}
