import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import WorldTabConfigurationQuadrone from './WorldTabConfigurationQuadrone.svelte';
import { settings } from 'src/settings/settings.svelte';
import CharacterSheetQuadroneRuntime from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
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
  allTabs: Tab[];
  defaultSelected: string[];
  defaultUnselected: string[];
  selected: string[];
  unselected: string[];
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
        'Character',
        CharacterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_CHARACTER,
        setting
      )
    );

    config.push(
      getActorTabContext(
        'DND5E.NPC.Label',
        CharacterSheetQuadroneRuntime,
        CONSTANTS.SHEET_TYPE_NPC,
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
        selected,
      };

      return prev;
    }, {});

    return await FoundryAdapter.setTidySetting('tabConfiguration', toSave);
  }

  async useDefault() {
    return await FoundryAdapter.setTidySetting('tabConfiguration', {});
  }
}

function getUnselectedTabIds(all: Tab[], selected: string[]) {
  return all.filter((t) => !selected.includes(t.id)).map((t) => t.id);
}

function getActorTabContext(
  title: string,
  runtime: ActorSheetRuntime<any>,
  type: string,
  settings: TabConfiguration
): WorldTabConfigContextEntry {
  let selected =
    settings[CONSTANTS.DOCUMENT_NAME_ACTOR]?.[type]?.selected ?? [];

  let allTabs: Tab[] = runtime.getAllRegisteredTabs().map((t) => ({
    id: t.id,
    title: typeof t.title === 'function' ? t.title() : t.title,
  }));

  let defaultSelected = runtime.getDefaultTabIds();

  if (!selected.length) {
    selected = [...defaultSelected];
  }

  return {
    documentName: CONSTANTS.DOCUMENT_NAME_ACTOR,
    documentType: type,
    title: FoundryAdapter.localize(title),
    allTabs,
    defaultSelected,
    defaultUnselected: getUnselectedTabIds(allTabs, defaultSelected),
    selected: selected,
    unselected: getUnselectedTabIds(allTabs, selected),
  };
}
