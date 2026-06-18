import { CONSTANTS } from 'src/constants';
import { getSvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
  ApplicationWindowRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import TidyWorldSettings from './TidyWorldSettings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { getThemeSettingsEditor } from 'src/settings/editors/theme-settings-editor.svelte';
import { getWorldTabConfigurationSettingsEditor } from 'src/settings/editors/world-tab-configuration-settings-editor.svelte';
import { getWorldHeaderControlConfigurationSettingsEditor } from 'src/settings/editors/world-header-control-configuration-settings-editor.svelte';
import { getHomebrewSettingsEditor } from 'src/settings/editors/homebrew-settings-editor.svelte';
import { getDefaultSheetPreferencesSettingsEditor } from 'src/settings/editors/default-sheet-preferences-settings-editor.svelte';
import type {
  SettingsEditor,
  SettingsEditorController,
} from 'src/settings/editors/settings-editors.svelte';
import {
  getWorldSheetConfigurationSettingsEditor,
  type WorldSheetConfigurationSettingsEditor,
} from 'src/settings/editors/world-sheet-configuration-settings-editor.svelte';

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
  extends getSvelteApplicationMixin<
    WorldSettingsApplicationConfiguration,
    WorldSettingsContext
  >(foundry.applications.api.ApplicationV2)
  implements SettingsEditorController
{
  _config: WorldSettingsContext = $state({});

  initialTabId?: string;
  currentTabId = $state<string | undefined>(undefined);

  /** All settings editors */
  editors;
  sheetConfigEditors;

  // The dialog persists every settings page with a single shared Save. Sheet
  // Preferences is excluded: it is an immediate apply-and-reload action that
  // keeps its own button. `hasChanges` aggregates the deferred-save pages.
  hasChanges: boolean;

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-sheet-settings'],
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
      width: 800,
      height: 700,
    },
    actions: {},
    submitOnClose: false,
  };

  constructor(options: WorldSettingsApplicationConfiguration = {}) {
    super(options);

    this.initialTabId = options.initialTabId;
    this.currentTabId = this.initialTabId;

    // Create base editors
    this.editors = {
      themeSettingsTab: getThemeSettingsEditor(),
      tabConfigTab: getWorldTabConfigurationSettingsEditor(),
      headerControlsTab: getWorldHeaderControlConfigurationSettingsEditor(),
      homebrewTab: getHomebrewSettingsEditor(),
      sheetPreferencesTab: getDefaultSheetPreferencesSettingsEditor(),
    } satisfies Record<string, SettingsEditor<unknown>>;

    // Create composite sheet editors
    this.sheetConfigEditors = this.editors.headerControlsTab.value.reduce<
      Record<string, WorldSheetConfigurationSettingsEditor>
    >((prev, curr) => {
      const tabId = this.getSheetConfigTabId(
        curr.documentName,
        curr.documentType,
      );

      prev[tabId] = getWorldSheetConfigurationSettingsEditor({
        documentName: curr.documentName,
        documentType: curr.documentType,
        headerControlsEditor: this.editors.headerControlsTab,
        tabConfigEditor: this.editors.tabConfigTab,
        title: curr.title,
        sidebarTabConfigEditor: this.editors.tabConfigTab,
      });

      return prev;
    }, {}) satisfies Record<string, WorldSheetConfigurationSettingsEditor>;

    this.hasChanges = $derived(
      Object.values(this.editors).some((e) => e.hasChanges) ||
        Object.values(this.sheetConfigEditors).some((e) => e.hasChanges),
    );
  }

  resetToDefault(): Promise<void> | void {
    Object.values(this.editors).forEach((e) => e.resetToDefault());
    this.tabPaneVersion++;
  }

  useDefaultLabel?: string | undefined;

  selectTab(id: string) {
    this.currentTabId = id;
  }

  /**
   * The pane for undo/use defaults.
   */
  // getActivePane(): SettingsEditor<unknown> | undefined {
  //   const currentTabId = this.currentTabId;
  //   switch (currentTabId) {
  //     case WorldSettingsTabIds.theme:
  //       return this.editors.themeSettingsTab;
  //     case WorldSettingsTabIds.sheetPreferences:
  //       return this.editors.sheetPreferencesTab;
  //     case WorldSettingsTabIds.homebrew:
  //       return this.editors.homebrewTab;
  //   }

  //   // Sheet Settings
  //   const sheetConfig = this.editors.headerControlsTab.value.find(
  //     (config) =>
  //       currentTabId ===
  //       this.getSheetConfigTabId(config.documentName, config.documentType),
  //   );

  //   const sheetConfigEditor = this.;
  //   if (sheetConfig) {
  //     return sheetConfig;
  //   }
  // }

  // canUndo = $derived(!!this.getActivePane()?.hasChanges);
  canUndo = true;

  // canUseDefault = $derived(!!this.getActivePane()?.canUseDefault);
  canUseDefault = true;

  // The per-sheet tab/header panes mount once (TabContent.onMount), so bumping
  // this forces them to remount and re-read the reset config. See WorldSheetSettings.
  tabPaneVersion = $state(0);

  /** Revert every deferred-save page to its last-saved state (staged). */
  undoChanges() {
    Object.values(this.editors).forEach((e) => e.undoChanges());
    this.tabPaneVersion++;
  }

  /** Confirm once, then stage system defaults across every page. */
  async useDefault() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      },
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text',
      )}</p>`,
    });

    if (!proceed) {
      return;
    }

    this.resetToDefault();
  }

  /** Persist every deferred-save settings page in one shot, then close. */
  async save() {
    try {
      for (const editor of Object.values(this.editors)) {
        await editor.save();
      }
    } catch (e) {
      error('Failed to save world settings', false, e);
      return;
    }

    await this.close();
  }

  async cancel() {
    await this.close();
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(TidyWorldSettings, {
      target: node,
      props: {
        app: this,
        config: this._config,
      },
    });
  }

  async _prepareContext(
    _options: ApplicationRenderOptions,
  ): Promise<WorldSettingsContext> {
    return this._config;
  }

  // TODO: organize
  static readonly SETTINGS_SHEET_PREFIX = 'settings:sheet';

  // TODO: organize
  getSheetConfigTabId(documentName: string, documentType: string) {
    return `${this.SETTINGS_SHEET_PREFIX}:${documentName}:${documentType}`;
  }
}
