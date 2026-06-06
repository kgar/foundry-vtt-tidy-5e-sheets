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
import type { SettingsFooterHost } from 'src/applications/settings/settings-pane.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';

export const WorldSettingsTabIds = {
  defaults: 'settings:defaults',
  about: 'settings:about',
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

export class WorldSettingsQuadroneApplication
  extends SvelteApplicationMixin<
    WorldSettingsApplicationConfiguration,
    WorldSettingsContext
  >(foundry.applications.api.ApplicationV2)
  implements SettingsFooterHost
{
  _config: WorldSettingsContext = $state({});

  initialTabId?: string;
  currentTabId = $state<string | undefined>(undefined);

  themeSettingsTab!: ThemeSettingsQuadroneApplication;
  tabConfigTab!: WorldTabConfigurationQuadroneApplication;
  headerControlsTab!: WorldHeaderControlConfigurationQuadroneApplication;
  homebrewTab!: HomebrewSettingsApplication;
  sheetPreferencesTab!: ApplyTidySheetPreferencesApplication;

  // The dialog persists every settings page with a single shared Save. Sheet
  // Preferences is excluded: it is an immediate apply-and-reload action that
  // keeps its own button. `hasChanges` aggregates the deferred-save pages.
  hasChanges = $derived(
    !!this.themeSettingsTab?.hasChanges ||
      !!this.tabConfigTab?.hasChanges ||
      !!this.headerControlsTab?.hasChanges ||
      !!this.homebrewTab?.hasChanges
  );

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

  // World pages don't map to a single pane, so Undo / Use Global Defaults act
  // on the whole dialog and stay enabled. All changes are staged until Save.
  canUndo = true;
  canUseDefault = true;

  // The per-sheet tab/header panes mount once (TabContent.onMount), so bumping
  // this forces them to remount and re-read the reset config. See WorldSheetSettings.
  tabPaneVersion = $state(0);

  /** Revert every deferred-save page to its last-saved state (staged). */
  undoChanges() {
    this.themeSettingsTab.undoChanges();
    this.tabConfigTab.undoChanges();
    this.headerControlsTab.undoChanges();
    this.homebrewTab.undoChanges();
    this.tabPaneVersion++;
  }

  /** Confirm once, then stage system defaults across every page. */
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

    this.themeSettingsTab.resetToDefault();
    this.tabConfigTab.resetToDefault();
    this.headerControlsTab.resetToDefault();
    this.homebrewTab.resetToDefault();
    this.tabPaneVersion++;
  }

  /** Persist every deferred-save settings page in one shot, then close. */
  async save() {
    try {
      await this.themeSettingsTab.apply();
      await this.tabConfigTab.apply();
      await this.headerControlsTab.apply();
      await this.homebrewTab.apply();
      await this.sheetPreferencesTab.apply();
    } catch (e) {
      error('Failed to save world settings', false, e);
      return;
    }

    await this.close();
  }

  async cancel() {
    await this.close();
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
      app._resetToGlobalDefaults();
      app.close = async () => {};
      this.tabConfigTab = app;
    }

    if (!this.headerControlsTab) {
      const app = new WorldHeaderControlConfigurationQuadroneApplication({});
      app._configs = app._getConfigs();
      app._resetToGlobalDefaults();
      app.close = async () => {};
      this.headerControlsTab = app;
    }
    

    if (!this.homebrewTab) {
      const app = new HomebrewSettingsApplication({});
      app._config = app._getConfig();
      app._resetToGlobalDefaults();
      app.close = async () => {};
      this.homebrewTab = app;
    }

    if (!this.sheetPreferencesTab) {
      const app = new ApplyTidySheetPreferencesApplication({});
      app.sheetOptions = app.getTidySheetPreferenceOptions();
      app._resetToGlobalDefaults();
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
