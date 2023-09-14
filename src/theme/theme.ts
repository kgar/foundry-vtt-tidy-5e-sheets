import type {
  ThemeColorSetting,
  Tidy5eTheme as Tidy5eTheme,
} from 'src/types/theme';
import { themeVariables } from './theme-reference';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider } from 'src/settings/settings';

export function applyTheme(theme: Tidy5eTheme) {
  try {
    const styleTagId = 'tidy5e-sheet-kgar-theme';
    let existingThemeStyle = document.getElementById(styleTagId);

    if (existingThemeStyle) {
      existingThemeStyle.remove();
    }

    // Temporary measure for applying color overrides. Larger theme overhaul coming later.
    if (SettingsProvider.settings.colorPickerEnabled.get()) {
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

export function applyCurrentTheme() {
  const currentTheme = SettingsProvider.settings.colorScheme.get();
  SettingsProvider.settings.colorScheme.options.onChange(currentTheme);
}

export function getThemeableColors(): ThemeColorSetting[] {
  return [
    {
      key: 'colorPickerPrimaryAccent',
      name: SettingsProvider.settings.colorPickerPrimaryAccent.options.name,
      hint: SettingsProvider.settings.colorPickerPrimaryAccent.options.hint,
      cssVariable: '--t5ek-primary-accent-color',
    },
    {
      key: 'colorPickerEquipped',
      name: SettingsProvider.settings.colorPickerEquipped.options.name,
      hint: SettingsProvider.settings.colorPickerEquipped.options.hint,
      cssVariable: '--t5ek-equipped-background',
    },
    {
      key: 'colorPickerEquippedOutline',
      name: SettingsProvider.settings.colorPickerEquippedOutline.options.name,
      hint: SettingsProvider.settings.colorPickerEquippedOutline.options.hint,
      cssVariable: '--t5ek-equipped-item-grid-tile-accent-color',
    },
    {
      key: 'colorPickerEquippedAccent',
      name: SettingsProvider.settings.colorPickerEquippedAccent.options.name,
      hint: SettingsProvider.settings.colorPickerEquippedAccent.options.hint,
      cssVariable: '--t5ek-equipped-item-grid-tile-accent-color',
    },
    {
      key: 'colorPickerPrepared',
      name: SettingsProvider.settings.colorPickerPrepared.options.name,
      hint: SettingsProvider.settings.colorPickerPrepared.options.hint,
      cssVariable: '--t5ek-prepared-background',
    },
    {
      key: 'colorPickerPreparedOutline',
      name: SettingsProvider.settings.colorPickerPreparedOutline.options.name,
      hint: SettingsProvider.settings.colorPickerPreparedOutline.options.hint,
      cssVariable: '--t5ek-prepared-item-grid-tile-outline-color',
    },
    {
      key: 'colorPickerPreparedAccent',
      name: SettingsProvider.settings.colorPickerPreparedAccent.options.name,
      hint: SettingsProvider.settings.colorPickerPreparedAccent.options.hint,
      cssVariable: '--t5ek-prepared-item-grid-tile-accent-color',
    },
    {
      key: 'colorPickerPact',
      name: SettingsProvider.settings.colorPickerPact.options.name,
      hint: SettingsProvider.settings.colorPickerPact.options.hint,
      cssVariable: '--t5ek-pact-background',
    },
    {
      key: 'colorPickerPactOutline',
      name: SettingsProvider.settings.colorPickerPactOutline.options.name,
      hint: SettingsProvider.settings.colorPickerPactOutline.options.hint,
      cssVariable: '--t5ek-pact-outline-color',
    },
    {
      key: 'colorPickerPactAccent',
      name: SettingsProvider.settings.colorPickerPactAccent.options.name,
      hint: SettingsProvider.settings.colorPickerPactAccent.options.hint,
      cssVariable: '--t5ek-pact-accent-color',
    },
    {
      key: 'colorPickerAtWill',
      name: SettingsProvider.settings.colorPickerAtWill.options.name,
      hint: SettingsProvider.settings.colorPickerAtWill.options.hint,
      cssVariable: '--t5ek-atwill-background',
    },
    {
      key: 'colorPickerAtWillOutline',
      name: SettingsProvider.settings.colorPickerAtWillOutline.options.name,
      hint: SettingsProvider.settings.colorPickerAtWillOutline.options.hint,
      cssVariable: '--t5ek-atwill-outline-color',
    },
    {
      key: 'colorPickerAtWillAccent',
      name: SettingsProvider.settings.colorPickerAtWillAccent.options.name,
      hint: SettingsProvider.settings.colorPickerAtWillAccent.options.hint,
      cssVariable: '--t5ek-atwill-accent-color',
    },
    {
      key: 'colorPickerInnate',
      name: SettingsProvider.settings.colorPickerInnate.options.name,
      hint: SettingsProvider.settings.colorPickerInnate.options.hint,
      cssVariable: '--t5ek-innate-background',
    },
    {
      key: 'colorPickerInnateOutline',
      name: SettingsProvider.settings.colorPickerInnateOutline.options.name,
      hint: SettingsProvider.settings.colorPickerInnateOutline.options.hint,
      cssVariable: '--t5ek-innate-outline',
    },
    {
      key: 'colorPickerInnateAccent',
      name: SettingsProvider.settings.colorPickerInnateAccent.options.name,
      hint: SettingsProvider.settings.colorPickerInnateAccent.options.hint,
      cssVariable: '--t5ek-innate-accent',
    },
    {
      key: 'colorPickerAlwaysPrepared',
      name: SettingsProvider.settings.colorPickerAlwaysPrepared.options.name,
      hint: SettingsProvider.settings.colorPickerAlwaysPrepared.options.hint,
      cssVariable: '--t5ek-alwaysprepared-background',
    },
    {
      key: 'colorPickerAlwaysPreparedOutline',
      name: SettingsProvider.settings.colorPickerAlwaysPreparedOutline.options
        .name,
      hint: SettingsProvider.settings.colorPickerAlwaysPreparedOutline.options
        .hint,
      cssVariable: '--t5ek-alwaysprepared-outline-color',
    },
    {
      key: 'colorPickerAlwaysPreparedAccent',
      name: SettingsProvider.settings.colorPickerAlwaysPreparedAccent.options
        .name,
      hint: SettingsProvider.settings.colorPickerAlwaysPreparedAccent.options
        .hint,
      cssVariable: '--t5ek-alwaysprepared-accent-color',
    },
  ];
}
