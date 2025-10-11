import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import WorldHeaderControlConfigurationQuadrone from './WorldHeaderControlConfigurationQuadrone.svelte';

export type ConfigHeaderControlInfo = {
  id: string;
  title: string;
};

export type WorldHeaderControlConfigContext = {
  documentName: string;
  documentType: string;
  title: string;
  allControls: [];
  defaultMenuControls: [];
  defaultHeaderControls: [];
  menuControls: [];
  headerControls: [];
}[];

export class WorldHeaderControlConfigurationQuadroneApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration>
>(foundry.applications.api.ApplicationV2) {
  _config: WorldHeaderControlConfigContext = $state([]);

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'world-header-control-configuration',
    ],
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.SettingsMenu.HeaderControlConfiguration.label',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 750,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this._config = this._getConfig();

    const component = mount(WorldHeaderControlConfigurationQuadrone, {
      target: node,
      props: {
        app: this,
        config: this._config,
      },
    });

    return component;
  }

  _getConfig(): WorldHeaderControlConfigContext {
    const config: WorldHeaderControlConfigContext = [];
    // Map all supported sheet classes to context entries
    

    return config;
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {}

  async useDefault() {
    await this.close();
  }
}
