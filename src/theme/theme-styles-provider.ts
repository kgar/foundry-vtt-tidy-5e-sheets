import { isNil } from 'src/utils/data';
import type {
  ThemeSettingsV3,
  ThemeSettingsConfigurationOptions,
  ThemeQuadroneStyleDeclaration,
  ThemeQuadroneStyleRule,
} from './theme-quadrone.types';
import { formatResourcePathForCss } from 'src/utils/path';
import { THEME_CLASS_DARK, getColorWithContrast, getForegroundAtContrast } from './theme-color-functions';
import { debug } from 'src/utils/logging';

const FOREGROUND_BASES = {
  diminished: { darkTheme: 'rgb(207, 210, 218)', lightTheme: 'rgb(102, 102, 102)' }, // grey-85, grey-40
  disabled: { darkTheme: 'rgb(153, 153, 153)', lightTheme: 'rgb(153, 153, 153)' }, // grey-60, grey-60
};

export class ThemeStylesProvider {
  static create(
    settings: ThemeSettingsV3,
    options: ThemeSettingsConfigurationOptions
  ): ThemeQuadroneStyleDeclaration[] {
    let { doc, idOverride } = options;
    let selectorPrefix = this.getSelectorPrefix(doc, idOverride);

    let result: ThemeQuadroneStyleDeclaration[] = [
      ...this.getAccentColorDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getActorHeaderBackgroundDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getHeaderBackgroundColorDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getSheetAccentColorDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getItemSidebarBackgroundDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getRarityColorsDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getSpellPreparationMethodDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      // etc.
    ];

    return result;
  }

  static getAccentColorDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.accentColor, '')) {
      return [];
    }

    const accentColorResult = getColorWithContrast(settings.accentColor);

    debug('Accent color check', accentColorResult);

    const identifierRule = this.getDeclarationKeyRule(
      'accentColor',
      doc,
      idOverride
    );

    // Pick base diminished/disabled colors matching the foreground polarity
    const isDarkTheme = accentColorResult.themeClass === THEME_CLASS_DARK;
    const diminishedColor = isDarkTheme ? FOREGROUND_BASES.diminished.darkTheme : FOREGROUND_BASES.diminished.lightTheme;
    const disabledColor = isDarkTheme ? FOREGROUND_BASES.disabled.darkTheme : FOREGROUND_BASES.disabled.lightTheme;

    const ruleset: ThemeQuadroneStyleRule[] = [
      identifierRule,
      {
        property: '--t5e-theme-color-default',
        value: settings.accentColor,
      },
      // APCA-computed foreground colors for text/icons on accent-colored backgrounds
      {
        property: '--t5e-theme-color-foreground',
        value: accentColorResult.foregroundColor,
      },
      {
        property: '--t5e-theme-color-foreground-diminished',
        value: getForegroundAtContrast(settings.accentColor, diminishedColor, 'headline'),
      },
      {
        property: '--t5e-theme-color-foreground-disabled',
        value: getForegroundAtContrast(settings.accentColor, disabledColor, 'minimum'),
      },
    ];

    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset,
      },
    ];
  }

  static getHeaderBackgroundColorDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    debug('Header background color check', getColorWithContrast(settings.headerBackgroundColor));

    if (isNil(settings.headerBackgroundColor, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'headerBackgroundColor',
      doc,
      idOverride
    );
    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: '--t5e-theme-color-header',
            value: settings.headerBackgroundColor,
          },
        ],
      },
    ];
  }

  static getSheetAccentColorDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    debug('Sheet accent color check', getColorWithContrast(settings.sheetAccentColor));

    if (isNil(settings.sheetAccentColor, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'sheetAccentColor',
      doc,
      idOverride
    );
    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: '--t5e-sheet-accent-color-default',
            value: settings.sheetAccentColor,
          },
        ],
      },
    ];
  }

  static getActorHeaderBackgroundDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    debug('Actor header background color check', getColorWithContrast(settings.actorHeaderBackground));
    if (
      !settings.useHeaderBackground ||
      isNil(settings.actorHeaderBackground, '')
    ) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'actorHeaderBackground',
      doc,
      idOverride
    );

    const urlValue = getUrlValue(settings.actorHeaderBackground);

    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: '--t5e-sheet-header-bg',
            value: urlValue,
          },
        ],
      },
    ];
  }

  static getItemSidebarBackgroundDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.itemSidebarBackground, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'itemSidebarBackground',
      doc,
      idOverride
    );

    const urlValue = getUrlValue(settings.itemSidebarBackground);

    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: '--t5e-sidebar-bg',
            value: urlValue,
          },
        ],
      },
    ];
  }

  static getHeaderColorDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.headerColor, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'headerColor',
      doc,
      idOverride
    );
    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: '--t5e-theme-header-color',
            value: settings.headerColor,
          },
        ],
      },
    ];
  }

  static getRarityColorsDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    const rarityColors = Object.entries(settings.rarityColors ?? {}).filter(
      ([_, value]) => !isNil(value?.trim(), '')
    );

    return rarityColors.map(([key, value]) => {
      const identifierRule = this.getDeclarationKeyRule(
        `rarityColors-${key}`,
        doc,
        idOverride
      );

      return {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: `--t5e-color-rarity-${key.toLowerCase()}`,
            value: value,
          },
        ],
      };
    });
  }

  static getSpellPreparationMethodDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV3,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    const spellPrepMethods = Object.entries(
      settings.spellPreparationMethodColors ?? {}
    ).filter(([_, value]) => !isNil(value?.trim(), ''));

    return spellPrepMethods.flatMap(([key, value]) => {
      const identifierRule = this.getDeclarationKeyRule(
        `spellPreparationMethodColors-${key}`,
        doc,
        idOverride
      );

      return [
        {
          identifier: `${identifierRule.property}: "${identifierRule.value}"`,
          selector: selectorPrefix,
          ruleset: [
            identifierRule,
            {
              property: `--t5e-color-spellcasting-${key.toLowerCase()}`,
              value: value,
            },
          ],
        },
        // {
        //   identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        //   selector: `${selectorPrefix} .tidy-table-header-row.spell-method`,
        //   ruleset: [identifierRule, { property: cssVariable, value: value }],
        // },
      ];
    });
  }

  static getDeclarationKeyRule(
    settingName: string,
    doc?: any,
    idOverride?: string
  ): ThemeQuadroneStyleRule {
    return {
      property: doc
        ? this.sheetSettingIdentifierKey(doc, idOverride)
        : this.worldSettingIdentifierKey,
      value: this.themeSettingIdentifierValue(settingName),
    };
  }

  private static getSelectorPrefix(doc: any, idOverride?: string) {
    return idOverride
      ? `#${idOverride}`
      : doc
        ? `#${doc.sheet.id}`
        : '.tidy5e-sheet.application.quadrone';
  }

  static readonly worldSettingIdentifierKey = '--tidy5e-sheet-world-setting';

  static sheetSettingIdentifierKey(doc: any, idOverride?: string) {
    const id = idOverride ?? doc.uuid;
    return `--tidy5e-sheet-sheet-setting-${id.replaceAll('.', '-')}`;
  }

  static themeSettingIdentifierValue(settingName: string) {
    return `tidy5e-sheet-theme-setting-${settingName}`;
  }
}

/** Creates a URL(...) CSS style value and accounts for content pulled from the web. */
function getUrlValue(path: string) {
  const formattedPath = formatResourcePathForCss(path);

  const urlValue = `url("${formattedPath}")`;
  return urlValue;
}
