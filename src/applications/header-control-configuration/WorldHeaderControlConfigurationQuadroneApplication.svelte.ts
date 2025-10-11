import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import WorldHeaderControlConfigurationQuadrone from './WorldHeaderControlConfigurationQuadrone.svelte';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SheetHeaderControlPosition } from 'src/api';
import type { HeaderControlConfiguration } from 'src/settings/settings.types';
import type { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';

const quadroneSheetRegex = /Tidy.*Quadrone/;

type DocumentSheetConstructor = new (...args: any[]) => InstanceType<
  ReturnType<typeof TidyExtensibleDocumentSheetMixin>
>;

type HeaderControlConfigMember = {
  sheetClass: DocumentSheetConstructor;
  documentClass: any;
  type: string;
};

export type ConfigHeaderControlSetting = {
  id: string;
  icon: string;
  title: string;
  location?: SheetHeaderControlPosition;
};

type HeaderControlConfigContextItem = {
  documentName: string;
  documentType: string;
  title: string;
  controlSettings: ConfigHeaderControlSetting[];
};

export type WorldHeaderControlConfigContext = HeaderControlConfigContextItem[];

export class WorldHeaderControlConfigurationQuadroneApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration>
>(foundry.applications.api.ApplicationV2) {
  _configs: WorldHeaderControlConfigContext = $state([]);

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

    const component = mount(WorldHeaderControlConfigurationQuadrone, {
      target: node,
      props: {
        app: this,
        context: this._configs,
      },
    });

    return component;
  }

  _getConfigs(): WorldHeaderControlConfigContext {
    const members: HeaderControlConfigMember[] = this._getMembers();

    const headerControlSettings = settings.value.headerControlConfiguration;

    const config: WorldHeaderControlConfigContext = members.map((member) =>
      this._getConfig(member, headerControlSettings)
    );

    return config.sort((a, b) =>
      a.title.localeCompare(b.title, game.i18n.lang)
    );
  }

  _getMembers(): HeaderControlConfigMember[] {
    const members: HeaderControlConfigMember[] = [];

    const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

    for (const { name, documentName, hasTypeData } of Object.values<any>(
      foundry.documents
    )) {
      // documentName -> e.g., "Actor", "Item", ...
      if (!hasTypeData) {
        continue;
      }

      if (name.startsWith('Base')) {
        continue;
      }

      const subTypes = game.documentTypes[documentName].filter(
        (t: string) => t !== CONST.BASE_DOCUMENT_TYPE
      );

      if (!subTypes.length) {
        continue;
      }

      for (let subType of subTypes) {
        const { defaultClasses } =
          documentSheetConfig.getSheetClassesForSubType(documentName, subType);

        const className = Object.keys(defaultClasses).find((c: string) =>
          quadroneSheetRegex.test(c)
        );

        if (!className) {
          continue;
        }

        const tidyClass =
          // @ts-expect-error - todo: make this somehow work with TS
          CONFIG[documentName]?.sheetClasses[subType]?.[className]?.cls;

        const documentClass =
          // @ts-expect-error - todo: make this somehow work with TS
          CONFIG[documentName]?.documentClass;

        members.push({
          sheetClass: tidyClass,
          documentClass,
          type: subType,
        });
      }
    }

    return members;
  }

  _getConfig(
    member: HeaderControlConfigMember,
    headerControlSettings: HeaderControlConfiguration
  ): HeaderControlConfigContextItem {
    const sheet = new member.sheetClass({
      document: new member.documentClass({
        name: 'hello 👋',
        type: member.type,
      }),
    });

    const controls = [...sheet.getAllHeaderControls()];

    const headerSet = new Set(
      (
        headerControlSettings[sheet.document.documentName]?.[
          sheet.document.type
        ] ?? { header: [] }
      ).header
    );

    const controlSettings: ConfigHeaderControlSetting[] = [];

    controls.forEach((control) => {
      const id = control.label;

      controlSettings.push({
        id,
        icon: control.icon,
        title: FoundryAdapter.localize(control.label),
        location: headerSet.has(id) ? 'header' : control.position ?? 'menu',
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
