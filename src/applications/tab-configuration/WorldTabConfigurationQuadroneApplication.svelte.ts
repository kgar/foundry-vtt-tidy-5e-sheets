import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import WorldTabConfigurationQuadrone from './WorldTabConfigurationQuadrone.svelte';
import { settings } from 'src/settings/settings.svelte';
import CharacterSheetQuadroneRuntime from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import NpcSheetQuadroneRuntime from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import VehicleSheetQuadroneRuntime from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import GroupSheetQuadroneRuntime from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import type { ActorSheetRuntime } from 'src/runtime/ActorSheetRuntime.svelte';
import type { TabConfiguration } from 'src/settings/settings.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

type Tab = {
  id: string;
  title: string;
};

type WorldTabConfigContextEntry = {
  documentName: string;
  documentType: string;
  title: string;
  allTabs: Record<string, Tab>;
  defaultSelected: Tab[];
  defaultUnselected: Tab[];
  selected: Tab[];
  unselected: Tab[];
};

export type WorldTabConfigContext = WorldTabConfigContextEntry[];

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
      title: '(Localize) Sheet Tab Configuration (New Tidy Sheets)',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 600,
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

    config.push(
      getActorTabContext(
        CharacterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_CHARACTER,
        setting
      )
    );

    config.push(
      getActorTabContext(
        NpcSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_NPC,
        setting
      )
    );

    config.push(
      getActorTabContext(
        VehicleSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_VEHICLE,
        setting
      )
    );

    config.push(
      getActorTabContext(
        GroupSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_GROUP,
        setting
      )
    );

    return config;
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    let toSave = this._config.reduce<TabConfiguration>((prev, curr) => {
      let docType = (prev[curr.documentName] ??= {});

      // When selected tabs exactly match default selections, save an empty array, which represents taking the default tabs.
      let selected =
        curr.defaultSelected.length === curr.selected.length &&
        curr.defaultSelected.every((d, i) => d === curr.selected[i])
          ? []
          : curr.selected;

      docType[curr.documentType] = {
        selected: selected.map((s) => s.id),
      };

      return prev;
    }, {});

    return await FoundryAdapter.setTidySetting('tabConfiguration', toSave);
  }

  async useDefault() {
    return await FoundryAdapter.setTidySetting('tabConfiguration', {});
  }
}

function getUnselectedTabs(all: Record<string, Tab>, selected: Tab[]) {
  return Object.values(all)
    .filter((tab) => !selected.some((selectedTab) => selectedTab.id == tab.id))
    .map<Tab>((t) => ({
      id: t.id,
      title: all[t.id]?.title ?? t.id,
    }));
}

function mapTabIdsToOptions(all: Record<string, Tab>, tabIds: string[]) {
  return tabIds.map<Tab>((tabId) => ({
    id: tabId,
    title: all[tabId]?.title ?? tabId,
  }));
}

function getActorTabContext(
  runtime: ActorSheetRuntime<any>,
  type: string,
  settings: TabConfiguration
): WorldTabConfigContextEntry {
  let configSectionTitle = FoundryAdapter.localize(
    `TYPES.${CONSTANTS.DOCUMENT_NAME_ACTOR}.${type}`
  );

  let allTabs = runtime
    .getAllRegisteredTabs()
    .reduce<Record<string, Tab>>((prev, tab) => {
      prev[tab.id] = {
        id: tab.id,
        title: FoundryAdapter.localize(
          typeof tab.title === 'function' ? tab.title() : tab.title
        ).titleCase(),
      };
      return prev;
    }, {});

  let selected = mapTabIdsToOptions(
    allTabs,
    settings[CONSTANTS.DOCUMENT_NAME_ACTOR]?.[type]?.selected ?? []
  );

  let defaultSelectedIds = runtime.getDefaultTabIds();

  let defaultSelected = mapTabIdsToOptions(allTabs, defaultSelectedIds);

  if (!selected.length) {
    selected = [...defaultSelected];
  }

  return {
    documentName: CONSTANTS.DOCUMENT_NAME_ACTOR,
    documentType: type,
    title: configSectionTitle,
    allTabs,
    defaultSelected,
    defaultUnselected: getUnselectedTabs(allTabs, defaultSelected),
    selected: selected,
    unselected: getUnselectedTabs(allTabs, selected),
  };
}
