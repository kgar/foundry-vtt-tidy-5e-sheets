import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import type {
  DocumentSheetApplicationConfiguration,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import type { TabConfigContextEntry } from './tab-configuration.types';
import { CONSTANTS } from 'src/constants';
import SheetTabConfigurationQuadrone from './SheetTabConfigurationQuadrone.svelte';
import { mount } from 'svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import {
  getActorTabContext,
  getItemTabContext,
} from './tab-configuration-functions';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { error } from 'src/utils/logging';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import type { SheetTabConfiguration } from 'src/settings/settings.types';

export type SheetTabConfigurationContext = {
  entry: TabConfigContextEntry;
};

type GetTabConfigFn = (actor: any) => SheetTabConfiguration | null | undefined;
type SetTabConfigFn = (
  actor: any,
  config: SheetTabConfiguration
) => Promise<void> | undefined;
type GetTabContextFn = (
  doc: any,
  setting: SheetTabConfiguration
) => TabConfigContextEntry | undefined;

export type SheetTabConfigurationQuadroneApplicationConfiguration =
  DocumentSheetApplicationConfiguration & {
    customTabConfigProvider?: {
      getTabConfig: GetTabConfigFn;
      setTabsConfig: SetTabConfigFn;
      getTabContext: GetTabContextFn;
    };
    title?: string;
  };

/**
 * Document-specific tab configuration application.
 * Available tabs: based on the document's runtime registered tab IDs.
 * Selected tabs: document flag data ➡️ else world default setting ➡️ else document runtime default.
 * **Note**: The runtime default is designed to always be available when there are no user-defined settings present.
 */
export class SheetTabConfigurationQuadroneApplication extends DocumentSheetDialog<
  SheetTabConfigurationQuadroneApplicationConfiguration,
  SheetTabConfigurationContext
>() {
  _config: SheetTabConfigurationContext = $state({
    entry: {
      allTabs: {},
      defaultSelected: [],
      worldDefaultSelected: [],
      defaultUnselected: [],
      documentName: '',
      documentType: '',
      selected: [],
      title: '',
      unselected: [],
      visibilityLevels: [],
    },
  });
  /** When the document has no selected tabs, this is the fallback tab ID list. */
  _worldDefaultTabIds: string[] = $state([]);
  _getTabConfig: GetTabConfigFn;
  _setTabConfig: SetTabConfigFn;
  _getTabContext: GetTabContextFn;
  _inclusionTabTitle: string;
  _visibilityTabTitle: string;

  constructor(options: SheetTabConfigurationQuadroneApplicationConfiguration) {
    super(options);
    this._worldDefaultTabIds =
      settings.value.tabConfiguration[options.document.documentName]?.[
        options.document.type
      ]?.selected ?? [];

    this._getTabConfig =
      options.customTabConfigProvider?.getTabConfig ??
      TidyFlags.tabConfiguration.get;

    this._setTabConfig =
      options.customTabConfigProvider?.setTabsConfig ??
      TidyFlags.tabConfiguration.set;

    this._getTabContext =
      options.customTabConfigProvider?.getTabContext ??
      SheetTabConfigurationQuadroneApplication._getConfigFromRuntime;

    this._inclusionTabTitle =
      options.title ??
      FoundryAdapter.localize('TIDY5E.TabConfiguration.Title', {
        documentName: FoundryAdapter.localize(
          `TYPES.${options.document.documentName}.${options.document.type}`
        ),
      });

    this._visibilityTabTitle = 'TODO';
  }

  static DEFAULT_OPTIONS: Partial<DocumentSheetConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'sheet-tab-configuration',
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
      width: 600,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this._config = {
      entry: this._getConfig(),
    };

    const component = mount(SheetTabConfigurationQuadrone, {
      target: node,
      props: {
        app: this,
        config: this._config,
        title: this._inclusionTabTitle,
      },
    });

    return component;
  }

  _getConfig() {
    let setting = this._getTabConfig(this.document);
    setting ??= { selected: [], visibilityLevels: {} };
    setting.selected ??= [];
    setting.visibilityLevels ??= {};

    if (!setting.selected.length) {
      setting.selected = this._worldDefaultTabIds ?? [];
    }

    const context = this._getTabContext(this.document, setting);

    if (!context) {
      error(
        `An error occurred while loading tab configuration for this sheet. The sheet type is not supported. Document Name: ${this.document.documentName} | Document Type: ${this.document.type}`
      );
      throw new Error(
        `Tab Configuration: Sheet type ${this.document.type} not supported`
      );
    }

    return context;
  }

  static _getConfigFromRuntime(doc: any, setting: SheetTabConfiguration) {
    if (doc.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR) {
      const runtime = getActorRuntime(doc.type);
      if (runtime) {
        return getActorTabContext(runtime, doc.type, setting);
      }
    }

    if (doc.documentName === CONSTANTS.DOCUMENT_NAME_ITEM) {
      return getItemTabContext(doc.type, setting);
    }
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    let curr = this._config.entry;
    let selected =
      curr.worldDefaultSelected.length === curr.selected.length &&
      curr.worldDefaultSelected.every((d, i) => d.id === curr.selected[i]?.id)
        ? []
        : curr.selected.map((s) => s.id);

    return await this._setTabConfig(this.document, {
      selected: selected,
      visibilityLevels: this._config.entry.visibilityLevels.reduce(
        (prev, curr) => {
          prev[curr.id] = curr.visibilityLevel;
          return prev;
        },
        {} as Record<string, number | null>
      ),
    });
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

    let config = this._getTabConfig(this.document) ?? {
      selected: [],
      visibilityLevels: {},
    };

    config.selected = [];

    Object.keys(config.visibilityLevels).forEach((key) => {
      config.visibilityLevels[key] = null;
    });

    await this._setTabConfig(this.document, config);

    await this.close();
  }
}

function getActorRuntime(type: string) {
  return type === CONSTANTS.SHEET_TYPE_CHARACTER
    ? CharacterSheetQuadroneRuntime
    : type === CONSTANTS.SHEET_TYPE_NPC
    ? NpcSheetQuadroneRuntime
    : type === CONSTANTS.SHEET_TYPE_VEHICLE
    ? VehicleSheetQuadroneRuntime
    : type === CONSTANTS.SHEET_TYPE_GROUP
    ? GroupSheetQuadroneRuntime
    : type === CONSTANTS.SHEET_TYPE_ENCOUNTER
    ? EncounterSheetQuadroneRuntime
    : undefined;
}
