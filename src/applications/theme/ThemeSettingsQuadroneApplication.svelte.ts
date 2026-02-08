import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  HeaderStyle,
  PortraitShape,
  ThemeColorSetting,
  ThemeSettingsConfigurationOptions,
  ThemeSettingsV3,
} from 'src/theme/theme-quadrone.types';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import ThemeSettingsQuadrone from './ThemeSettingsQuadrone.svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { isNil } from 'src/utils/data';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ThemeColorSettingConfigEntry = ThemeColorSetting & {
  label: string;
};

export type ThemeSettingsContext = {
  value: {
    accentColor: string;
    headerStyle: HeaderStyle;
    headerColor: string;
    actorHeaderBackground: string;
    itemSidebarBackground: string;
    portraitShape: PortraitShape | undefined;
    rarityColors: ThemeColorSettingConfigEntry[];
    spellPreparationMethodColors: ThemeColorSettingConfigEntry[];
  };
};

type ConstructorArgs = Partial<ApplicationConfiguration & { document?: any }>;

export class ThemeSettingsQuadroneApplication extends SvelteApplicationMixin<ConstructorArgs>(
  foundry.applications.api.ApplicationV2
) {
  document?: any;

  _settings: ThemeSettingsContext = $state({
    value: {
      accentColor: '',
      headerStyle: 'default',
      headerColor: '',
      actorHeaderBackground: '',
      itemSidebarBackground: '',
      portraitShape: undefined,
      rarityColors: [],
      spellPreparationMethodColors: [],
    },
  });

  actorHeaderBackgroundSupportedActorTypes = new Set<string>([
    CONSTANTS.SHEET_TYPE_CHARACTER,
    CONSTANTS.SHEET_TYPE_NPC,
    CONSTANTS.SHEET_TYPE_VEHICLE,
    CONSTANTS.SHEET_TYPE_GROUP,
    CONSTANTS.SHEET_TYPE_ENCOUNTER,
  ]);

  themeConfigOptions(): ThemeSettingsConfigurationOptions {
    return {
      doc: this.document,
      idOverride: this.id,
    };
  }

  constructor(options: ConstructorArgs = {}) {
    super(options);

    this.document = options.document;
  }

  static DEFAULT_OPTIONS: Partial<ConstructorArgs> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-theme-settings'],
    tag: 'div',
    id: 'tidy-theme-settings',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 600,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  get title() {
    return this.document
      ? FoundryAdapter.localize(`TIDY5E.ThemeSettings.Sheet.title`, {
          userName: this.document.name,
        })
      : FoundryAdapter.localize('TIDY5E.ThemeSettings.SheetMenu.buttonLabel');
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    this._settings = this._getSettings();
    const placeholders = this.document
      ? this._mapSettings(ThemeQuadrone.getWorldThemeSettings())
      : undefined;

    const component = mount(ThemeSettingsQuadrone, {
      target: node,
      props: {
        app: this,
        settings: this._settings,
        placeholders,
      },
    });

    return component;
  }

  async _prepareContext(options: ApplicationRenderOptions) {
    // There has to be a better way for simple forms.
    this._settings = this._getSettings();
    return {};
  }

  _getSettings(settingsOverride?: ThemeSettingsV3) {
    let worldSettings = ThemeQuadrone.getWorldThemeSettings();

    let themeSettings =
      settingsOverride ??
      structuredClone(
        this.document
          ? ThemeQuadrone.getSheetThemeSettings({
              doc: this.document,
              applyWorldThemeSetting: false,
              alternateDefaults: {
                useHeaderBackground: worldSettings.useHeaderBackground,
                    headerStyle: worldSettings.headerStyle,
              },
            })
          : worldSettings
      );

    let context: ThemeSettingsContext = this._mapSettings(themeSettings);

    return context;
  }

  private _mapSettings(themeSettings: ThemeSettingsV3): ThemeSettingsContext {
    return {
      value: {
        accentColor: themeSettings.accentColor,
        headerStyle: themeSettings.headerStyle ?? 'default',
        headerColor: themeSettings.headerColor,
        actorHeaderBackground: themeSettings.actorHeaderBackground,
        itemSidebarBackground: themeSettings.itemSidebarBackground,
        portraitShape: themeSettings.portraitShape,
        rarityColors: Object.entries(CONFIG.DND5E.itemRarity).map(
          ([key, label]) => {
            return {
              label,
              key: key,
              value: themeSettings.rarityColors[key] ?? '',
            };
          }
        ),
        spellPreparationMethodColors: Object.entries(
          CONFIG.DND5E.spellcasting
        ).map(([key, config]) => {
          return {
            label: config.label,
            key: key,
            value: themeSettings.spellPreparationMethodColors[key] ?? '',
          };
        }),
      },
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    const context = this._settings;

    let themeSettings: ThemeSettingsV3 = this.mapContextToSettings(context);

    if (this.document) {
      await ThemeQuadrone.saveSheetThemeSettings(this.document, themeSettings);
    } else {
      await ThemeQuadrone.saveWorldThemeSettings(themeSettings);
    }
  }

  mapContextToSettings(context: ThemeSettingsContext): ThemeSettingsV3 {
    return {
      accentColor: context.value.accentColor ?? '',
      useHeaderBackground: context.value.headerStyle !== 'parchment',
      headerStyle: context.value.headerStyle,
      headerColor: context.value.headerColor,
      actorHeaderBackground: context.value.actorHeaderBackground,
      itemSidebarBackground: context.value.itemSidebarBackground,
      portraitShape: context.value.portraitShape,
      rarityColors: context.value.rarityColors
        .filter((t) => !isNil(t.value.trim(), ''))
        .reduce<Record<string, string>>((prev, curr) => {
          prev[curr.key] = curr.value;
          return prev;
        }, {}),
      spellPreparationMethodColors: context.value.spellPreparationMethodColors
        .filter((t) => !isNil(t.value.trim(), ''))
        .reduce<Record<string, string>>((prev, curr) => {
          prev[curr.key] = curr.value;
          return prev;
        }, {}),
    };
  }

  async useDefault() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      },
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
    });

    if (!proceed) {
      return;
    }

    if (this.document) {
      await TidyFlags.sheetThemeSettings.unset(this.document);
    } else {
      FoundryAdapter.setTidySetting('worldThemeSettings', {});
    }

    await this.close();
  }

  /* -------------------------------------------- */
  /*  Closing                                     */
  /* -------------------------------------------- */

  async close(options: ApplicationClosingOptions = {}) {
    TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);

    await super.close(options);
  }
}
