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
import type { TabConfiguration } from 'src/settings/settings.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import ItemSheetQuadroneRuntime from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import type { RegisteredTab } from 'src/runtime/types';

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

    let allItemTypes = ItemSheetQuadroneRuntime.getSheetTypes();
    for (let type of allItemTypes) {
      config.push(getItemTabContext(type, setting));
    }

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
        curr.defaultSelected.every((d, i) => d.id === curr.selected[i]?.id)
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

function getItemTabContext(type: string, settings: TabConfiguration) {
  const documentName = CONSTANTS.DOCUMENT_NAME_ITEM;

  let defaultSelectedIds = ItemSheetQuadroneRuntime.getDefaultTabIds(type);
  let allRegisteredTabs = ItemSheetQuadroneRuntime.getAllRegisteredTabs(type);

  return buildContext(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds
  );
}

function getActorTabContext(
  runtime: ActorSheetQuadroneRuntime<any>,
  type: string,
  settings: TabConfiguration
): WorldTabConfigContextEntry {
  let documentName = CONSTANTS.DOCUMENT_NAME_ACTOR;
  const allRegisteredTabs = runtime.getAllRegisteredTabs();
  let defaultSelectedIds = runtime.getDefaultTabIds();

  return buildContext(
    documentName,
    type,
    allRegisteredTabs,
    settings,
    defaultSelectedIds
  );
}

function buildContext(
  documentName: string,
  type: string,
  allRegisteredTabs: RegisteredTab<any>[],
  settings: TabConfiguration,
  defaultSelectedIds: string[]
) {
  let configSectionTitle = FoundryAdapter.localize(
    `TYPES.${documentName}.${type}`
  );

  let allTabs = allRegisteredTabs.reduce<Record<string, Tab>>((prev, tab) => {
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
    settings[documentName]?.[type]?.selected ?? []
  );

  let defaultSelected = mapTabIdsToOptions(allTabs, defaultSelectedIds);

  if (!selected.length) {
    selected = [...defaultSelected];
  }

  return {
    documentName: documentName,
    documentType: type,
    title: configSectionTitle,
    allTabs,
    defaultSelected,
    defaultUnselected: getUnselectedTabs(allTabs, defaultSelected),
    selected: selected,
    unselected: getUnselectedTabs(allTabs, selected),
  };
}
