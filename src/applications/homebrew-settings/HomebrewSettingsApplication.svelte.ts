import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import HomebrewSettings from './HomebrewSettings.svelte';
import SettingsDialogShell from 'src/applications/settings/SettingsDialogShell.svelte';
import type {
  SettingsFooterHost,
  SettingsPane,
} from 'src/applications/settings/settings-pane.types';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type HomebrewConfigContext = {
  enableBankedInspiration: boolean;
  bankedInspirationGmOnly: boolean;
};

export class HomebrewSettingsApplication
  extends SvelteApplicationMixin<Partial<ApplicationConfiguration>>(
    foundry.applications.api.ApplicationV2
  )
  implements SettingsPane, SettingsFooterHost
{
  _config: HomebrewConfigContext = $state({
    bankedInspirationGmOnly: false,
    enableBankedInspiration: false,
  });

  _initialSnapshot = $state('');

  hasChanges = $derived(
    JSON.stringify($state.snapshot(this._config)) !== this._initialSnapshot
  );

  // Standalone window is its own single-pane host.
  canUndo = $derived(this.hasChanges);
  canUseDefault = true;

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'tidy-homebrew-configuration',
    ],
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.SettingsMenu.Homebrew.label',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 450,
      height: 350,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this._config = this._getConfig();
    this._resetToGlobalDefaults();

    const component = mount(SettingsDialogShell, {
      target: node,
      props: {
        host: this,
        pane: HomebrewSettings,
        paneProps: {
          app: this,
          config: this._config,
        },
      },
    });

    return component;
  }

  _getConfig(): HomebrewConfigContext {
    return {
      enableBankedInspiration: settings.value.enableBankedInspiration,
      bankedInspirationGmOnly: settings.value.bankedInspirationGmOnly,
    };
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    await FoundryAdapter.setTidySetting(
      'enableBankedInspiration',
      this._config.enableBankedInspiration
    );
    await FoundryAdapter.setTidySetting(
      'bankedInspirationGmOnly',
      this._config.bankedInspirationGmOnly
    );

    this._resetToGlobalDefaults();
  }

  _resetToGlobalDefaults() {
    this._initialSnapshot = JSON.stringify($state.snapshot(this._config));
  }

  undoChanges() {
    // Mutate in place so bound checkboxes refresh; reverts to last-saved values.
    Object.assign(this._config, this._getConfig());
    this._resetToGlobalDefaults();
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

    this.resetToDefault();
  }

  /** Stage the registered system defaults; persisted on Save, undoable. */
  resetToDefault() {
    Object.assign(this._config, {
      enableBankedInspiration: false,
      bankedInspirationGmOnly: false,
    });
  }
}
