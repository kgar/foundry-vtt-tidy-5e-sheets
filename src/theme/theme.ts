import type {
  ThemeColorSetting,
  Tidy5eThemeDataV1,
} from 'src/types/theme.types';
import { debug } from 'src/utils/logging';
import { settings, SettingsProvider } from 'src/settings/settings.svelte';
import { Colord } from 'colord';
import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import { coalesce } from 'src/utils/formatting';
import { isNil } from 'src/utils/data';

const tidyStyleTagId = 'tidy5e-sheet-theme';

export function getThemeV2(doc?: any) {
  let theme: string | undefined = undefined;
  if (doc) {
    theme =
      foundry.applications.apps.DocumentSheetConfig.getSheetThemeForDocument(
        doc
      );
  }

  if (!theme) {
    const { colorScheme } = game.settings.get('core', 'uiConfig');
    theme = colorScheme.application;
  }

  if (!theme) {
    if (matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    } else if (matchMedia('(prefers-color-scheme: light)').matches) {
      theme = 'light';
    }
  }

  return coalesce(theme, CONSTANTS.THEME_ID_DEFAULT_LIGHT);
}

export function applyThemeColorsToHead(variables: Record<string, string>) {
  try {
    removeExistingTidyThemeStyleTag();

    document.head.insertAdjacentHTML(
      'beforeend',
      `
    <style id="${tidyStyleTagId}">
      .tidy5e-sheet.classic {
        ${Object.entries(variables)
          .filter(([_, value]) => !isNil(value?.trim(), ''))
          .map(([variable, value]) => `${variable}: ${value};`)
          .join('\n')}
      }
    </style>
    `
    );
  } catch (e) {
    console.error(e);
    debug('Unable to apply Tidy 5e style tag.');
  }
}

function removeExistingTidyThemeStyleTag() {
  let existingThemeStyle = document.getElementById(tidyStyleTagId);

  if (existingThemeStyle) {
    existingThemeStyle.remove();
  }
}

export function getColorPickerColors() {
  const variables: Record<string, string> = {};

  const themeableColors = getThemeableColors();
  for (let color of themeableColors) {
    variables[color.cssVariable] = SettingsProvider.settings[color.key]
      .get()
      ?.toString();
  }

  return variables;
}

export function applyCurrentThemeClassic(colorPickerEnabledOverride?: boolean) {
  let enabled = colorPickerEnabledOverride ?? settings.value.colorPickerEnabled;
  if (enabled) {
    const variables = getColorPickerColors();
    applyThemeColorsToHead(variables);
  } else {
    removeExistingTidyThemeStyleTag();
  }
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

type ProcessedColor = {
  original: string;
  hexa?: string;
  parsed: boolean;
};

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
    spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_INNATE
  ) {
    return '--t5e-innate-background';
  }

  if (
    spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_RITUAL
  ) {
    return '--t5e-ritual-only-background';
  }

  if (
    spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL
  ) {
    return '--t5e-atwill-background';
  }

  if (
    spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_PACT
  ) {
    return '--t5e-pact-background';
  }

  if (
    spell.system.canPrepare &&
    spell.system.prepared === CONFIG.DND5E.spellPreparationStates.always.value
  ) {
    return '--t5e-alwaysprepared-background';
  }

  if (
    spell.system.canPrepare &&
    spell.system.prepared === CONFIG.DND5E.spellPreparationStates.prepared.value
  ) {
    return '--t5e-prepared-background';
  }

  // TODO: in the future, offer up and API for this, or use a slugify convention based on what modes exist
}
