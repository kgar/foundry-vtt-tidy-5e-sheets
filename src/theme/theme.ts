import type {
  ThemeColorSetting,
  Tidy5eTheme as Tidy5eTheme,
} from 'src/types/theme';
import { themeVariables } from './theme-reference';
import { debug } from 'src/utils/logging';
import { SettingsProvider } from 'src/settings/settings';
import { KeyedObjectEntries as getKeyedObjectEntries } from 'src/utils/iteration';

export function applyTheme(
  theme: Tidy5eTheme,
  colorPickerEnabledOverride: boolean | null = null
) {
  try {
    const styleTagId = 'tidy5e-sheet-kgar-theme';
    let existingThemeStyle = document.getElementById(styleTagId);

    if (existingThemeStyle) {
      existingThemeStyle.remove();
    }

    // Temporary measure for applying color overrides. Larger theme overhaul coming later.
    const overrideBaseTheme =
      (colorPickerEnabledOverride === null &&
        SettingsProvider.settings.colorPickerEnabled.get()) ||
      colorPickerEnabledOverride;
      
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
  SettingsProvider.settings.colorScheme.options.onChange(
    currentTheme,
    colorPickerEnabledOverride
  );
}

export function getThemeableColors(): ThemeColorSetting[] {
  return getKeyedObjectEntries(SettingsProvider.settings)
    .filter(([, value]) => 'representsCssVariable' in value)
    .map(([key, value]) => ({
      key,
      name: value.options.name,
      hint: 'hint' in value.options ? value.options.hint : '',
      cssVariable:
        'representsCssVariable' in value ? value.representsCssVariable : '',
    }));
}
