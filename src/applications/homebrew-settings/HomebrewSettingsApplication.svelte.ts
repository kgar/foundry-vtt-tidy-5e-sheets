import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import HomebrewSettings from './HomebrewSettings.svelte';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type HomebrewConfigContext = {
  enableBankedInspiration: boolean;
  bankedInspirationGmOnly: boolean;
};

export class HomebrewSettingsApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration>
>(foundry.applications.api.ApplicationV2) {
  _config: HomebrewConfigContext = $state({
    bankedInspirationGmOnly: false,
    enableBankedInspiration: false,
  });

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

    const component = mount(HomebrewSettings, {
      target: node,
      props: {
        app: this,
        config: this._config,
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
    await FoundryAdapter.setTidySetting(
      'enableBankedInspiration',
      this._config.enableBankedInspiration
    );
    await FoundryAdapter.setTidySetting(
      'bankedInspirationGmOnly',
      this._config.bankedInspirationGmOnly
    );

    await this.close();
  }
}
