import {
  FoundryAdapter,
  type DocumentSheetConstructor,
} from 'src/foundry/foundry-adapter';
import type { SettingsEditor } from './settings-editors.svelte';
import type { SheetHeaderControlPosition } from 'src/api/api.types';
import type { HeaderControlConfiguration } from 'src/settings/settings.types';
import { settings } from 'src/settings/settings.svelte';
import { coalesce } from 'src/utils/formatting';
import { warn } from 'src/utils/logging';

export type WorldHeaderControlConfigurationSettingsEditor =
  SettingsEditor<WorldHeaderControlConfigContext> & {
    resetEntryToDefault(documentName: string, documentType: string): void;
    undoEntryChanges(documentName: string, documentType: string): void;
  };

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

export type WorldHeaderControlConfigScope = {
  documentName: string;
  documentType: string;
};

export function getWorldHeaderControlConfigurationSettingsEditor(
  // TODO: We are going to use a composite editor in place of this. Eliminate when able.
  scope?: WorldHeaderControlConfigScope,
): WorldHeaderControlConfigurationSettingsEditor {
  const current = $state<WorldHeaderControlConfigContext>(getConfigs());

  let initialSnapshot = $state(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function snapshotConfig(config: WorldHeaderControlConfigContext) {
    return $state.snapshot(config);
  }

  function getConfigs(
    headerControlSettings: HeaderControlConfiguration = settings.value
      .headerControlConfiguration,
  ): WorldHeaderControlConfigContext {
    const members: HeaderControlConfigMember[] =
      FoundryAdapter.getAllTidySheetClassMetadata();

    const config: WorldHeaderControlConfigContext = members.map((member) =>
      getConfig(member, headerControlSettings),
    );

    return config.sort((a, b) =>
      a.title.localeCompare(b.title, game.i18n.lang),
    );
  }

  function getConfig(
    member: HeaderControlConfigMember,
    headerControlSettings: HeaderControlConfiguration,
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
          game.i18n.lang,
        ),
      );

    const headerSet = new Set(
      (
        headerControlSettings[sheet.document.documentName]?.[
          sheet.document.type
        ] ?? { header: [] }
      ).header,
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
        `TYPES.${sheet.document.documentName}.${sheet.document.type}`,
      ),
    };
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    resetEntryToDefault(documentName: string, documentType: string) {
      const defaults = getConfigs({});
      const defaultEntry = defaults.find(
        (d) =>
          d.documentName === documentName && d.documentType === documentType,
      );

      if (!defaultEntry) {
        warn(
          `Default world header control entry not found for ${documentName} ${documentType}. Unable to reset to default.`,
        );
        return;
      }

      for (const entry of this.value) {
        if (
          documentName === entry.documentName &&
          documentType === entry.documentType
        ) {
          entry.controlSettings = defaultEntry.controlSettings;
          break;
        }
      }
    },

    resetToDefault() {
      const defaults = getConfigs({});

      if (scope) {
        const { documentName, documentType } = scope;
        this.value = this.value.map((config) => {
          if (
            config.documentName === documentName &&
            config.documentType === documentType
          ) {
            return (
              defaults.find(
                (d) =>
                  d.documentName === documentName &&
                  d.documentType === documentType,
              ) ?? config
            );
          }
          return config;
        });
        return;
      }

      this.value = defaults;
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    useDefaultLabel: 'TIDY5E.UseDefault',

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
    },

    async save() {
      const toSave = current.reduce((prev, curr) => {
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

      initialSnapshot = JSON.stringify(snapshotConfig(current));
    },

    undoChanges() {
      this.value = JSON.parse(initialSnapshot);
    },

    undoEntryChanges(documentName: string, documentType: string) {
      const initial = JSON.parse(
        initialSnapshot,
      ) as WorldHeaderControlConfigContext;
      const initialEntry = initial.find(
        (entry) =>
          entry.documentName === documentName &&
          entry.documentType === documentType,
      );

      if (!initialEntry) {
        warn(
          `Initial world header control entry not found for ${documentName} ${documentType}. Unable to reset to default.`,
        );
        return;
      }

      for (const entry of this.value) {
        if (
          documentName === entry.documentName &&
          documentType === entry.documentType
        ) {
          entry.controlSettings = initialEntry.controlSettings;
          break;
        }
      }
    },

    get value() {
      return current;
    },

    set value(value) {
      current.length = 0;
      current.push(...value);
    },
  };
}
