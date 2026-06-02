import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import WorldHeaderControlConfigurationQuadrone from './WorldHeaderControlConfigurationQuadrone.svelte';
import { settings } from 'src/settings/settings.svelte';
import {
  FoundryAdapter,
  type DocumentSheetConstructor,
} from 'src/foundry/foundry-adapter';
import type { SheetHeaderControlPosition } from 'src/api';
import type { HeaderControlConfiguration } from 'src/settings/settings.types';
import { coalesce } from 'src/utils/formatting';
import type { SettingsPane } from 'src/applications/settings/settings-pane.types';

type HeaderControlConfigMember = {
  sheetClass: DocumentSheetConstructor;
  documentClass: any;
  documentSubtype: string;
};

export type ConfigHeaderControlSetting = {
  id: string;
  icon: string;
  title: string;
  location?: SheetHeaderControlPosition;
};

export type HeaderControlConfigContextItem = {
  documentName: string;
  documentType: string;
  title: string;
  controlSettings: ConfigHeaderControlSetting[];
};

export type WorldHeaderControlConfigContext = HeaderControlConfigContextItem[];

export type WorldHeaderControlConfigurationOptions =
  Partial<ApplicationConfiguration> & {
    /** When set, useDefault resets only this sheet type (embedded sheet settings). */
    scope?: { documentName: string; documentType: string };
  };

export class WorldHeaderControlConfigurationQuadroneApplication
  extends SvelteApplicationMixin<Partial<ApplicationConfiguration>>(
    foundry.applications.api.ApplicationV2
  )
  implements SettingsPane
{
  scope?: { documentName: string; documentType: string };

  _configs: WorldHeaderControlConfigContext = $state([]);

  _initialSnapshot = $state('');

  constructor(options: WorldHeaderControlConfigurationOptions = {}) {
    super(options);
    this.scope = options.scope;
  }

  hasChanges = $derived(
    JSON.stringify($state.snapshot(this._configs)) !== this._initialSnapshot
  );

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
    this._configs = this._getConfigs();
    this._resetToGlobalDefaults();

    const component = mount(WorldHeaderControlConfigurationQuadrone, {
      target: node,
      props: {
        app: this,
        context: this._configs,
      },
    });

    return component;
  }

  _getConfigs(
    headerControlSettings: HeaderControlConfiguration = settings.value
      .headerControlConfiguration
  ): WorldHeaderControlConfigContext {
    const members: HeaderControlConfigMember[] =
      FoundryAdapter.getAllTidySheetClassMetadata();

    const config: WorldHeaderControlConfigContext = members.map((member) =>
      this._getConfig(member, headerControlSettings)
    );

    return config.sort((a, b) =>
      a.title.localeCompare(b.title, game.i18n.lang)
    );
  }

  _getConfig(
    member: HeaderControlConfigMember,
    headerControlSettings: HeaderControlConfiguration
  ): HeaderControlConfigContextItem {
    const sheet = new member.sheetClass({
      document: new member.documentClass({
        name: 'hello 👋',
        type: member.documentSubtype,
      }),
    });

    const controls = sheet
      .getAllHeaderControlButtons()
      .sort((l, r) =>
        FoundryAdapter.localize(l.label ?? '').localeCompare(
          FoundryAdapter.localize(r.label ?? ''),
          game.i18n.lang
        )
      );

    const headerSet = new Set(
      (
        headerControlSettings[sheet.document.documentName]?.[
          sheet.document.type
        ] ?? { header: [] }
      ).header
    );

    const controlSettings: ConfigHeaderControlSetting[] = [];

    controls.forEach((control) => {
      const id = coalesce(control.label, control.icon);

      controlSettings.push({
        id,
        icon: control.icon,
        title: FoundryAdapter.localize(control.label),
        location: headerSet.has(id) ? 'header' : (control.position ?? 'menu'),
      });
    });

    return {
      documentName: sheet.document.documentName,
      documentType: sheet.document.type,
      controlSettings: controlSettings,
      title: FoundryAdapter.localize(
        `TYPES.${sheet.document.documentName}.${sheet.document.type}`
      ),
    };
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    const toSave = this._configs.reduce((prev, curr) => {
      prev[curr.documentName] ??= {};
      prev[curr.documentName][curr.documentType] ??= { header: [], menu: [] };
      prev[curr.documentName][curr.documentType].header = [
        ...Iterator.from(curr.controlSettings)
          .filter((s) => s.location === 'header')
          .map((s) => s.id),
      ];
      prev[curr.documentName][curr.documentType].menu = [
        ...Iterator.from(curr.controlSettings)
          .filter((s) => s.location === 'menu')
          .map((s) => s.id),
      ];

      return prev;
    }, {} as HeaderControlConfiguration);

    await FoundryAdapter.setTidySetting('headerControlConfiguration', toSave);

    this._resetToGlobalDefaults();
  }

  _resetToGlobalDefaults() {
    this._initialSnapshot = JSON.stringify($state.snapshot(this._configs));
  }

  undoChanges() {
    this._configs = this._getConfigs();
    this._resetToGlobalDefaults();
  }

  /**
   * Stage controls back to their default placement (as if no header overrides
   * exist). When scoped (embedded sheet settings) only that sheet type resets;
   * otherwise every type does. Persisted on Save, reversible via Undo.
   */
  resetToDefault() {
    const defaults = this._getConfigs({});

    if (this.scope) {
      const { documentName, documentType } = this.scope;
      this._configs = this._configs.map((config) => {
        if (
          config.documentName === documentName &&
          config.documentType === documentType
        ) {
          return (
            defaults.find(
              (d) =>
                d.documentName === documentName &&
                d.documentType === documentType
            ) ?? config
          );
        }
        return config;
      });
      return;
    }

    this._configs = defaults;
  }
}
