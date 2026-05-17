import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
  DocumentSheetApplicationConfiguration,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';
import { mount } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import { settings } from 'src/settings/settings.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
import {
  ConfigureSectionsApplication,
  type SectionOptionGroup,
} from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { error } from 'src/utils/logging';
import TidySheetSettings from './TidySheetSettings.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

export const TidySheetSettingsTabIds = {
  theme: 'settings:theme',
  tabConfig: 'settings:tab-config',
  sidebarTabConfig: 'settings:sidebar-tab-config'
} as const;

export type TidySheetSettingsTabInfo = {
  id: string;
  title: string;
  iconClass?: string;
};

export type TidySheetSettingsContext = {
  parentSheetTabs: TidySheetSettingsTabInfo[];
};

export type ConfigureSectionsInput = {
  tabId: string;
  sections: import('src/types/types').TidySectionBase[];
  optionsGroups?: SectionOptionGroup[];
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
    parentSheetTabs: [],
  });

  initialTabId?: string;
  tabSettings: Record<string, ConfigureSectionsInput>;
  themeSettingsTab!: ThemeSettingsQuadroneApplication;
  tabDisplaySettingsTab!: SheetTabConfigurationQuadroneApplication;
  sidebarTabDisplaySettingsTab?: SheetTabConfigurationQuadroneApplication;
  specialTraitsChildApp?: SpecialTraitsApplication;
  configureSectionsChildAppByTabId = new SvelteMap<
    string,
    ConfigureSectionsApplication
  >();
  themePlaceholders?: ReturnType<
    ThemeSettingsQuadroneApplication['_mapSettings']
  >;

  _runtimes?: Record<string, ActorSheetQuadroneRuntime<any>>;
  _sidebarRuntime?: ActorSheetQuadroneRuntime<any>;
  _getActorTabContext?: typeof import('src/applications/tab-configuration/tab-configuration-functions').getActorTabContext;

  // For storing save/cancel state
  _persisted = false;

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

  constructor(options: TidySheetSettingsApplicationConfiguration) {
    super(options);

    this.initialTabId = `sheet:${options.initialTabId}`;
    this.tabSettings = options.tabSettings ?? {};
  }

  _initializeSettingsTabs(): void {
    if (this.themeSettingsTab && this.tabDisplaySettingsTab) {
      return;
    }

    if (!this.themeSettingsTab) {
      this.themeSettingsTab = new ThemeSettingsQuadroneApplication({
        document: this.document,
      });
      this.themeSettingsTab._settings = this.themeSettingsTab._getSettings();
      this.themeSettingsTab._resetToGlobalDefaults();
      this.themePlaceholders = this.document
        ? this.themeSettingsTab._mapSettings(ThemeQuadrone.getWorldThemeSettings())
        : undefined;
    }

    if (!this.tabDisplaySettingsTab) {
      this.tabDisplaySettingsTab = new SheetTabConfigurationQuadroneApplication({
        document: this.document,
      });
      this.tabDisplaySettingsTab._config = {
        entry: this.tabDisplaySettingsTab._getConfig(),
      };
      this.tabDisplaySettingsTab._resetToGlobalDefaults();
    }
  }

  getSavedTabSettings(tabId: string): boolean {
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

  
  /* -------------------------------------------- */
  /*  Get tabs for the calling sheet
  /* -------------------------------------------- */
  _createComponent(node: HTMLElement): Record<string, any> {
    this._initializeSettingsTabs();

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
    this._initializeSettingsTabs();
    this._config.parentSheetTabs = this._getTabsForParentSheet();
    return this._config;
  }

  async _loadRuntimes(): Promise<void> {
    if (this._runtimes) {
      return;
    }

    this._runtimes = {};

    if (this.document?.documentName !== CONSTANTS.DOCUMENT_NAME_ACTOR) {
      return;
    }

    switch (this.document.type) {
      case CONSTANTS.SHEET_TYPE_CHARACTER: {
        const [character, sidebar, tabConfigFns] = await Promise.all([
          import('src/runtime/actor/CharacterSheetQuadroneRuntime.svelte'),
          import('src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte'),
          import('src/applications/tab-configuration/tab-configuration-functions'),
        ]);

        this._runtimes[CONSTANTS.SHEET_TYPE_CHARACTER] =
          character.CharacterSheetQuadroneRuntime;
        this._sidebarRuntime = sidebar.CharacterSheetQuadroneSidebarRuntime;
        this._getActorTabContext = tabConfigFns.getActorTabContext;
        this._initializeSidebarTabConfigForCharacter();
        return;
      }
      case CONSTANTS.SHEET_TYPE_NPC: {
        const npc = await import(
          'src/runtime/actor/NpcSheetQuadroneRuntime.svelte'
        );
        this._runtimes[CONSTANTS.SHEET_TYPE_NPC] = npc.NpcSheetQuadroneRuntime;
        return;
      }
      case CONSTANTS.SHEET_TYPE_VEHICLE: {
        const vehicle = await import(
          'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte'
        );
        this._runtimes[CONSTANTS.SHEET_TYPE_VEHICLE] =
          vehicle.VehicleSheetQuadroneRuntime;
        return;
      }
      case CONSTANTS.SHEET_TYPE_GROUP: {
        const group = await import(
          'src/runtime/actor/GroupSheetQuadroneRuntime.svelte'
        );
        this._runtimes[CONSTANTS.SHEET_TYPE_GROUP] =
          group.GroupSheetQuadroneRuntime;
        return;
      }
      case CONSTANTS.SHEET_TYPE_ENCOUNTER: {
        const encounter = await import(
          'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte'
        );
        this._runtimes[CONSTANTS.SHEET_TYPE_ENCOUNTER] =
          encounter.EncounterSheetQuadroneRuntime;
        return;
      }
    }
  }

  /* -------------------------------------------- */
  /*  Character sidebar tab configuration init    */
  /* -------------------------------------------- */
  _initializeSidebarTabConfigForCharacter() {
    if (this.sidebarTabDisplaySettingsTab) {
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
    this.sidebarTabDisplaySettingsTab = app;
  }


  

  getSpecialTraitsConfigTab(): SpecialTraitsApplication {
    if (!this.specialTraitsChildApp) {
      const app = new SpecialTraitsApplication({
        document: this.document,
      });
      app.close = async () => {};
      this.specialTraitsChildApp = app;
    }
    return this.specialTraitsChildApp;
  }

  getConfigureSectionsConfigTab(
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

  /* -------------------------------------------- */
  /*  Get tabs for the calling sheet
  /* -------------------------------------------- */
  _getTabsForParentSheet(): TidySheetSettingsTabInfo[] {
    const runtime = this._getRuntime();
    if (!runtime) {
      return [];
    }

    const allRegisteredTabs = runtime.getAllRegisteredTabs();
    const selectedIds = this._getParentSheetTabIds(runtime);

    return selectedIds
      .map((id) => allRegisteredTabs.find((t) => t.id === id))
      .filter((t): t is NonNullable<typeof t> => !!t)
      .filter(
        (t) =>
          t.id === CONSTANTS.TAB_CHARACTER_ATTRIBUTES ||
          this.getSavedTabSettings(t.id)
      )
      .map((t) => ({
        id: t.id,
        title: FoundryAdapter.localize(
          typeof t.title === 'function' ? t.title() : t.title
        ),
        iconClass: t.iconClass,
      }));
  }

  _getParentSheetTabIds(runtime: ActorSheetQuadroneRuntime<any>): string[] {
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
  /*  Save / Cancel
  /* -------------------------------------------- */
  async save() {
    try {
      await this.themeSettingsTab.apply();
      await this.tabDisplaySettingsTab.apply();
      await this.sidebarTabDisplaySettingsTab?.apply();
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
      TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);
    }

    await super.close(options);
  }
}
