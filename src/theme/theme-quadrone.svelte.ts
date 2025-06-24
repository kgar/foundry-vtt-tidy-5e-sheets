import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import type {
  ThemeQuadroneStyleDeclaration,
  ThemeQuadroneStyleRule,
  ThemeSettings,
} from './theme-quadrone.types';
import { TidyFlags } from 'src/api';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { coalesce } from 'src/utils/formatting';
import { isNil } from 'src/utils/data';

export type ThemeableSheetType =
  | Tidy5eCharacterSheetQuadrone
  | Tidy5eNpcSheetQuadrone
  | Tidy5eItemSheetQuadrone
  | Tidy5eContainerSheetQuadrone;

export class ThemeQuadrone {
  static onReady() {
    setTimeout(() => {
      // Establish color mappings for Item Rarity and Spell Prep Mode
      const stylesheet = this.getTidyStyleSheet();

      Object.keys(CONFIG.DND5E.itemRarity).forEach((key) => {
        let rarityIdentifier = key.toLowerCase().slugify();

        stylesheet.insertRule(
          `.tidy5e-sheet.quadrone .rarity.${rarityIdentifier} { --t5e-item-color: var(--t5e-color-rarity-${rarityIdentifier}) }`
        );
      });

      Object.keys(CONFIG.DND5E.spellPreparationModes).forEach((key) => {
        let modeIdentifier = key.toLowerCase().slugify();

        stylesheet.insertRule(
          `.tidy5e-sheet.quadrone .mode-${modeIdentifier} { --t5e-mode-color: var(--t5e-color-spellcasting-${modeIdentifier}) }`
        );
      });
    });
  }

  static getDefaultThemeSettings(): ThemeSettings {
    return {
      accentColor: '',
      headerBackground: '',
      rarityColors: {},
      spellPreparationModeColors: {},
      useSaturatedRarityColors: false,
    };
  }

  static getWorldThemeSettings(): ThemeSettings {
    return foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      settings.value.worldThemeSettings
    );
  }

  static saveWorldThemeSettings(settings: ThemeSettings) {
    const toSave = foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      settings
    );

    return FoundryAdapter.setTidySetting('worldThemeSettings', toSave);
  }

  static getSheetThemeSettings(
    doc: any,
    mergeParentDocumentSettings?: boolean
  ): ThemeSettings {
    let defaultSettings = this.getDefaultThemeSettings();

    if (mergeParentDocumentSettings && doc.parent) {
      let parentSettings = this.getSheetThemeSettings(doc.parent, true);

      defaultSettings = foundry.utils.mergeObject(
        defaultSettings,
        parentSettings
      );
    }

    const preferences = foundry.utils.mergeObject(
      defaultSettings,
      TidyFlags.sheetThemeSettings.get(doc)
    ) as ThemeSettings;

    return preferences;
  }

  static saveSheetThemeSettings(doc: any, settings: ThemeSettings) {
    const toSave = foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      settings
    );

    return TidyFlags.sheetThemeSettings.set(doc, toSave);
  }

  static getDeclarations(
    settings: ThemeSettings,
    doc?: any,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    let selectorPrefix = ThemeQuadrone.getSelectorPrefix(doc, idOverride);

    let result: ThemeQuadroneStyleDeclaration[] = [
      ...this.getAccentColorDeclarations(
        selectorPrefix,
        settings,
        doc,
        idOverride
      ),
      ...this.getHeaderBackgroundDeclarations(
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

  static getAccentColorDeclarations(
    selectorPrefix: string,
    settings: ThemeSettings,
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

  static getHeaderBackgroundDeclarations(
    selectorPrefix: string,
    settings: ThemeSettings,
    doc: any | undefined,
    idOverride?: string
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.headerBackground, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule(
      'headerBackground',
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
            property: '--t5e-sheet-header-bg',
            value: `url(${settings.headerBackground})`,
          },
        ],
      },
    ];
  }

  static getRarityColorsDeclarations(
    selectorPrefix: string,
    settings: ThemeSettings,
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
      const cssVariable = `--t5e-color-rarity-${key.toLowerCase()}`;
      return {
        identifier: `${identifierRule.property}: "${identifierRule.value}"`,
        selector: selectorPrefix,
        ruleset: [
          identifierRule,
          {
            property: cssVariable,
            value: value,
          },
        ],
      };
    });
  }

  static getSpellPreparationModesDeclarations(
    selectorPrefix: string,
    settings: ThemeSettings,
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
      const cssVariable = `--t5e-color-spellcasting-${key.toLowerCase()}`;
      return [
        {
          identifier: `${identifierRule.property}: "${identifierRule.value}"`,
          selector: selectorPrefix,
          ruleset: [
            identifierRule,
            {
              property: cssVariable,
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

  static getTidyStyleSheet() {
    return Array.from(document.styleSheets).find(
      // @ts-expect-error
      (s) => coalesce(s?.ownerNode?.id, s?.id) === this.tagId
    )!;
  }

  static applyStyleDeclarations(
    declarations: ThemeQuadroneStyleDeclaration[],
    doc?: any,
    idOverride?: string
  ) {
    let stylesheet = this.getTidyStyleSheet();

    // identify all relevant styles
    let identifierKey = doc
      ? this.sheetSettingIdentifierKey(doc, idOverride)
      : this.worldSettingIdentifierKey;

    // remove previous related styles
    let numberToRemove = Array.from(stylesheet.cssRules).filter(
      filterToExactIdentifier
    ).length;

    Array.fromRange(numberToRemove).forEach(() => {
      let index = Array.from(stylesheet.cssRules).findIndex(
        filterToExactIdentifier
      );
      stylesheet.deleteRule(index);
    });

    // insert styles
    for (let declaration of declarations) {
      stylesheet.insertRule(this.toRuleString(declaration));
    }

    function filterToExactIdentifier(value: CSSRule): boolean {
      return value.cssText.includes(`${identifierKey}:`);
    }
  }

  static toRuleString(declaration: ThemeQuadroneStyleDeclaration) {
    return `${declaration.selector} { ${declaration.ruleset
      .map((r) => `${r.property}: ${r.value}`)
      .join('; ')} }`;
  }

  static readonly tagId = 'tidy5e-sheets-quadrone-theme-settings';

  static insertTidyThemeStyleTag() {
    const tag = document.createElement('style');
    tag.id = this.tagId;
    document.head.insertAdjacentElement('beforeend', tag);
  }

  static applyCurrentThemeSettingsToStylesheet(
    args: {
      doc?: any;
      mergeParentDocumentSettings?: boolean;
      settingsOverride?: ThemeSettings;
      idOverride?: string;
    } = {}
  ) {
    const themeSettings =
      args.settingsOverride ??
      (args.doc
        ? this.getSheetThemeSettings(args.doc, args.mergeParentDocumentSettings)
        : this.getWorldThemeSettings());
    const declarations = this.getDeclarations(
      themeSettings,
      args.doc,
      args.idOverride
    );
    this.applyStyleDeclarations(declarations, args.doc, args.idOverride);
  }
}
