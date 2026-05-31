import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import TidyWorldSettings from './TidyWorldSettings.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { WorldTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/WorldTabConfigurationQuadroneApplication.svelte';
import { HomebrewSettingsApplication } from 'src/applications/homebrew-settings/HomebrewSettingsApplication.svelte';
import { WorldHeaderControlConfigurationQuadroneApplication } from 'src/applications/header-control-configuration/WorldHeaderControlConfigurationQuadroneApplication.svelte';
import { ApplyTidySheetPreferencesApplication } from 'src/applications/sheet-preferences/ApplyTidySheetPreferencesApplication.svelte';

export const WorldSettingsTabIds = {
  theme: 'settings:theme',
  tabConfig: 'settings:tab-config',
  headerControls: 'settings:header-controls',
  homebrew: 'settings:homebrew',
  sheetPreferences: 'settings:sheet-preferences',
} as const;

export type WorldSettingsTabInfo = {
  id: string;
  title: string;
  iconClass?: string;
};

export type WorldSettingsContext = {};

export type WorldSettingsApplicationConfiguration =
  Partial<ApplicationConfiguration> & {
    initialTabId?: string;
  };

export class WorldSettingsQuadroneApplication extends SvelteApplicationMixin<
  WorldSettingsApplicationConfiguration,
  WorldSettingsContext
>(foundry.applications.api.ApplicationV2) {
  _config: WorldSettingsContext = $state({});

  initialTabId?: string;
  currentTabId = $state<string | undefined>(undefined);

  themeSettingsTab!: ThemeSettingsQuadroneApplication;
  tabConfigTab!: WorldTabConfigurationQuadroneApplication;
  headerControlsTab!: WorldHeaderControlConfigurationQuadroneApplication;
  homebrewTab!: HomebrewSettingsApplication;
  sheetPreferencesTab!: ApplyTidySheetPreferencesApplication;

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'tidy-sheet-settings',
    ],
    id: 'tidy-world-settings',
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.WorldSettings.Menu.label',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 750,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  constructor(options: WorldSettingsApplicationConfiguration = {}) {
    super(options);

    this.initialTabId = options.initialTabId;
    this.currentTabId = this.initialTabId;
  }

  selectTab(id: string) {
    this.currentTabId = id;
  }

  _initializeSettingsTabs(): void {
    // Make sure things aren't already loaded.
    if (
      this.themeSettingsTab &&
      this.tabConfigTab &&
      this.headerControlsTab &&
      this.homebrewTab &&
      this.sheetPreferencesTab
    ) {
      return;
    }

    if (!this.themeSettingsTab) {
      const app = new ThemeSettingsQuadroneApplication({});
      app._settings = app._getSettings();
      app._resetToGlobalDefaults();
      app.close = async () => {};
      this.themeSettingsTab = app;
    }

    if (!this.tabConfigTab) {
      const app = new WorldTabConfigurationQuadroneApplication({});
      app._config = app._getConfig();
      app.close = async () => {};
      this.tabConfigTab = app;
    }

    if (!this.headerControlsTab) {
      const app = new WorldHeaderControlConfigurationQuadroneApplication({});
      app._configs = app._getConfigs();
      app.close = async () => {};
      this.headerControlsTab = app;
    }

    if (!this.homebrewTab) {
      const app = new HomebrewSettingsApplication({});
      app._config = app._getConfig();
      app.close = async () => {};
      this.homebrewTab = app;
    }

    if (!this.sheetPreferencesTab) {
      const app = new ApplyTidySheetPreferencesApplication({});
      app.sheetOptions = app.getTidySheetPreferenceOptions();
      app.close = async () => {};
      this.sheetPreferencesTab = app;
    }
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    this._initializeSettingsTabs();

    return mount(TidyWorldSettings, {
      target: node,
      props: {
        app: this,
        config: this._config,
      },
    });
  }

  async _prepareContext(
    _options: ApplicationRenderOptions
  ): Promise<WorldSettingsContext> {
    this._initializeSettingsTabs();
    return this._config;
  }
}
