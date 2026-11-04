import { CONSTANTS } from 'src/constants';
import { coalesce } from 'src/utils/formatting';
import chroma from 'chroma-js';

// TODO: Absorb all the theme things into here. Strongly consider absorbing ThemeQuadrone, too.
export class Theme {
  static supportedDocumentNames: ReadonlySet<string> = new Set<string>([
    CONSTANTS.DOCUMENT_NAME_ACTOR,
    CONSTANTS.DOCUMENT_NAME_ITEM,
  ]);
}

export function getThemeV2(doc?: any) {
  let theme: string | undefined = undefined;
  if (doc) {
    theme =
      foundry.applications.apps.DocumentSheetConfig.getSheetThemeForDocument(
        doc,
      );
  }

  if (!theme) {
    const { colorScheme } = game.settings.get('core', 'uiConfig');
    theme = colorScheme.applications;
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

type ProcessedColor = {
  original: string;
  hexa?: string;
  parsed: boolean;
};

export function colorToHexaString(color: chroma.Color | undefined): string {
  if (color) {
    return color.hex('argb');
  }

  return '';
}

export function settingValueToHexaString(value: string): ProcessedColor {
  const result = chroma.valid(value)
    ? colorToHexaString(chroma(value.toString()))
    : '';

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

export function validateImportFile(theme: Record<string, any>) {
  return theme.version === 1 && typeof theme.variables === 'object';
}

export const actorHeaderBackgroundSupportedActorTypes = new Set<string>([
  CONSTANTS.SHEET_TYPE_CHARACTER,
  CONSTANTS.SHEET_TYPE_NPC,
  CONSTANTS.SHEET_TYPE_VEHICLE,
  CONSTANTS.SHEET_TYPE_GROUP,
  CONSTANTS.SHEET_TYPE_ENCOUNTER,
]);
