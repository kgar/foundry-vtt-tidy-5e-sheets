import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ThemeColorSetting,
  ThemeSettings,
} from 'src/theme/theme-quadrone.types';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import ThemeSettingsQuadrone from './ThemeSettingsQuadrone.svelte';
import { TidyFlags, TidyHooks } from 'src/api';
import { error } from 'src/utils/logging';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { isNil } from 'src/utils/data';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ThemeColorSettingConfigEntry = ThemeColorSetting & {
  label: string;
};

export type ThemeSettingsContext = {
  accentColor: string;
  headerBackground: string;
  useSaturatedRarityColors: boolean;
  rarityColors: ThemeColorSettingConfigEntry[];
  spellPreparationModeColors: ThemeColorSettingConfigEntry[];
};

type ConstructorArgs = Partial<ApplicationConfiguration & { document?: any }>;

export class ThemeSettingsQuadroneApplication extends SvelteApplicationMixin<ConstructorArgs>(
  foundry.applications.api.ApplicationV2
) {
  _document?: any;
  _settings: ThemeSettingsContext = $state({
    accentColor: '',
    headerBackground: '',
    rarityColors: [],
    spellPreparationModeColors: [],
    useSaturatedRarityColors: false,
  });

  constructor(options: ConstructorArgs = {}) {
    options.id = options?.document
      ? `tidy-theme-settings-${options.document.uuid}`
      : 'tidy-theme-settings';
    super(options);

    this._document = options.document;
  }

  static DEFAULT_OPTIONS: Partial<ConstructorArgs> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-theme-settings'],
    tag: 'form',
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
    return this._document
      ? `(Localize) ${this._document.name}: Theme Settings`
      : '(Localize) World Theme Settings';
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    this._settings = this._getSettings();

    const component = mount(ThemeSettingsQuadrone, {
      target: node,
      props: {
        app: this,
        settings: this._settings,
      },
    });

    return component;
  }

  async _prepareContext(options: ApplicationRenderOptions) {
    // There has to be a better way for simple forms.
    this._settings = this._getSettings();
    return {};
  }

  _getSettings() {
    let themeSettings = structuredClone(
      this._document
        ? ThemeQuadrone.getSheetThemeSettings(this._document)
        : ThemeQuadrone.getWorldThemeSettings()
    );

    let context: ThemeSettingsContext = {
      accentColor: themeSettings.accentColor,
      headerBackground: themeSettings.headerBackground,
      rarityColors: Object.entries(CONFIG.DND5E.itemRarity).map(
        ([key, label]) => {
          return {
            label,
            key: key,
            value: themeSettings.rarityColors[key] ?? '',
          };
        }
      ),
      spellPreparationModeColors: Object.entries(
        CONFIG.DND5E.spellPreparationModes
      ).map(([key, config]) => {
        return {
          label: config.label,
          key: key,
          value: themeSettings.spellPreparationModeColors[key] ?? '',
        };
      }),
      useSaturatedRarityColors: themeSettings.useSaturatedRarityColors ?? false,
    };

    return context;
  }

  async _renderFrame(options: ApplicationRenderOptions) {
    const element = await super._renderFrame(options);

    if (this._document) {
      try {
        applyThemeToApplication(element, this._document);
      } catch (e) {
        error(
          'An error occurred while applying theme to application',
          false,
          e
        );
      }
    }

    return element;
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    const data = this._settings;

    let themeSettings: ThemeSettings = {
      accentColor: data.accentColor ?? '',
      headerBackground: data.headerBackground,
      useSaturatedRarityColors: data.useSaturatedRarityColors,
      rarityColors: data.rarityColors
        .filter((t) => !isNil(t.value.trim(), ''))
        .reduce<Record<string, string>>((prev, curr) => {
          prev[curr.key] = curr.value;
          return prev;
        }, {}),
      spellPreparationModeColors: data.spellPreparationModeColors
        .filter((t) => !isNil(t.value.trim(), ''))
        .reduce<Record<string, string>>((prev, curr) => {
          prev[curr.key] = curr.value;
          return prev;
        }, {}),
    };

    if (this._document) {
      await ThemeQuadrone.saveSheetThemeSettings(this._document, themeSettings);
    } else {
      await ThemeQuadrone.saveWorldThemeSettings(themeSettings);
    }

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this._document);
  }

  async useDefault() {
    // TODO: Pop a confirmation before committing to this.

    if (this._document) {
      await TidyFlags.sheetThemeSettings.unset(this._document);
    } else {
      FoundryAdapter.setTidySetting('worldThemeSettings', {});
    }

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this._document);

    await this.close();
  }
}
