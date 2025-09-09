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

export type SheetTabConfigurationContext = {
  entry: TabConfigContextEntry;
};

/**
 * Document-specific tab configuration application.
 * Available tabs: based on the document's runtime registered tab IDs.
 * Selected tabs: document flag data ➡️ else world default setting ➡️ else document runtime default.
 * **Note**: The runtime default is designed to always be available when there are no user-defined settings present.
 */
export class SheetTabConfigurationQuadroneApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  SheetTabConfigurationContext
>() {
  _config: SheetTabConfigurationContext = $state({
    entry: {
      allTabs: {},
      defaultSelected: [],
      defaultUnselected: [],
      documentName: '',
      documentType: '',
      selected: [],
      title: '',
      unselected: [],
    },
  });
  /** When the document has no selected tabs, this is the fallback tab ID list. */
  _worldDefaultTabIds: string[] = $state([]);

  constructor(options: DocumentSheetApplicationConfiguration) {
    super(options);
    this._worldDefaultTabIds =
      settings.value.tabConfiguration[options.document.documentName]?.[
        options.document.type
      ]?.selected ?? [];
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
      },
    });

    return component;
  }

  _getConfig() {
    let setting = TidyFlags.tabConfiguration.get(this.document);
    setting ??= { selected: [] };
    setting.selected ??= [];
    if (!setting.selected.length) {
      setting.selected = this._worldDefaultTabIds ?? [];
    }

    if (this.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR) {
      const runtime = getActorRuntime(this.document.type);
      if (runtime) {
        return getActorTabContext(runtime, this.document.type, setting);
      }
    }

    if (this.document.documentName === CONSTANTS.DOCUMENT_NAME_ITEM) {
      return getItemTabContext(this.document.type, setting);
    }

    error(
      `An error occurred while loading tab configuration for this sheet. The sheet type is not supported. Document Name: ${this.document.documentName} | Document Type: ${this.document.type}`
    );
    throw new Error(
      `Tab Configuration: Sheet type ${this.document.type} not supported`
    );
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    let curr = this._config.entry;
    let selected =
      curr.defaultSelected.length === curr.selected.length &&
      curr.defaultSelected.every((d, i) => d.id === curr.selected[i]?.id)
        ? []
        : curr.selected.map((s) => s.id);

    return await TidyFlags.tabConfiguration.set(this.document, {
      selected: selected,
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

    let config = TidyFlags.tabConfiguration.get(this.document) ?? {
      selected: [],
    };

    config.selected = [];

    await TidyFlags.tabConfiguration.set(this.document, config);

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
    : undefined;
}
