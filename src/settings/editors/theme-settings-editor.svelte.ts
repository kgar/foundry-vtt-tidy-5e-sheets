import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Theme } from 'src/theme/theme';
import type {
  PortraitShape,
  ThemeColorSetting,
  ThemeSettings,
} from 'src/theme/theme.types';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';
import {
  confirmUseDefault,
  type SettingsEditor,
} from './settings-editors.svelte';
import type { ThemeColorSettingOption } from '../settings.types';

export type ThemeColorSettingConfigEntry = ThemeColorSetting & {
  label: string;
};

export type ThemeSettingsEditor = SettingsEditor<ThemeSettingsContext> & {
  /** The document for sheet-specific theming. */
  document: Actor5e | Item5e;

  /**
   * Maps the editor context data to a partial representation of the
   * persisted settings data model, only keeping changed fields.
   */
  mapContextToChangedSettings(
    context: ThemeSettingsContext,
  ): Partial<ThemeSettings>;

  /**
   * Map from the latest version of settings to the
   * theme settings editor context.
   */
  mapFromSettings(source: Partial<ThemeSettings>): ThemeSettingsContext;

  rarities: ThemeColorSettingOption[];

  spellMethods: ThemeColorSettingOption[];
};

export type ThemeSettingsContext = Partial<ThemeSettings>;

export function getThemeSettingsEditor(document: any): ThemeSettingsEditor {
  const current = $state<ThemeSettingsContext>(getSettings());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function snapshotConfig(config: ThemeSettingsContext) {
    return $state.snapshot(config);
  }

  function mapFromSettings(
    source: Partial<ThemeSettings>,
  ): ThemeSettingsContext {
    const nullableBool = (
      value: boolean | null | undefined,
      fallback: boolean,
    ) => (!!document ? (value ?? null) : (value ?? fallback));

    return {
      accentColor: source.accentColor ?? '',
      useBasicTheme: source.useBasicTheme,
      useHeaderBackground: source.useHeaderBackground,
      headerColor: source.headerColor ?? '',
      actorHeaderBackground: source.actorHeaderBackground ?? '',
      headerBackgroundColor: source.headerBackgroundColor ?? '',
      itemSidebarBackground: source.itemSidebarBackground ?? '',
      portraitShape: source.portraitShape,
      rarityColors: source.rarityColors ?? {},
      spellPreparationMethodColors: source.spellPreparationMethodColors ?? {},
    };
  }

  function getSettings(): ThemeSettingsContext {
    const source = TidyFlags.sheetThemeSettings.get(document) ?? {};

    return mapFromSettings(source);
  }

  function collectColors(colors: Record<string, string>) {
    return Object.entries(colors)
      .filter(([key, value]) => !isNil(value?.trim(), ''))
      .reduce<Record<string, string>>((prev, [key, value]) => {
        prev[key] = value;
        return prev;
      }, {});
  }

  function mapContextToChangedSettings(
    context: ThemeSettingsContext,
  ): Partial<ThemeSettings> {
    const currentSettings = context;
    const changedSettings: Partial<ThemeSettings> = {};

    const stringFields = [
      'accentColor',
      'headerColor',
      'actorHeaderBackground',
      'headerBackgroundColor',
      'itemSidebarBackground',
    ] as const;
    for (const key of stringFields) {
      if (!isNil(currentSettings[key], '')) {
        changedSettings[key] = currentSettings[key];
      }
    }

    if (currentSettings.useBasicTheme !== null) {
      changedSettings.useBasicTheme = currentSettings.useBasicTheme;
    }
    if (currentSettings.useHeaderBackground !== null) {
      changedSettings.useHeaderBackground = currentSettings.useHeaderBackground;
    }
    if (currentSettings.portraitShape !== undefined) {
      changedSettings.portraitShape = currentSettings.portraitShape;
    }

    const rarities = collectColors(currentSettings.rarityColors ?? {});
    if (Object.keys(rarities).length) {
      changedSettings.rarityColors = rarities;
    }

    const methods = collectColors(
      currentSettings.spellPreparationMethodColors ?? {},
    );
    if (Object.keys(methods).length) {
      changedSettings.spellPreparationMethodColors = methods;
    }

    return changedSettings;
  }

  return {
    document: document,

    get hasChanges() {
      return hasChanges;
    },

    mapContextToChangedSettings: mapContextToChangedSettings,

    mapFromSettings: mapFromSettings,

    resetToDefault() {
      this.value = mapFromSettings({});
    },

    async save() {
      const changedSettings = mapContextToChangedSettings(this.value);

      if (Object.keys(changedSettings).length === 0) {
        await TidyFlags.sheetThemeSettings.unset(document);
      } else {
        await Theme.saveSheetThemeSettings(
          document,
          changedSettings as ThemeSettings,
        );
      }

      initialSnapshot = JSON.stringify(snapshotConfig(this.value));
    },

    undoChanges() {
      this.value = JSON.parse(initialSnapshot);
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    useDefaultLabel: undefined,

    async useDefault() {
      const proceed = await confirmUseDefault();

      if (!proceed) {
        return;
      }

      this.resetToDefault();
    },

    get value() {
      return current;
    },

    set value(value) {
      const keys = Object.keys(current) as (keyof ThemeSettingsContext)[];

      for (const key of keys) {
        delete current[key];
      }

      Object.assign(current, value);
    },

    rarities: Object.entries(CONFIG.DND5E.itemRarity).map(([key, label]) => ({
      label,
      key,
    })),

    spellMethods: Object.entries(CONFIG.DND5E.spellcasting).map(
      ([key, config]) => ({
        label: config.label,
        key,
      }),
    ),
  };
}
