import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
  ApplicationWindowRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import TidyWorldSettings from './TidyWorldSettings.svelte';
import type { SettingsFooterHost } from 'src/applications/settings/settings-pane.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { getThemeSettingsEditor } from '../editors/theme-settings-editor.svelte';
import { getWorldTabConfigurationSettingsEditor } from '../editors/world-tab-configuration-settings-editor.svelte';
import { getWorldHeaderControlConfigurationSettingsEditor } from '../editors/world-header-control-configuration-settings-editor.svelte';
import { getHomebrewSettingsEditor } from '../editors/homebrew-settings-editor.svelte';
import { getDefaultSheetPreferencesSettingsEditor } from '../editors/default-sheet-preferences-settings-editor.svelte';
import type { SettingsEditor } from '../editors/settings-editors.svelte';

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

  /** All settings editors */
  editors;

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

    this.editors = {
      themeSettingsTab: getThemeSettingsEditor(),
      tabConfigTab: getWorldTabConfigurationSettingsEditor(),
      headerControlsTab: getWorldHeaderControlConfigurationSettingsEditor(),
      homebrewTab: getHomebrewSettingsEditor(),
      sheetPreferencesTab: getDefaultSheetPreferencesSettingsEditor(),
    } satisfies Record<string, SettingsEditor<unknown>>;

    this.hasChanges = $derived(
      Object.values(this.editors).some((e) => e.hasChanges),
    );
  }

  selectTab(id: string) {
    this.currentTabId = id;
  }

  // World pages don't map to a single pane, so Undo / Use Global Defaults act
  // on the whole dialog anDd stay enabled. All changes are staged until Save.
  canUndo = true;
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

    Object.values(this.editors).forEach((e) => e.resetToDefault());
    this.tabPaneVersion++;
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

  async _preFirstRender(
    _context: ApplicationWindowRenderOptions,
    _options: ApplicationRenderOptions,
  ) {
    Object.values(this.editors).forEach((e) => e.initialize());
  }
}
