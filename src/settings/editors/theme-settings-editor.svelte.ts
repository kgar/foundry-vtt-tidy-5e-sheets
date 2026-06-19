import type { ThemeColorSettingConfigEntry } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import type {
  PortraitShape,
  ThemeSettingsV3,
} from 'src/theme/theme-quadrone.types';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';
import type { SettingsEditor } from './settings-editors.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ThemeSettingsEditor = SettingsEditor<ThemeSettingsContext> & {
  actorHeaderBackgroundSupportedActorTypes: Set<string>;

  /** The optional document for sheet-specific theming. */
  document?: Actor5e | Item5e;

  /**
   * Maps the editor context data to a partial representation of the
   * persisted settings data model, only keeping changed fields.
   */
  mapContextToChangedSettings(
    context: ThemeSettingsContext,
  ): Partial<ThemeSettingsV3>;

  /**
   * Map from the latest version of settings to the
   * theme settings editor context.
   */
  mapFromSettings(source: Partial<ThemeSettingsV3>): ThemeSettingsContext;
};

export type ThemeSettingsContext = {
  accentColor: string;
  useBasicTheme: boolean | null;
  useHeaderBackground: boolean | null;
  headerColor: string;
  actorHeaderBackground: string;
  headerBackgroundColor: string;
  itemSidebarBackground: string;
  portraitShape: PortraitShape | undefined;
  rarityColors: ThemeColorSettingConfigEntry[];
  spellPreparationMethodColors: ThemeColorSettingConfigEntry[];
};

export function getThemeSettingsEditor(document?: any): ThemeSettingsEditor {
  const current = $state<ThemeSettingsContext>(getSettings());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function snapshotConfig(config: ThemeSettingsContext) {
    return $state.snapshot(config);
  }

  function mapFromSettings(
    source: Partial<ThemeSettingsV3>,
  ): ThemeSettingsContext {
    const nullableBool = (
      value: boolean | null | undefined,
      fallback: boolean,
    ) => (!!document ? (value ?? null) : (value ?? fallback));

    return {
      accentColor: source.accentColor ?? '',
      useBasicTheme: nullableBool(source.useBasicTheme, false),
      useHeaderBackground: nullableBool(source.useHeaderBackground, true),
      headerColor: source.headerColor ?? '',
      actorHeaderBackground: source.actorHeaderBackground ?? '',
      headerBackgroundColor: source.headerBackgroundColor ?? '',
      itemSidebarBackground: source.itemSidebarBackground ?? '',
      portraitShape: source.portraitShape,
      rarityColors: Object.entries(CONFIG.DND5E.itemRarity).map(
        ([key, label]) => ({
          label,
          key,
          value: source.rarityColors?.[key] ?? '',
        }),
      ),
      spellPreparationMethodColors: Object.entries(
        CONFIG.DND5E.spellcasting,
      ).map(([key, config]) => ({
        label: config.label,
        key,
        value: source.spellPreparationMethodColors?.[key] ?? '',
      })),
    };
  }

  function getSettings(): ThemeSettingsContext {
    const source = document
      ? (TidyFlags.sheetThemeSettings.get(document) ?? {})
      : ThemeQuadrone.getChangedWorldThemeSettingsForForm();

    return mapFromSettings(source);
  }

  function collectColors(entries: ThemeColorSettingConfigEntry[]) {
    return entries
      .filter((t) => !isNil(t.value.trim(), ''))
      .reduce<Record<string, string>>((prev, curr) => {
        prev[curr.key] = curr.value;
        return prev;
      }, {});
  }

  function mapContextToChangedSettings(
    context: ThemeSettingsContext,
  ): Partial<ThemeSettingsV3> {
    const currentSettings = context;
    const changedSettings: Partial<ThemeSettingsV3> = {};

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

    const rarities = collectColors(currentSettings.rarityColors);
    if (Object.keys(rarities).length) {
      changedSettings.rarityColors = rarities;
    }

    const methods = collectColors(currentSettings.spellPreparationMethodColors);
    if (Object.keys(methods).length) {
      changedSettings.spellPreparationMethodColors = methods;
    }

    return changedSettings;
  }

  return {
    actorHeaderBackgroundSupportedActorTypes: new Set<string>([
      CONSTANTS.SHEET_TYPE_CHARACTER,
      CONSTANTS.SHEET_TYPE_NPC,
      CONSTANTS.SHEET_TYPE_VEHICLE,
      CONSTANTS.SHEET_TYPE_GROUP,
      CONSTANTS.SHEET_TYPE_ENCOUNTER,
    ]),

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

      if (document) {
        if (Object.keys(changedSettings).length === 0) {
          await TidyFlags.sheetThemeSettings.unset(document);
        } else {
          await ThemeQuadrone.saveSheetThemeSettings(
            document,
            changedSettings as ThemeSettingsV3,
          );
        }
      } else {
        await ThemeQuadrone.saveWorldThemeSettings(
          changedSettings as ThemeSettingsV3,
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
      const keys = Object.keys(current) as (keyof ThemeSettingsContext)[];

      for (const key of keys) {
        delete current[key];
      }

      Object.assign(current, value);
    },
  };
}
