import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationHeaderControlsEntry,
} from 'src/types/application.types';
import { mount } from 'svelte';
import WorldHeaderControlConfigurationQuadrone from './WorldHeaderControlConfigurationQuadrone.svelte';
import { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import { settings, SettingsProvider } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SheetHeaderControlPosition } from 'src/api';
import type { HeaderControlConfiguration } from 'src/settings/settings.types';

export type ConfigHeaderControlSetting = {
  id: string;
  icon: string;
  title: string;
  location?: SheetHeaderControlPosition;
};

export type WorldHeaderControlConfigContext = {
  documentName: string;
  documentType: string;
  title: string;
  controlSettings: ConfigHeaderControlSetting[];
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
        context: this._config,
      },
    });

    return component;
  }

  _getConfig(): WorldHeaderControlConfigContext {
    const headerControlSettings = settings.value.headerControlConfiguration;

    const config: WorldHeaderControlConfigContext = [];

    const characterSheet = new Tidy5eCharacterSheetQuadrone({
      document: new dnd5e.documents.Actor5e({
        name: 'hello 👋',
        type: 'character',
      }),
    });

    const characterControls = [...characterSheet.getAllHeaderControls()];

    const headerSet = new Set(
      (
        headerControlSettings[characterSheet.document.documentName]?.[
          characterSheet.document.type
        ] ?? { header: [] }
      ).header
    );

    const controlSettings: ConfigHeaderControlSetting[] = [];

    characterControls.forEach((control) => {
      const id = control.label;

      controlSettings.push({
        id,
        icon: control.icon,
        title: FoundryAdapter.localize(control.label),
        location: headerSet.has(id) ? 'header' : control.position ?? 'menu',
      });
    });

    config.push({
      documentName: characterSheet.document.documentName,
      documentType: characterSheet.document.type,
      controlSettings: controlSettings,
      title: FoundryAdapter.localize(
        `TYPES.${characterSheet.document.documentName}.${characterSheet.document.type}`
      ),
    });

    return config;
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    const toSave = this._config.reduce((prev, curr) => {
      prev[curr.documentName] ??= {};
      prev[curr.documentName][curr.documentType] ??= { header: [] };
      prev[curr.documentName][curr.documentType].header =
        curr.controlSettings.map((s) => s.id);

      return prev;
    }, {} as HeaderControlConfiguration);

    await FoundryAdapter.setTidySetting('headerControlConfiguration', toSave);
  }

  async useDefault() {
    await this.close();
  }
}
