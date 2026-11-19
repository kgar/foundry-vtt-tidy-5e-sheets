import { CONSTANTS } from 'src/constants';
import { coalesce } from 'src/utils/formatting';
import chroma from 'chroma-js';
import { debug, error, warn } from 'src/utils/logging';
import {
  SYMBOLS,
  type WorldThemeSettingConfig,
} from 'src/types/registry.types';
import { getEffectiveWorldThemesSetting } from 'src/settings/settings.svelte';
import { isNil } from 'src/utils/data';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { WorldThemeSetting } from 'src/settings/settings.types';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import type {
  PortraitShape,
  ThemeFilterData,
  ThemeQuadroneStyleDeclaration,
  ThemeSettings,
  ThemeSettingsConfigurationOptions,
} from './theme.types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Unsubscribable } from 'src/foundry/TidyHooks.types';
import { ThemeStylesProvider } from './theme-styles-provider';

export class Theme {
  static supportedDocumentNames: ReadonlySet<string> = new Set<string>([
    CONSTANTS.DOCUMENT_NAME_ACTOR,
    CONSTANTS.DOCUMENT_NAME_ITEM,
  ]);
  static readonly DEFAULT_ACCENT_COLOR = 'rgb(116, 27, 43)';
  static readonly DEFAULT_PORTRAIT_SHAPE: PortraitShape = 'transparent';
  // a collection of stylesheets currently only used for popped out stylesheets
  private static readonly _externalStylesheets: Set<CSSStyleSheet> = new Set();

  static initWorldThemes() {
    if (!CONFIG.TIDY5E) {
      error(
        `Invalid setup. CONFIG.TIDY5E must be initialized before calling ${Theme.initWorldThemes.name}`,
        true,
      );

      return;
    }

    // Reset worldThemes every time.
    CONFIG.TIDY5E.worldThemes = {
      [SYMBOLS.generated]:
        'This code is generated. To ensure external changes are included every time this is generated, use the hook "tidy5e-sheet.worldThemesConfigChanged"',
      [SYMBOLS.readme]:
        'Partitioned, priority-ordered, optionally filtered world theme settings used for determining the appropriate theme to use for a given document sheet.',
    };

    const themes = getEffectiveWorldThemesSetting();

    const prioritizedWorldThemes = Object.values(themes).sort(
      (a, b) => a.sort - b.sort,
    );

    for (const theme of prioritizedWorldThemes) {
      if (
        !theme.documentNames &&
        !theme.types &&
        isNil(theme.filter?.trim(), '')
      ) {
        // The first found world theme default is registered as the
        // world theme default in addition to permuting across
        // document world themes.
        CONFIG.TIDY5E.worldThemeDefault ??= mapToRegisteredTheme({
          ...theme,
          filter: undefined,
        });
      }

      const validDocumentNames =
        theme.documentNames?.filter((name) =>
          Theme.supportedDocumentNames.has(name),
        ) ?? [];

      const targetDocumentNames = validDocumentNames.length
        ? validDocumentNames
        : [...Theme.supportedDocumentNames];

      for (const targetDocumentName of targetDocumentNames) {
        const configDocumentNames = (CONFIG.TIDY5E.worldThemes[
          targetDocumentName
        ] ??= {});

        const documentTypes: string[] =
          foundry.documents[targetDocumentName]?.TYPES ?? [];
        const explicitTypes =
          theme.types?.filter((t) => documentTypes.includes(t)) ?? [];
        const targetTypes = explicitTypes.length
          ? explicitTypes
          : documentTypes;

        for (const targetType of targetTypes) {
          const themes = (configDocumentNames[targetType] ??= []);

          try {
            themes.push(mapToRegisteredTheme(theme));
          } catch (e) {
            warn(
              `Unable to parse filter for theme ${theme.name}. It has been excluded.`,
              false,
              {
                error: e,
                ...theme,
              },
            );
          }
        }
      }
    }

    TidyHooks.tidy5eSheetWorldThemesConfigChanged(CONFIG.TIDY5E);

    TidyHooks.tidy5eSheetsThemeSettingsChanged();
  }

  static getWorldTheme(document?: Actor5e | Item5e): ThemeSettings {
    const worldDefaultSettings = foundry.utils.mergeObject(
      Theme.getDefaultThemeSettings(),
      CONFIG.TIDY5E.worldThemeDefault?.settings ?? {},
    ) as ThemeSettings;

    if (!document) {
      return worldDefaultSettings;
    }

    const filterData =
      CONFIG.TIDY5E.utils.theme.prepareThemeFilterData(document);
    const values = document
      ? Object.values(
          CONFIG.TIDY5E.worldThemes[document.documentName]?.[document.type] ??
            [],
        )
      : [];

    for (const entry of values) {
      if (dnd5e.Filter.performCheck(filterData, entry.filter)) {
        return foundry.utils.mergeObject(worldDefaultSettings, entry.settings);
      }
    }

    return worldDefaultSettings;
  }

  static prepareThemeFilterData(
    doc: Actor5e | Item5e | undefined,
  ): ThemeFilterData {
    const themeMode = getThemeV2(doc);

    const folder = doc?.folder
      ? '/' +
        [doc.folder, ...doc.folder.ancestors]
          .reverse()
          .map((f) => f.name)
          .join('/')
      : '';

    const data = {
      document: doc,
      folder,
      themeMode,
    };

    debug(`${Theme.prepareThemeFilterData.name} result`, data);

    return data;
  }

  static onReady() {
    setTimeout(() => {
      // Establish color mappings for Item Rarity and Spell Prep Mode
      const stylesheet = Theme.getTidyStyleSheet();

      Object.keys(CONFIG.DND5E.itemRarity).forEach((key) => {
        let rarityIdentifier = key.toLowerCase().slugify();

        stylesheet.insertRule(
          `@layer modules { 
            .tidy5e-sheet .rarity.${rarityIdentifier} {
              --t5e-item-color: var(--t5e-color-rarity-${rarityIdentifier}) 
            }
          }`,
        );
      });

      Object.keys(CONFIG.DND5E.spellcasting).forEach((key) => {
        let methodIdentifier = key.toLowerCase().slugify();

        stylesheet.insertRule(
          `@layer modules {
            .tidy5e-sheet .method-${methodIdentifier} { --t5e-method-color: var(--t5e-color-spellcasting-${methodIdentifier}) }
          }`,
        );
      });
    });
  }

  static getDefaultThemeSettings(
    alternateDefaults: Partial<ThemeSettings> = {},
  ): ThemeSettings {
    const defaults = {
      accentColor: Theme.DEFAULT_ACCENT_COLOR,
      useBasicTheme: false,
      useHeaderBackground: true,
      headerColor: '',
      actorHeaderBackground: '',
      headerBackgroundColor: '',
      itemSidebarBackground: '',
      portraitShape: undefined,
      rarityColors: {},
      spellPreparationMethodColors: {},
    };

    return foundry.utils.mergeObject(defaults, alternateDefaults);
  }

  // TODO: this is used way too widely; it needs to be consolidated to sheet prep and passed down as universal context
  static getSheetThemeSettings(
    options: ThemeSettingsConfigurationOptions,
  ): ThemeSettings {
    options.applyWorldThemeSetting ??= true;

    let defaultSettings = options.applyWorldThemeSetting
      ? CONFIG.TIDY5E.utils.theme.getWorldTheme(options.doc)
      : Theme.getDefaultThemeSettings(options.alternateDefaults);

    if (options.doc?.parent) {
      let parentSettings = Theme.getSheetThemeSettings({
        ...options,
        doc: options.doc?.parent,
      });

      defaultSettings = foundry.utils.mergeObject(
        defaultSettings,
        parentSettings,
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
      sheetFlagSettings,
    ) as ThemeSettings;

    if (
      options.doc?.flags.dnd5e?.[CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT] ===
      true
    ) {
      preferences.portraitShape = 'token';
    }

    // TODO: Extract to TidyHooks
    Hooks.callAll(
      'tidy5e-sheet.getSheetThemeSettings',
      preferences,
      options.doc,
    );

    return preferences;
  }

  static async saveSheetThemeSettings(doc: any, settings: ThemeSettings) {
    const toSave = { ...settings };

    const result = await TidyFlags.sheetThemeSettings.set(doc, toSave);

    await Theme.syncSystemTokenPortraitSetting(doc, settings.portraitShape);
    return result;
  }

  static getTidyStyleSheet() {
    return Array.from(document.styleSheets).find(
      // @ts-expect-error
      (s) => coalesce(s?.ownerNode?.id, s?.id) === Theme.tagId,
    )!;
  }

  static applyStyleDeclarations(
    declarations: ThemeQuadroneStyleDeclaration[],
    doc?: any,
    idOverride?: string,
  ) {
    // identify all relevant styles
    const identifierKey = doc
      ? ThemeStylesProvider.sheetSettingIdentifierKey(doc, idOverride)
      : ThemeStylesProvider.worldSettingIdentifierKey;

    const ogStylesheet = Theme.getTidyStyleSheet();
    // loop through our main stylesheet then any external ones
    for (const stylesheet of [ogStylesheet, ...Theme._externalStylesheets]) {
      const cssRules = Array.from(stylesheet.cssRules);

      // remove previous related styles
      const numberToRemove = cssRules.filter(filterToExactIdentifier).length;

      for (let i = 0; i < numberToRemove; i++) {
        const index = cssRules.findIndex(filterToExactIdentifier);
        stylesheet.deleteRule(index);
      }

      // insert styles
      for (const declaration of declarations) {
        stylesheet.insertRule(Theme.toModuleLayerRuleString(declaration));
      }
    }

    function filterToExactIdentifier(value: CSSRule): boolean {
      return value.cssText.includes(`${identifierKey}:`);
    }
  }

  static toModuleLayerRuleString(declaration: ThemeQuadroneStyleDeclaration) {
    return `@layer modules { ${declaration.selector} { ${declaration.ruleset
      .map((r) => `${r.property}: ${r.value}`)
      .join('; ')} } }`;
  }

  static readonly tagId = 'tidy5e-sheets-quadrone-theme-settings';

  static insertTidyThemeStyleTag() {
    const tag = document.createElement('style');
    tag.id = Theme.tagId;
    document.head.insertAdjacentElement('beforeend', tag);
  }

  static applyCurrentThemeSettingsToStylesheet(
    options: ThemeSettingsConfigurationOptions = {},
  ) {
    const themeSettings =
      options.settingsOverride ??
      (options.doc
        ? Theme.getSheetThemeSettings(options)
        : CONFIG.TIDY5E.utils.theme.getWorldTheme());
    const declarations = ThemeStylesProvider.create(themeSettings, options);
    Theme.applyStyleDeclarations(declarations, options.doc, options.idOverride);
  }

  static subscribeAndReactToThemeSettingsChanges(
    options: ThemeSettingsConfigurationOptions,
  ): Unsubscribable {
    const hookId = TidyHooks.tidy5eSheetsThemeSettingsChangedSubscribe(
      (doc?: any, liveThemeOverride?: ThemeSettings) => {
        const appliesToThisSheet =
          // We interpret changes to world themes as affecting all sheets.
          !doc ||
          (options.doc &&
            (doc.uuid === options.doc.uuid ||
              doc.uuid === options.doc.parent?.uuid));

        if (appliesToThisSheet && options.doc) {
          Theme.applyCurrentThemeSettingsToStylesheet({
            ...options,
            settingsOverride: liveThemeOverride,
          });
          options.callback?.({ settingsOverride: liveThemeOverride });
        }
      },
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
      CONFIG.TIDY5E.utils.theme.getWorldTheme(doc)?.portraitShape,
      Theme.DEFAULT_PORTRAIT_SHAPE,
    ) as PortraitShape;
  }

  static async updatePortraitShape(doc: any, newShape: PortraitShape) {
    await doc.update({
      [`${TidyFlags.sheetThemeSettings.prop}.portraitShape`]: newShape,
      [`flags.dnd5e.${CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT}`]:
        newShape === 'token',
    });
  }

  static async syncSystemTokenPortraitSetting(
    doc: any,
    newShape?: PortraitShape,
  ) {
    await doc.update({
      [`flags.dnd5e.${CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT}`]:
        newShape === 'token',
    });
  }

  static subscribeStylesheet(stylesheet: CSSStyleSheet) {
    const ogStylesheet = Theme.getTidyStyleSheet();
    stylesheet.replaceSync(
      Array.from(ogStylesheet.cssRules)
        .map((rule) => rule.cssText)
        .join('\n'),
    );
    Theme._externalStylesheets.add(stylesheet);
  }

  static unsubscribeStylesheet(stylesheet: CSSStyleSheet) {
    Theme._externalStylesheets.delete(stylesheet);
  }
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

export const actorHeaderBackgroundSupportedActorTypes = new Set<string>([
  CONSTANTS.SHEET_TYPE_CHARACTER,
  CONSTANTS.SHEET_TYPE_NPC,
  CONSTANTS.SHEET_TYPE_VEHICLE,
  CONSTANTS.SHEET_TYPE_GROUP,
  CONSTANTS.SHEET_TYPE_ENCOUNTER,
]);

function mapToRegisteredTheme(
  theme: WorldThemeSetting,
): WorldThemeSettingConfig {
  return {
    id: theme.id,
    name: theme.name,
    settings: theme.settings,
    sort: theme.sort,
    filter: theme.filter ? JSON.parse(theme.filter) : undefined,
  };
}
