import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import type {
  PortraitShape,
  ThemeQuadroneStyleDeclaration,
  ThemeSettingsV2,
  ThemeSettingsConfigurationOptions,
} from './theme-quadrone.types';
import { TidyFlags, TidyHooks } from 'src/api';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { coalesce } from 'src/utils/formatting';
import type { Unsubscribable } from 'src/foundry/TidyHooks.types';
import { ThemeStylesProvider } from './theme-styles-provider';
import { downloadTextFile, readFileAsText } from 'src/utils/file';
import { error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';

export type ThemeableSheetType =
  | Tidy5eCharacterSheetQuadrone
  | Tidy5eNpcSheetQuadrone
  | Tidy5eItemSheetQuadrone
  | Tidy5eContainerSheetQuadrone;

export class ThemeQuadrone {
  static readonly CURRENT_THEME_VERSION = 2;

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

  static getDefaultThemeSettings(): ThemeSettingsV2 {
    return {
      accentColor: '',
      actorHeaderBackground: '',
      itemSidebarBackground: '',
      portraitShape: undefined,
      rarityColors: {},
      spellPreparationModeColors: {},
    };
  }

  static getWorldThemeSettings(): ThemeSettingsV2 {
    return foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      settings.value.worldThemeSettings
    );
  }

  static saveWorldThemeSettings(settings: ThemeSettingsV2) {
    const toSave = foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      settings
    );

    return FoundryAdapter.setTidySetting('worldThemeSettings', toSave);
  }

  static getSheetThemeSettings(
    options: ThemeSettingsConfigurationOptions
  ): ThemeSettingsV2 {
    let defaultSettings = this.getDefaultThemeSettings();

    if (options.doc?.parent) {
      let parentSettings = this.getSheetThemeSettings({
        ...options,
        doc: options.doc?.parent,
      });

      defaultSettings = foundry.utils.mergeObject(
        defaultSettings,
        parentSettings
      );
    }

    const preferences = foundry.utils.mergeObject(
      defaultSettings,
      TidyFlags.sheetThemeSettings.get(options.doc)
    ) as ThemeSettingsV2;

    return preferences;
  }

  static saveSheetThemeSettings(doc: any, settings: ThemeSettingsV2) {
    const toSave = foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      settings
    );

    return TidyFlags.sheetThemeSettings.set(doc, toSave);
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
      ? ThemeStylesProvider.sheetSettingIdentifierKey(doc, idOverride)
      : ThemeStylesProvider.worldSettingIdentifierKey;

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
    options: ThemeSettingsConfigurationOptions = {}
  ) {
    const themeSettings =
      options.settingsOverride ??
      (options.doc
        ? this.getSheetThemeSettings(options)
        : this.getWorldThemeSettings());
    const declarations = ThemeStylesProvider.create(themeSettings, options);
    this.applyStyleDeclarations(declarations, options.doc, options.idOverride);
  }

  static subscribeAndReactToThemeSettingsChanges(
    options: ThemeSettingsConfigurationOptions
  ): Unsubscribable {
    const hookId = TidyHooks.tidy5eSheetsThemeSettingsChangedSubscribe(
      (doc?: any) => {
        const appliesToThisSheet =
          !!doc &&
          options.doc &&
          (doc.uuid === options.doc.uuid ||
            doc.uuid === options.doc.parent?.uuid);

        if (appliesToThisSheet) {
          ThemeQuadrone.applyCurrentThemeSettingsToStylesheet(options);
        }
      }
    );

    return {
      unsubscribe() {
        TidyHooks.tidy5eSheetsThemeSettingsChangedUnsubscribe(hookId);
      },
    };
  }

  /* -------------------------------------------- */
  /*  Portrait Shapes                             */
  /* -------------------------------------------- */

  static getActorPortraitShapes(): PortraitShape[] {
    return ['round', 'transparent', 'square'];
  }

  static getActorPortraitShape(doc: any): PortraitShape {
    return coalesce(
      TidyFlags.sheetThemeSettings.get(doc)?.portraitShape,
      settings.value.worldThemeSettings?.portraitShape,
      'round'
    ) as PortraitShape;
  }

  static updatePortraitShape(doc: any, newShape: PortraitShape) {
    const settings = this.getSheetThemeSettings({ doc: doc });
    settings.portraitShape = newShape;
    this.saveSheetThemeSettings(doc, settings);
  }

  /* -------------------------------------------- */
  /*  Theme Import/Export                         */
  /* -------------------------------------------- */

  static async import(file: File): Promise<ThemeSettingsV2 | undefined> {
    try {
      let result = await readFileAsText(file);

      const toImport = JSON.parse(result) as ThemeSettingsV2 & {
        version: number;
      };

      const isValid = this.validateImportFile(toImport);

      if (!isValid) {
        throw new Error(`Theme file ${file.name} is in an invalid format.`);
      }

      let { version, ...theme } = toImport;

      const settings = foundry.utils.mergeObject(
        this.getDefaultThemeSettings(),
        theme
      );

      ui.notifications.info(
        FoundryAdapter.localize('TIDY5E.ThemeSettings.Sheet.importSuccess')
      );

      return settings;
    } catch (e) {
      ui.notifications.error(
        FoundryAdapter.localize('TIDY5E.ThemeSettings.Sheet.importError')
      );
      error(
        'An error occurred while attempting to import a theme file. See the devtools console for more details.',
        true,
        e
      );
    }
  }

  static validateImportFile(theme: ThemeSettingsV2 & { version: number }) {
    return theme.version === this.CURRENT_THEME_VERSION;
  }

  static async export(data: ThemeSettingsV2) {
    const toExport: Record<string, any> = {
      version: ThemeQuadrone.CURRENT_THEME_VERSION,
      ...data,
    };

    downloadTextFile(
      'theme' + CONSTANTS.THEME_EXTENSION_WITH_DOT,
      JSON.stringify(toExport, null, ' ')
    );
  }
}
