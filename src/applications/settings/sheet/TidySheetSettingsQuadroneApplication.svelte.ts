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
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import { settings } from 'src/settings/settings.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import {
  ConfigureSectionsApplication,
  type SectionOptionGroup,
} from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { error } from 'src/utils/logging';
import TidySheetSettings from './TidySheetSettings.svelte';

export const TidySheetSettingsDialogIds = {
  theme: 'dialog:theme',
  tabConfig: 'dialog:tab-config',
  sidebarTabConfig: 'dialog:sidebar-tab-config',
  customTabs: 'dialog:custom-tabs',
} as const;

export type TidySheetSettingsTabInfo = {
  id: string;
  title: string;
  iconClass?: string;
};

export type TidySheetSettingsContext = {
  sheetTabs: TidySheetSettingsTabInfo[];
};

export type ConfigureSectionsInput = {
  tabId: string;
  sections: import('src/types/types').TidySectionBase[];
  optionsGroups?: import('src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte').SectionOptionGroup[];
  formTitle?: string;
};

export type TidySheetSettingsApplicationConfiguration =
  DocumentSheetApplicationConfiguration & {
    initialTabId?: string;
    tabSettings?: {
      [tabId: string]: ConfigureSectionsInput;
    };
  };

export class TidySheetSettingsQuadroneApplication extends DocumentSheetDialog<
  TidySheetSettingsApplicationConfiguration,
  TidySheetSettingsContext
>() {
  _config: TidySheetSettingsContext = $state({
    sheetTabs: [],
  });

  themeChildApp!: ThemeSettingsQuadroneApplication;
  tabConfigChildApp!: SheetTabConfigurationQuadroneApplication;
  sidebarTabConfigChildApp?: SheetTabConfigurationQuadroneApplication;
  specialTraitsChildApp?: SpecialTraitsApplication;
  configureSectionsChildAppByTabId = new Map<
    string,
    ConfigureSectionsApplication
  >();

  initialTabId?: string;
  tabSettings: Record<string, ConfigureSectionsInput>;

  // Runtimes are resolved lazily to avoid a module-init cycle: every actor tab
  // imports this dialog (for the gear button), and each runtime imports those
  // same tab components to register them.
  _runtimes?: Record<string, ActorSheetQuadroneRuntime<any>>;
  _sidebarRuntime?: ActorSheetQuadroneRuntime<any>;
  _getActorTabContext?: typeof import('src/applications/tab-configuration/tab-configuration-functions').getActorTabContext;

  _persisted = false;

  constructor(options: TidySheetSettingsApplicationConfiguration) {
    super(options);

    this.initialTabId = options.initialTabId;
    this.tabSettings = options.tabSettings ?? {};

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

  getOrCreateSpecialTraitsChildApp(): SpecialTraitsApplication {
    if (!this.specialTraitsChildApp) {
      const app = new SpecialTraitsApplication({
        document: this.document,
      });
      app.close = async () => {};
      this.specialTraitsChildApp = app;
    }
    return this.specialTraitsChildApp;
  }

  getOrCreateConfigureSectionsChildApp(
    tabId: string
  ): ConfigureSectionsApplication | undefined {
    const cached = this.configureSectionsChildAppByTabId.get(tabId);
    if (cached) {
      return cached;
    }

    const input = this.tabSettings[tabId] ?? this._buildTabSettingsFromRuntime(tabId);
    if (!input) {
      return undefined;
    }

    const app = new ConfigureSectionsApplication({
      document: this.document,
      settings: {
        tabId: input.tabId,
        sections: input.sections,
        optionsGroups: input.optionsGroups ?? ([] as SectionOptionGroup[]),
        formTitle: input.formTitle ?? '',
      },
    });
    // Embedded — never opened as a window. Swallow close() so save/useDefault
    // don't try to dismiss an unrendered child window.
    app.close = async () => {};
    app._seedOptionGroupsFromDocument();
    app._resetToGlobalDefaults();
    this.configureSectionsChildAppByTabId.set(tabId, app);
    return app;
  }

  _buildTabSettingsFromRuntime(tabId: string): ConfigureSectionsInput | undefined {
    const runtime = this._getRuntime();
    if (!runtime) {
      return undefined;
    }
    const tab = runtime.getAllRegisteredTabs().find((t) => t.id === tabId);
    if (!tab?.settingsTabBuilder) {
      return undefined;
    }
    const sheetContext = this.document?.sheet?._context?.data;
    if (!sheetContext) {
      return undefined;
    }
    return tab.settingsTabBuilder(sheetContext, tabId);
  }

  hasTabSettingsForTab(tabId: string): boolean {
    if (this.tabSettings[tabId]) {
      return true;
    }
    const runtime = this._getRuntime();
    if (!runtime) {
      return false;
    }
    const tab = runtime.getAllRegisteredTabs().find((t) => t.id === tabId);
    return !!tab?.settingsTabBuilder;
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
    await this._loadRuntimes();
    this._config.sheetTabs = this._getSheetTabs();
    return this._config;
  }

  async _loadRuntimes(): Promise<void> {
    if (this._runtimes) {
      return;
    }

    const [character, npc, vehicle, group, encounter, sidebar, tabConfigFns] =
      await Promise.all([
        import('src/runtime/actor/CharacterSheetQuadroneRuntime.svelte'),
        import('src/runtime/actor/NpcSheetQuadroneRuntime.svelte'),
        import('src/runtime/actor/VehicleSheetQuadroneRuntime.svelte'),
        import('src/runtime/actor/GroupSheetQuadroneRuntime.svelte'),
        import('src/runtime/actor/EncounterSheetQuadroneRuntime.svelte'),
        import('src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte'),
        import('src/applications/tab-configuration/tab-configuration-functions'),
      ]);

    this._runtimes = {
      [CONSTANTS.SHEET_TYPE_CHARACTER]: character.CharacterSheetQuadroneRuntime,
      [CONSTANTS.SHEET_TYPE_NPC]: npc.NpcSheetQuadroneRuntime,
      [CONSTANTS.SHEET_TYPE_VEHICLE]: vehicle.VehicleSheetQuadroneRuntime,
      [CONSTANTS.SHEET_TYPE_GROUP]: group.GroupSheetQuadroneRuntime,
      [CONSTANTS.SHEET_TYPE_ENCOUNTER]: encounter.EncounterSheetQuadroneRuntime,
    };

    this._sidebarRuntime = sidebar.CharacterSheetQuadroneSidebarRuntime;
    this._getActorTabContext = tabConfigFns.getActorTabContext;

    this._initializeSidebarTabConfigChildAppIfApplicable();
  }

  _initializeSidebarTabConfigChildAppIfApplicable() {
    if (this.sidebarTabConfigChildApp) {
      return;
    }
    if (this.document?.type !== CONSTANTS.SHEET_TYPE_CHARACTER) {
      return;
    }
    if (!this._sidebarRuntime || !this._getActorTabContext) {
      return;
    }

    const sidebarRuntime = this._sidebarRuntime;
    const getActorTabContext = this._getActorTabContext;

    const app = new SheetTabConfigurationQuadroneApplication({
      document: this.document,
      customTabConfigProvider: {
        getTabConfig: TidyFlags.sidebarTabConfiguration.get,
        setTabConfig: TidyFlags.sidebarTabConfiguration.set,
        getTabContext: (doc, setting) =>
          getActorTabContext(
            sidebarRuntime,
            doc.documentName,
            setting,
            true,
            CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR
          ),
      },
      title: FoundryAdapter.localize('TIDY5E.TabConfiguration.Title', {
        documentName: FoundryAdapter.localize('TIDY5E.SheetSettings.Sidebar.title'),
      }),
      docTypeKeyOverride: CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    });
    app._config = { entry: app._getConfig() };
    app._resetToGlobalDefaults();
    app.close = async () => {};
    this.sidebarTabConfigChildApp = app;
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
      .filter(
        (t) =>
          t.id === CONSTANTS.TAB_CHARACTER_ATTRIBUTES ||
          this.hasTabSettingsForTab(t.id)
      )
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

    return this._runtimes?.[this.document.type];
  }

  /* -------------------------------------------- */
  /*  Save / Cancel                               */
  /* -------------------------------------------- */

  async save() {
    try {
      await this.themeChildApp.apply();
      await this.tabConfigChildApp.apply();
      await this.sidebarTabConfigChildApp?.apply();
      await this.specialTraitsChildApp?.apply();
      for (const helper of this.configureSectionsChildAppByTabId.values()) {
        await helper.apply();
      }
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
