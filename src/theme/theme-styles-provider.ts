import { isNil } from 'src/utils/data';
import type {
  ThemeSettingsV3,
  ThemeSettingsConfigurationOptions,
  ThemeQuadroneStyleDeclaration,
  ThemeQuadroneStyleRule,
} from './theme-quadrone.types';
import { formatResourcePathForCss } from 'src/utils/path';
import { THEME_CLASS_DARK, THEME_CLASS_LIGHT, getColorWithContrast, getForegroundAtContrast } from './theme-color-functions';
import { getCSSVariable } from './theme-palette-tokens';
import { debug } from 'src/utils/logging';

const TIDY_CSS_VARIABLES = {
  themeColor: '--t5e-theme-color-default',
  themeColorDarker: '--t5e-theme-color-darker',
  themeColorHighlight: '--t5e-theme-color-highlight',
  themeHeaderColor: '--t5e-theme-color-header',
  cardColor: '--t5e-component-card-default',
  themeForeground: '--t5e-theme-color-foreground',
  themeForegroundDiminished: '--t5e-theme-color-foreground-diminished',
  themeForegroundDisabled: '--t5e-theme-color-foreground-disabled',  
  themeForegroundDarker: '--t5e-theme-color-foreground-darker',
  themeForegroundDarkerDiminished: '--t5e-theme-color-foreground-darker-diminished',
  themeForegroundDarkerDisabled: '--t5e-theme-color-foreground-darker-disabled',
  textGold: '--t5e-color-text-gold',
  textGoldEmphasis: '--t5e-color-text-gold-emphasis',
} as const;

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

    // Pull base foreground colors straight from the live CSS so module/world
    // overrides flow through without TS-side hardcoding.
    const accentBackground = settings.accentColor;
    const accentVariant = accentColorResult.themeClass === THEME_CLASS_DARK ? THEME_CLASS_DARK : THEME_CLASS_LIGHT;
    const accentOverrides = { [TIDY_CSS_VARIABLES.themeColor]: accentBackground };
    const accentBackgroundDarker = getCSSVariable(TIDY_CSS_VARIABLES.themeColorDarker, accentVariant, true, accentOverrides);
    const cardColor = getCSSVariable(TIDY_CSS_VARIABLES.cardColor, accentVariant, true);

    const themeForegroundBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForeground, accentVariant, true);
    const themeForegroundDiminishedBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDiminished, accentVariant, true);
    const themeForegroundDisabledBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDisabled, accentVariant, true);

    const themeForegroundDarkerBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDarker, accentVariant, true);
    const themeForegroundDarkerDiminishedBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDarkerDiminished, accentVariant, true);
    const themeForegroundDarkerDisabledBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDarkerDisabled, accentVariant, true);

    console.log('themeForegroundBase', themeForegroundBase);
    console.log('accentBackground', accentBackground);
    const ruleset: ThemeQuadroneStyleRule[] = [
      identifierRule,
      {
        property: TIDY_CSS_VARIABLES.themeColor,
        value: accentBackground,
      },
      {
        property: TIDY_CSS_VARIABLES.themeColorHighlight,
        value: getForegroundAtContrast(cardColor, settings.accentColor, 'minimum', true),
      },
      {
        property: TIDY_CSS_VARIABLES.themeForeground,
        value: getForegroundAtContrast(accentBackground, themeForegroundBase, 'body'),
      },
      {
        property: TIDY_CSS_VARIABLES.themeForegroundDiminished,
        value: getForegroundAtContrast(accentBackground, themeForegroundDiminishedBase, 'headline'),
      },
      {
        property: TIDY_CSS_VARIABLES.themeForegroundDisabled,
        value: getForegroundAtContrast(accentBackground, themeForegroundDisabledBase, 'minimum'),
      },
      {
        property: TIDY_CSS_VARIABLES.themeForegroundDarker,
        value: getForegroundAtContrast(accentBackgroundDarker, themeForegroundDarkerBase, 'body'),
      },
      {
        property: TIDY_CSS_VARIABLES.themeForegroundDarkerDiminished,
        value: getForegroundAtContrast(accentBackgroundDarker, themeForegroundDarkerDiminishedBase, 'headline'),
      },
      {
        property: TIDY_CSS_VARIABLES.themeForegroundDarkerDisabled,
        value: getForegroundAtContrast(accentBackgroundDarker, themeForegroundDarkerDisabledBase, 'minimum'),
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

    // // Pull base foreground colors straight from the live CSS so module/world
    // // overrides flow through without TS-side hardcoding.
    // const accentBackground = settings.accentColor;
    // const accentVariant = accentColorResult.themeClass === THEME_CLASS_DARK ? THEME_CLASS_DARK : THEME_CLASS_LIGHT;
    // const cardColor = getCSSVariable(TIDY_CSS_VARIABLES.cardColor, accentVariant);

    // const themeForegroundBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForeground, accentVariant);
    // const themeForegroundDiminishedBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDiminished, accentVariant);
    // const themeForegroundDisabledBase = getCSSVariable(TIDY_CSS_VARIABLES.themeForegroundDisabled, accentVariant);

    // const ruleset: ThemeQuadroneStyleRule[] = [
    //   identifierRule,
    //   {
    //     property: TIDY_CSS_VARIABLES.themeColor,
    //     value: accentBackground,
    //   },
    //   {
    //     property: TIDY_CSS_VARIABLES.themeColorHighlight,
    //     value: getForegroundAtContrast(cardColor, settings.accentColor, 'minimum'),
    //   },
    //   {
    //     property: TIDY_CSS_VARIABLES.themeForeground,
    //     value: getForegroundAtContrast(accentBackground, themeForegroundBase, 'body'),
    //   },
    //   {
    //     property: TIDY_CSS_VARIABLES.themeForegroundDiminished,
    //     value: getForegroundAtContrast(accentBackground, themeForegroundDiminishedBase, 'headline'),
    //   },
    //   {
    //     property: TIDY_CSS_VARIABLES.themeForegroundDisabled,
    //     value: getForegroundAtContrast(accentBackground, themeForegroundDisabledBase, 'minimum'),
    //   },
    // ];

    // // const textGoldBase = getCSSVariable(TIDY_CSS_VARIABLES.textGold, accentVariant);
    // // const textGoldEmphasisBase = getCSSVariable(TIDY_CSS_VARIABLES.textGoldEmphasis, accentVariant);
    // // ruleset.push(
    // //   {
    // //     property: TIDY_CSS_VARIABLES.textGold,
    // //     value: getForegroundAtContrast(accentBackground, textGoldBase, 'body'),
    // //   },
    // //   {
    // //     property: TIDY_CSS_VARIABLES.textGoldEmphasis,
    // //     value: getForegroundAtContrast(accentBackground, textGoldEmphasisBase, 'body-high-contrast'),
    // //   }
    // // );

    return [
      {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: TIDY_CSS_VARIABLES.themeHeaderColor,
            value: settings.headerBackgroundColor,
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
            property: TIDY_CSS_VARIABLES.themeHeaderColor,
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
