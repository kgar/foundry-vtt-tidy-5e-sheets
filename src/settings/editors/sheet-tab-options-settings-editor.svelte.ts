import type { Actor5e } from 'src/types/types';
import type { SettingsEditor } from './settings-editors.svelte';
import type { Item5e } from 'src/types/item.types';
import { mapGetOrInsert } from 'src/utils/map';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type {
  SectionConfig,
  SheetTabSectionConfigs,
} from 'src/features/sections/sections.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SheetTabsConfigurationSettingsEditor } from './sheet-tabs-configuration-settings-editor.svelte';
import type { SheetSectionConfiguration } from 'src/runtime/types';

export type BooleanSetting = {
  type: 'boolean';
  label: string;
  checked?: boolean;
  prop: string;
  doc?: any;
  default?: boolean;
};

export type RadioSettingOption<TValue> = {
  label: string;
  value: TValue;
  checked?: boolean;
};

export type RadioSetting<TValue> = {
  type: 'radio';
  options: RadioSettingOption<TValue>[];
  selected?: TValue;
  prop: string;
  doc?: any;
  default?: TValue;
};

export type SettingsTabNavigator = {
  selectTab(id: string): void;
};

export type ButtonSetting = {
  type: 'button';
  icon?: string;
  label?: string;
  onclick: (ev: MouseEvent & { currentTarget: HTMLElement }, doc: any) => void;
};

export type ButtonNavigation = {
  type: 'navigationButton';
  icon?: string;
  label?: string;
  onclick: (
    ev: MouseEvent & { currentTarget: HTMLElement },
    application: SheetTabOptionsSettingsEditor,
  ) => void;
};

export type SectionSetting =
  | BooleanSetting
  | RadioSetting<any>
  | ButtonSetting
  | ButtonNavigation;

export type SectionOptionGroup = {
  title: string;
  settings: SectionSetting[];
};

export type SheetTabOptionsSettingsEditorParams = {
  document: Actor5e | Item5e;
  settings: {
    optionsGroups?: SectionOptionGroup[];
    sections: SheetSectionConfiguration[];
    defaultSections: SheetSectionConfiguration[];
    tabId: string;
    formTitle: string;
  };
  onSave?: (config: SheetTabOptionsSettingsEditorContext) => Promise<void>;
  navigator: SettingsTabNavigator;
  sheetTabsConfigurationSettingsEditor?: SheetTabsConfigurationSettingsEditor;
};

export type SectionConfigItem = {
  key: string;
  label: string;
  show: boolean;
};

export type SheetTabOptionsSettingsEditorContext = {
  sections: SectionConfigItem[];
  optionsGroups: SectionOptionGroup[];
};

export type SheetTabOptionsSettingsEditor =
  SettingsEditor<SheetTabOptionsSettingsEditorContext> & {
    formTitle: string;
    document: Actor5e | Item5e;
    navigator: SettingsTabNavigator;
  };

export function getSheetTabOptionsSettingsEditor(
  params: SheetTabOptionsSettingsEditorParams,
): SheetTabOptionsSettingsEditor {
  let { document, settings, onSave, navigator } = params;

  const current = $state<SheetTabOptionsSettingsEditorContext>({
    optionsGroups: settings.optionsGroups ?? [],
    sections: mapSectionBaseToConfig(settings.sections),
  });

  // initialize the option group values
  for (const group of current.optionsGroups) {
    for (const setting of group.settings) {
      if (setting.type === 'button' || setting.type === 'navigationButton') {
        continue;
      }

      const doc = setting.doc ?? document;
      if (setting.type === 'boolean') {
        setting.checked =
          foundry.utils.getProperty(doc, setting.prop) ?? setting.default;
      } else if (setting.type === 'radio') {
        const selected =
          foundry.utils.getProperty(doc, setting.prop) ?? setting.default;
        setting.selected = selected;
      }
    }
  }

  const original = snapshotConfig(current);

  const defaultSections = mapSectionBaseToConfig(settings.defaultSections);

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(
    JSON.stringify(snapshotConfig(current)) !== initialSnapshot,
  );

  function sectionsAreDefault() {
    return (
      JSON.stringify($state.snapshot(current.sections)) ===
      JSON.stringify(defaultSections)
    );
  }

  function mapSectionBaseToConfig(sections: SheetSectionConfiguration[]) {
    return sections.map((s) => ({
      key: s.key,
      label: FoundryAdapter.localize(s.label),
      show: s.show,
    }));
  }

  function snapshotOptionGroupValues(
    optionsGroups: SectionOptionGroup[],
  ): { title: string; values: (boolean | unknown | undefined)[] }[] {
    return optionsGroups.map((group) => ({
      title: group.title,
      values: group.settings.map((setting) => {
        if (setting.type === 'boolean') {
          return setting.checked;
        }
        if (setting.type === 'radio') {
          return setting.selected;
        }
        return undefined;
      }),
    }));
  }

  function snapshotConfig(config: SheetTabOptionsSettingsEditorContext) {
    return {
      sections: $state.snapshot(config.sections),
      optionsGroups: snapshotOptionGroupValues(config.optionsGroups),
      tabConfig:
        params.sheetTabsConfigurationSettingsEditor?.value.entry.tabs.find(
          (t) => t.id === params.settings.tabId,
        ),
      sidebar:
        params.sheetTabsConfigurationSettingsEditor?.value.entry
          .sidebarExpandedByTabId?.[params.settings.tabId],
    };
  }

  function applyOptionGroupValues(
    baseline: ReturnType<typeof snapshotOptionGroupValues>,
    target: SheetTabOptionsSettingsEditorContext,
  ) {
    target.optionsGroups.forEach((group, groupIndex) => {
      const values = baseline[groupIndex]?.values ?? [];
      group.settings.forEach((setting, settingIndex) => {
        if (setting.type === 'boolean') {
          setting.checked = values[settingIndex] as boolean | undefined;
        } else if (setting.type === 'radio') {
          setting.selected = values[settingIndex];
        }
      });
    });
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    document,

    formTitle: settings.formTitle,

    navigator: navigator,

    resetToDefault() {
      for (const group of current.optionsGroups) {
        for (const setting of group.settings) {
          if (setting.type === 'boolean') {
            setting.checked = setting.default ?? false;
          } else if (setting.type === 'radio') {
            setting.selected = setting.default;
          }
        }
      }
      this.value.sections = defaultSections;
      params.sheetTabsConfigurationSettingsEditor?.resetEntryToDefault(
        params.settings.tabId,
      );
    },

    async save() {
      const thisDocumentData: Record<string, any> = {};
      const documentsToSave: Map<any, Record<string, any>> = new Map([
        [document, thisDocumentData],
      ]);

      for (const group of this.value.optionsGroups) {
        for (const setting of group.settings) {
          if (
            setting.type === 'button' ||
            setting.type === 'navigationButton'
          ) {
            continue;
          }

          const doc = setting.doc ?? document;
          const toSave = mapGetOrInsert(documentsToSave, doc, {});

          if (setting.type === 'boolean') {
            toSave[setting.prop] = setting.checked;
          } else if (setting.type === 'radio') {
            toSave[setting.prop] = setting.selected;
          }
        }
      }

      const sectionConfig: SheetTabSectionConfigs =
        TidyFlags.sectionConfig.get(document) ?? {};

      if (sectionsAreDefault()) {
        if (game.release.generation < 14) {
          delete sectionConfig[settings.tabId];
          // @ts-expect-error
          sectionConfig[`-=${settings.tabId}`] = null;
        } else {
          sectionConfig[settings.tabId] = _del;
        }
      } else {
        sectionConfig[settings.tabId] = this.value.sections.reduce<
          Record<string, SectionConfig>
        >((result, curr, i) => {
          result[curr.key] = {
            key: curr.key,
            order: i,
            show: curr.show !== false,
          };
          return result;
        }, {});
      }
      thisDocumentData[TidyFlags.sectionConfig.prop] = sectionConfig;

      for (const [doc, toSave] of documentsToSave) {
        await doc.update(toSave);
      }

      // When embedded in the sheet settings dialog, the per-tab visibility controls
      // mutate the shared tab-config entry; persist those alongside the section config.
      //   await this.parentSettings?.tabDisplaySettingsTab?.apply();
      if (onSave) {
        await onSave(this.value);
      }

      const newOriginal = snapshotConfig(current);
      original.optionsGroups = newOriginal.optionsGroups;
      original.sections = newOriginal.sections;
      initialSnapshot = JSON.stringify(snapshotConfig(current));
    },

    undoChanges() {
      current.sections = original.sections.map((section) => ({ ...section }));
      applyOptionGroupValues(original.optionsGroups, current);
      params.sheetTabsConfigurationSettingsEditor?.undoEntryChanges(
        params.settings.tabId,
      );
    },

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

    get value() {
      return current;
    },

    set value(value) {
      const toApply = snapshotOptionGroupValues(value.optionsGroups);
      applyOptionGroupValues(toApply, current);
      current.sections = structuredClone(value.sections);
    },
  };
}
