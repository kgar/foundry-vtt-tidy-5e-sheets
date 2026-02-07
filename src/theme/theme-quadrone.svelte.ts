import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import type {
  PortraitShape,
  ThemeQuadroneStyleDeclaration,
  ThemeSettingsV3,
  ThemeSettingsConfigurationOptions,
} from './theme-quadrone.types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { coalesce } from 'src/utils/formatting';
import type { Unsubscribable } from 'src/foundry/TidyHooks.types';
import { ThemeStylesProvider } from './theme-styles-provider';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';

export type ThemeableSheetType =
  | Tidy5eCharacterSheetQuadrone
  | Tidy5eNpcSheetQuadrone
  | Tidy5eItemSheetQuadrone
  | Tidy5eContainerSheetQuadrone;

export class ThemeQuadrone {
  static readonly DEFAULT_PORTRAIT_SHAPE: PortraitShape = 'transparent';
  // a collection of stylesheets currently only used for popped out stylesheets
  private static readonly _externalStylesheets: Set<CSSStyleSheet> = new Set();

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

      Object.keys(CONFIG.DND5E.spellcasting).forEach((key) => {
        let methodIdentifier = key.toLowerCase().slugify();

        stylesheet.insertRule(
          `.tidy5e-sheet.quadrone .method-${methodIdentifier} { --t5e-method-color: var(--t5e-color-spellcasting-${methodIdentifier}) }`
        );
      });
    });
  }

  static getDefaultThemeSettings(
    alternateDefaults: Partial<ThemeSettingsV3> = {}
  ): ThemeSettingsV3 {
    const defaults = {
      accentColor: '',
      useHeaderBackground: true,
      disableHeaderImageEffects: false,
      headerBackgroundSize: 'cover',
      headerColor: '',
      actorHeaderBackground: '',
      itemSidebarBackground: '',
      portraitShape: undefined,
      rarityColors: {},
      spellPreparationMethodColors: {},
    };

    return foundry.utils.mergeObject(defaults, alternateDefaults);
  }

  static getWorldThemeSettings(): ThemeSettingsV3 {
    return foundry.utils.mergeObject(
      this.getDefaultThemeSettings(),
      SettingsProvider.settings.worldThemeSettings.get()
    );
  }

  static saveWorldThemeSettings(settings: ThemeSettingsV3) {
    const toSave = { ...settings };

    return FoundryAdapter.setTidySetting('worldThemeSettings', toSave);
  }

  static getSheetThemeSettings(
    options: ThemeSettingsConfigurationOptions
  ): ThemeSettingsV3 {
    options.applyWorldThemeSetting ??= true;

    let defaultSettings = options.applyWorldThemeSetting
      ? this.getWorldThemeSettings()
      : this.getDefaultThemeSettings(options.alternateDefaults);

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

    const sheetFlagSettings: Record<string, any> =
      options.settingsOverride ??
      TidyFlags.sheetThemeSettings.get(options.doc) ??
      {};

    for (const [key, value] of Object.entries(sheetFlagSettings)) {
      if (isNil(value, '')) {
        delete sheetFlagSettings[key];
      }
    }

    const preferences = foundry.utils.mergeObject(
      defaultSettings,
      sheetFlagSettings
    ) as ThemeSettingsV3;

    if (
      options.doc?.flags.dnd5e?.[CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT] ===
      true
    ) {
      preferences.portraitShape = 'token';
    }

    return preferences;
  }

  static async saveSheetThemeSettings(doc: any, settings: ThemeSettingsV3) {
    const toSave = { ...settings };

    // TODO: Figure out how to do this with a single call. Currently, it does not fully replace the information.
    await TidyFlags.sheetThemeSettings.unset(doc);
    const result = await TidyFlags.sheetThemeSettings.set(doc, toSave);

    await this.syncSystemTokenPortraitSetting(doc, settings.portraitShape);
    return result;
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
    // identify all relevant styles
    const identifierKey = doc
      ? ThemeStylesProvider.sheetSettingIdentifierKey(doc, idOverride)
      : ThemeStylesProvider.worldSettingIdentifierKey;

    const ogStylesheet = this.getTidyStyleSheet();
    // loop through our main stylesheet then any external ones
    for (const stylesheet of [ogStylesheet, ...this._externalStylesheets]) {
      const cssRules = Array.from(stylesheet.cssRules);

      // remove previous related styles
      const numberToRemove = cssRules.filter(filterToExactIdentifier).length;

      for (let i = 0; i < numberToRemove; i++) {
        const index = cssRules.findIndex(filterToExactIdentifier);
        stylesheet.deleteRule(index);
      }

      // insert styles
      for (const declaration of declarations) {
        stylesheet.insertRule(this.toRuleString(declaration));
      }
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
      (doc?: any, liveThemeOverride?: ThemeSettingsV3) => {
        const appliesToThisSheet =
          !!doc &&
          options.doc &&
          (doc.uuid === options.doc.uuid ||
            doc.uuid === options.doc.parent?.uuid);

        if (appliesToThisSheet) {
          ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
            ...options,
            settingsOverride: liveThemeOverride,
          });
          options.callback?.({ settingsOverride: liveThemeOverride });
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
    return ['round', 'transparent', 'square', 'token'];
  }

  static getActorPortraitShape(doc: any): PortraitShape {
    return coalesce(
      TidyFlags.sheetThemeSettings.get(doc)?.portraitShape,
      SettingsProvider.settings.worldThemeSettings.get()?.portraitShape,
      this.DEFAULT_PORTRAIT_SHAPE
    ) as PortraitShape;
  }

  static async updatePortraitShape(doc: any, newShape: PortraitShape) {
    const settings = this.getSheetThemeSettings({ doc: doc });
    settings.portraitShape = newShape;
    await this.saveSheetThemeSettings(doc, settings);
    await this.syncSystemTokenPortraitSetting(doc, newShape);
  }

  static async syncSystemTokenPortraitSetting(
    doc: any,
    newShape?: PortraitShape
  ) {
    await doc.update({
      [`flags.dnd5e.${CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT}`]:
        newShape === 'token',
    });
  }

  static subscribeStylesheet(stylesheet: CSSStyleSheet) {
    const ogStylesheet = this.getTidyStyleSheet();
    stylesheet.replaceSync(
      Array.from(ogStylesheet.cssRules)
        .map((rule) => rule.cssText)
        .join('\n')
    );
    this._externalStylesheets.add(stylesheet);
  }

  static unsubscribeStylesheet(stylesheet: CSSStyleSheet) {
    this._externalStylesheets.delete(stylesheet);
  }
}
