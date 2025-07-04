import { isNil } from 'src/utils/data';
import type {
  ThemeSettingsV2,
  ThemeSettingsConfigurationOptions,
  ThemeQuadroneStyleDeclaration,
  ThemeQuadroneStyleRule,
} from './theme-quadrone.types';

export class ThemeStylesProvider {
  static create(
    settings: ThemeSettingsV2,
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
      ...this.getSpellPreparationModesDeclarations(
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
    settings: ThemeSettingsV2,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.accentColor, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'accentColor',
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
            property: '--t5e-theme-color-default',
            value: settings.accentColor,
          },
        ],
      },
    ];
  }

  static getActorHeaderBackgroundDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV2,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.actorHeaderBackground, '')) {
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
    settings: ThemeSettingsV2,
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

  static getRarityColorsDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV2,
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

  static getSpellPreparationModesDeclarations(
    selectorPrefix: string,
    settings: ThemeSettingsV2,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    const spellPrepModes = Object.entries(
      settings.spellPreparationModeColors ?? {}
    ).filter(([_, value]) => !isNil(value?.trim(), ''));

    return spellPrepModes.flatMap(([key, value]) => {
      const identifierRule = this.getDeclarationKeyRule(
        `spellPreparationModeColors-${key}`,
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
        //   selector: `${selectorPrefix} .tidy-table-header-row.spell-preparation`,
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
  const pathPrefix =
    // This backs the file directory location out of the Tidy module
    '../../';

  const urlValue = `url(${pathPrefix}${path})`;
  return urlValue;
}
