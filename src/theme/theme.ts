import type {
  ThemeColorSetting,
  Tidy5eTheme as Tidy5eTheme,
  Tidy5eThemeDataV1,
} from 'src/types/theme.types';
import { themeVariables } from './theme-reference';
import { debug } from 'src/utils/logging';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { defaultDarkTheme } from './default-dark-theme';
import { defaultLightTheme } from './default-light-theme';
import { Colord } from 'colord';
import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';

export function applyTheme(
  theme: Tidy5eTheme,
  colorPickerEnabledOverride: boolean | null = null
) {
  try {
    const styleTagId = 'tidy5e-sheet-theme';
    let existingThemeStyle = document.getElementById(styleTagId);

    if (existingThemeStyle) {
      existingThemeStyle.remove();
    }

    // Temporary measure for applying color overrides. Larger theme overhaul coming later.
    const overrideBaseTheme =
      (colorPickerEnabledOverride === null &&
        SettingsProvider.settings.colorPickerEnabled.get()) ||
      colorPickerEnabledOverride === true;

    if (overrideBaseTheme) {
      theme = overrideColorPickerSettings(theme);
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `
    <style id="${styleTagId}">
      :root {
        ${Object.entries(theme.variables)
          .filter(([variable]) => variable in themeVariables)
          .map(([variable, value]) => `${variable}: ${value};`)
          .join('\n')}
      }
    </style>
    `
    );
  } catch (e) {
    console.error(e);
    debug(
      'Unable to apply Tidy 5e style tag; falling back to root style properties.'
    );
    Object.keys(themeVariables).forEach((variable) => {
      document.documentElement.style.setProperty(
        variable,
        theme.variables[variable] ?? null
      );
    });
  }
}

function overrideColorPickerSettings(theme: Tidy5eTheme) {
  const overriddenTheme = structuredClone(theme);

  const themeableColors = getThemeableColors();
  for (let color of themeableColors) {
    overriddenTheme.variables[color.cssVariable] = SettingsProvider.settings[
      color.key
    ]
      .get()
      ?.toString();
  }

  return overriddenTheme;
}

export function applyCurrentTheme(
  colorPickerEnabledOverride: boolean | null = null
) {
  const currentTheme = SettingsProvider.settings.colorScheme.get();
  const theme = getThemeOrDefault(currentTheme);
  applyTheme(theme, colorPickerEnabledOverride);
}

export function getThemeableColors(): ThemeColorSetting[] {
  return Object.entries(SettingsProvider.settings)
    .filter(([, value]) => 'representsCssVariable' in value)
    .map(([key, value]) => ({
      key: key as any,
      name: value.options.name,
      hint: 'hint' in value.options ? value.options.hint : '',
      cssVariable:
        'representsCssVariable' in value ? value.representsCssVariable : '',
    }));
}

export function getThemeOrDefault(themeId: string): Tidy5eTheme {
  if (themeId === CONSTANTS.THEME_ID_DEFAULT) {
    const defaultThemeId = SettingsProvider.settings.defaultTheme.get();
    themeId = defaultThemeId;
  }

  const themes: Record<string, Tidy5eTheme> = {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
    // TODO: Aggregate all other available themes
  };

  return themes[themeId] ?? defaultLightTheme;
}

type ProcessedColor = {
  original: string;
  hexa?: string;
  parsed: boolean;
};

export function trySetRootCssVariable(
  cssVariable: string,
  value: string,
  colorPickerEnabled: boolean
) {
  if (colorPickerEnabled) {
    document.documentElement.style.setProperty(cssVariable, value);
  }
}

export function clearTidy5eRootCssVariables() {
  Object.keys(themeVariables).forEach((key) =>
    document.documentElement.style.removeProperty(key)
  );
}

export function colorToHexaString(color: Colord | undefined): string {
  if (color?.isValid()) {
    return color.toHex();
  }

  return '';
}

export function settingValueToHexaString(value: string): ProcessedColor {
  const result = colorToHexaString(new Colord(value.toString()));

  if (result !== '') {
    return {
      original: value?.toString() ?? '',
      hexa: result,
      parsed: true,
    };
  }

  var ctx = document.createElement('canvas').getContext('2d');
  if (ctx) {
    ctx.fillStyle = value?.toString() ?? '';
    return {
      original: value,
      hexa: ctx.fillStyle,
      parsed: true,
    };
  }

  return {
    original: value,
    parsed: true,
  };
}

export function extractSettingsUpdateDeltaFromTheme(
  theme: Tidy5eThemeDataV1,
  themeableColors: ThemeColorSetting[]
) {
  return Object.keys(theme.variables).reduce<Record<string, string>>(
    (prev, key) => {
      const themeableColor = themeableColors.find((c) => c.cssVariable === key);
      if (themeableColor) {
        prev[themeableColor.key] = theme.variables[key];
      }

      return prev;
    },
    {}
  );
}

export function validateImportFile(theme: Tidy5eThemeDataV1) {
  return theme.version === 1 && typeof theme.variables === 'object';
}

export function getInventoryItemThemeBackground(item: Item5e) {
  if (item?.system?.equipped) {
    return '--t5e-equipped-background';
  }
}

export function getSpellItemThemeBackground(spell: Item5e) {
  if (
    spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_INNATE
  ) {
    return '--t5e-innate-background';
  }

  if (
    spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_RITUAL
  ) {
    return '--t5e-ritual-only-background';
  }

  if (
    spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_ATWILL
  ) {
    return '--t5e-atwill-background';
  }

  if (spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_PACT) {
    return '--t5e-pact-background';
  }

  if (
    spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS
  ) {
    return '--t5e-alwaysprepared-background';
  }

  if (spell.system.preparation.prepared) {
    return '--t5e-prepared-background';
  }

  // TODO: in the future, offer up and API for this, or use a slugify convention based on what modes exist
}
