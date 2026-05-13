import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
  DocumentSheetApplicationConfiguration,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';
import { mount } from 'svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import { settings } from 'src/settings/settings.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { error } from 'src/utils/logging';
import TidySheetSettings from './TidySheetSettings.svelte';

export type TidySheetSettingsTabInfo = {
  id: string;
  title: string;
  iconClass?: string;
};

export type TidySheetSettingsContext = {
  sheetTabs: TidySheetSettingsTabInfo[];
};

export class TidySheetSettingsQuadroneApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  TidySheetSettingsContext
>() {
  _config: TidySheetSettingsContext = $state({
    sheetTabs: [],
  });

  themeChildApp!: ThemeSettingsQuadroneApplication;
  tabConfigChildApp!: SheetTabConfigurationQuadroneApplication;

  _persisted = false;

  constructor(options: DocumentSheetApplicationConfiguration) {
    super(options);

    this.themeChildApp = new ThemeSettingsQuadroneApplication({
      document: this.document,
    });
    this.themeChildApp._settings = this.themeChildApp._getSettings();
    this.themeChildApp._resetToGlobalDefaults();

    this.tabConfigChildApp = new SheetTabConfigurationQuadroneApplication({
      document: this.document,
    });
    this.tabConfigChildApp._config = {
      entry: this.tabConfigChildApp._getConfig(),
    };
    this.tabConfigChildApp._resetToGlobalDefaults();
  }

  get themePlaceholders() {
    return this.themeChildApp._mapSettings(
      ThemeQuadrone.getWorldThemeSettings()
    );
  }

  static DEFAULT_OPTIONS: Partial<DocumentSheetConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'tidy-sheet-settings',
    ],
    id: 'tidy-sheet-settings-{id}',
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.SheetSettings.title',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 750,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  get title() {
    return FoundryAdapter.localize('TIDY5E.SheetSettings.title');
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    this._config.sheetTabs = this._getSheetTabs();

    return mount(TidySheetSettings, {
      target: node,
      props: {
        app: this,
        config: this._config,
      },
    });
  }

  async _prepareContext(
    _options: ApplicationRenderOptions
  ): Promise<TidySheetSettingsContext> {
    this._config.sheetTabs = this._getSheetTabs();
    return this._config;
  }

  _getSheetTabs(): TidySheetSettingsTabInfo[] {
    const runtime = this._getRuntime();
    if (!runtime) {
      return [];
    }

    const allRegisteredTabs = runtime.getAllRegisteredTabs();
    const selectedIds = this._getSelectedTabIds(runtime);

    return selectedIds
      .map((id) => allRegisteredTabs.find((t) => t.id === id))
      .filter((t): t is NonNullable<typeof t> => !!t)
      .map((t) => ({
        id: t.id,
        title: FoundryAdapter.localize(
          typeof t.title === 'function' ? t.title() : t.title
        ),
        iconClass: t.iconClass,
      }));
  }

  _getSelectedTabIds(runtime: ActorSheetQuadroneRuntime<any>): string[] {
    const flag = TidyFlags.tabConfiguration.get(this.document);
    if (flag?.selected?.length) {
      return [...flag.selected];
    }

    const worldDefault =
      settings.value.tabConfiguration?.[this.document.documentName]?.[
        this.document.type
      ]?.selected ?? [];

    if (worldDefault.length) {
      return [...worldDefault];
    }

    return runtime.getDefaultTabIds();
  }

  _getRuntime(): ActorSheetQuadroneRuntime<any> | undefined {
    if (this.document?.documentName !== CONSTANTS.DOCUMENT_NAME_ACTOR) {
      return undefined;
    }

    switch (this.document.type) {
      case CONSTANTS.SHEET_TYPE_CHARACTER:
        return CharacterSheetQuadroneRuntime;
      case CONSTANTS.SHEET_TYPE_NPC:
        return NpcSheetQuadroneRuntime;
      case CONSTANTS.SHEET_TYPE_VEHICLE:
        return VehicleSheetQuadroneRuntime;
      case CONSTANTS.SHEET_TYPE_GROUP:
        return GroupSheetQuadroneRuntime;
      case CONSTANTS.SHEET_TYPE_ENCOUNTER:
        return EncounterSheetQuadroneRuntime;
      default:
        return undefined;
    }
  }

  /* -------------------------------------------- */
  /*  Save / Cancel                               */
  /* -------------------------------------------- */

  async save() {
    try {
      await this.themeChildApp.apply();
      await this.tabConfigChildApp.apply();
      this._persisted = true;
    } catch (e) {
      error('Failed to save sheet settings', false, e);
      return;
    }

    await this.close();
  }

  async cancel() {
    await this.close();
  }

  async close(options: ApplicationClosingOptions = {}) {
    if (!this._persisted) {
      // Theme settings live-preview the document while edits are pending;
      // fire the change hook with no override so subscribers re-apply
      // the persisted state and the visual revert lands.
      TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);
    }

    await super.close(options);
  }
}
