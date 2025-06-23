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
  static getDefaultThemeSettings(): ThemeSettings {
    return {
      accentColor: '',
      headerBackground: '',
      rarityColors: [],
      spellPreparationModeColors: [],
      useSaturatedRarityColors: false,
    };
  }

  static applySheetTheme(sheet: ThemeableSheetType) {
    // get sheet settings
    // get or create style tag
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

  static getSheetThemeSettings(doc: any): ThemeSettings {
    const preferences = foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      TidyFlags.sheetThemeSettings.get(doc)
    ) as ThemeSettings;

    // TODO: Clean up and backfill as needed. It could even just be a Foundry merge

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
    doc?: any
  ): ThemeQuadroneStyleDeclaration[] {
    let selectorPrefix = ThemeQuadrone.getSelectorPrefix(doc);

    let result: ThemeQuadroneStyleDeclaration[] = [
      ...this.getAccentColorDeclarations(selectorPrefix, settings),
      ...this.getHeaderBackgroundDeclarations(selectorPrefix, settings),
      ...this.getRarityColorsDeclarations(selectorPrefix, settings),
      ...this.getSpellPreparationModesDeclarations(selectorPrefix, settings),
      // etc.
    ];

    return result;
  }

  private static getSelectorPrefix(doc: any) {
    return doc
      ? `#${doc.sheet.uniqueId}`
      : '.tidy5e-sheet.application.quadrone';
  }

  static readonly worldSettingIdentifierKey = '--tidy5e-sheet-world-setting';

  static sheetSettingIdentifierKey(doc: any) {
    return `--tidy5e-sheet-sheet-setting-${doc.uuid}`;
  }

  static themeSettingIdentifierValue(settingName: string) {
    return `tidy5e-sheet-theme-setting-${settingName}`;
  }

  static getDeclarationKeyRule(
    settingName: string,
    doc?: any
  ): ThemeQuadroneStyleRule {
    return {
      property: doc
        ? this.sheetSettingIdentifierKey(doc)
        : this.worldSettingIdentifierKey,
      value: this.themeSettingIdentifierValue(settingName),
    };
  }

  static getAccentColorDeclarations(
    selectorPrefix: string,
    settings: ThemeSettings
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.accentColor, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule('accentColor');
    return [
      {
        identifier: `${identifierRule.property}: ${identifierRule.value}`,
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
    settings: ThemeSettings
  ): ThemeQuadroneStyleDeclaration[] {
    if (isNil(settings.headerBackground, '')) {
      return [];
    }

    const identifierRule = this.getDeclarationKeyRule('headerBackground');
    return [
      {
        identifier: `${identifierRule.property}: ${identifierRule.value}`,
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
    settings: ThemeSettings
  ): ThemeQuadroneStyleDeclaration[] {
    const rarityColors = settings.rarityColors.filter(
      (c) => !isNil(c.value?.trim(), '')
    );

    return rarityColors.map((c) => {
      const identifierRule = this.getDeclarationKeyRule(
        `rarityColors-${c.key}`
      );
      const cssVariable = `--t5e-color-rarity-${c.key.toLowerCase()}`;
      return {
        identifier: `${identifierRule.property}: ${identifierRule.value}`,
        selector: selectorPrefix,
        ruleset: [{ property: cssVariable, value: c.value }],
      };
    });
  }

  static getSpellPreparationModesDeclarations(
    selectorPrefix: string,
    settings: ThemeSettings
  ): ThemeQuadroneStyleDeclaration[] {
    const spellPrepModes = settings.spellPreparationModeColors.filter(
      (c) => !isNil(c.value?.trim(), '')
    );

    return spellPrepModes.flatMap((c) => {
      const identifierRule = this.getDeclarationKeyRule(
        `spellPreparationModeColors-${c.key}`
      );
      const cssVariable = `--t5e-color-spellcasting-${c.key.toLowerCase()}`;
      return [
        {
          identifier: `${identifierRule.property}: ${identifierRule.value}`,
          selector: selectorPrefix,
          ruleset: [{ property: cssVariable, value: c.value }],
        },
        {
          identifier: `${identifierRule.property}: ${identifierRule.value}`,
          selector: `${selectorPrefix} .tidy-table-header-row.spell-preparation`,
          ruleset: [{ property: cssVariable, value: c.value }],
        },
      ];
    });
  }

  static applyStyleDeclarations(
    declarations: ThemeQuadroneStyleDeclaration[],
    doc?: any
  ) {
    let stylesheet = Array.from(document.styleSheets).find(
      // @ts-expect-error
      (s) => coalesce(s?.ownerNode?.id, s?.id) === this.tagId
    );

    if (!stylesheet) {
      alert('remove this before shipping, but oh no!');
      return;
    }

    // identify all relevant styles
    let identifierKey = doc
      ? this.sheetSettingIdentifierKey(doc)
      : this.worldSettingIdentifierKey;

    // remove previous related styles
    let numberToRemove = Array.from(stylesheet.cssRules).filter((r) =>
      r.cssText.includes(identifierKey)
    ).length;

    Array.fromRange(numberToRemove).forEach(() => {
      let index = Array.from(stylesheet.cssRules).findIndex((r2) =>
        r2.cssText.includes(identifierKey)
      );
      stylesheet.deleteRule(index);
    });

    // insert styles
    for (let declaration of declarations) {
      stylesheet.insertRule(this.toRuleString(declaration));
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
      settingsOverride?: ThemeSettings;
    } = {}
  ) {
    const settings =
      args.settingsOverride ??
      (args.doc
        ? this.getSheetThemeSettings(args.doc)
        : this.getWorldThemeSettings());
    const declarations = this.getDeclarations(settings, args.doc);
    this.applyStyleDeclarations(declarations, args.doc);
  }
}
