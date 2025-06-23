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
import { settings, type CurrentSettings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { isNil } from 'src/utils/data';

const rarityVariablePrefix = '--t5e-color-rarity';
// const spellPrepVariablePrefix = '--t5e-color-icon-spellcasting';
// const accentColorCssVariable = '--t5e-theme-color-default';

export type ThemeColorSettingConfigEntry = ThemeColorSetting & {
  label: string;
};

export type ThemeSettingsContext = {
  accentColor: string;
  headerBackground: string;
  useSaturatedRarityColors: boolean;
  rarityColors: ThemeColorSettingConfigEntry[];
  spellPreparationColors: ThemeColorSettingConfigEntry[];
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
    spellPreparationColors: [],
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
      //   contentClasses: ['flexcol', 'flex1'],
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
        ? TidyFlags.sheetThemeSettings.get(this._document)
        : settings.value.worldThemeSettings
    );

    let configuredRarities = themeSettings.rarityColors.reduce<
      Record<string, ThemeColorSetting>
    >((prev, curr) => {
      prev[curr.key] = curr;
      return prev;
    }, {});

    let configuredPrepModes: Record<string, ThemeColorSetting> =
      themeSettings.spellPreparationModeColors.reduce<
        Record<string, ThemeColorSetting>
      >((prev, curr) => {
        prev[curr.key] = curr;
        return prev;
      }, {});

    let context: ThemeSettingsContext = {
      accentColor: themeSettings.accentColor,
      headerBackground: '', // TODO: Implement
      rarityColors: Object.entries(CONFIG.DND5E.itemRarity).map(
        ([key, label]) => {
          return {
            label,
            key: key,
            value: configuredRarities[key]?.value ?? '',
          };
        }
      ),
      spellPreparationColors: Object.entries(
        CONFIG.DND5E.spellPreparationModes
      ).map(([key, config]) => {
        return {
          label: config.label,
          key: key,
          value: configuredPrepModes[key]?.value ?? '',
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

    // turn context back into themesettings
    let themeSettings: ThemeSettings = {
      useSaturatedRarityColors: data.useSaturatedRarityColors,
      headerBackground: '',
      accentColor: data.accentColor ?? '',
      rarityColors: data.rarityColors
        .map((c) => ({
          key: c.key,
          value: c.value,
        }))
        .filter((t) => !isNil(t.value.trim(), '')),
      spellPreparationModeColors: data.spellPreparationColors
        .map((c) => ({
          key: c.key,
          value: c.value,
        }))
        .filter((t) => !isNil(t.value.trim(), '')),
    };

    if (this._document) {
      await TidyFlags.sheetThemeSettings.set(this._document, themeSettings);
    } else {
      await FoundryAdapter.setTidySetting('worldThemeSettings', themeSettings);
    }

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this._document);
  }

  async useDefault() {
    // TODO: Pop a confirmation before committing to this.

    if (this._document) {
      await TidyFlags.sheetThemeSettings.unset(this._document);
    } else {
      let settingKey: keyof CurrentSettings = 'worldThemeSettings';

      const setting = game.settings.storage
        .get('world')
        .filter(
          (setting: any) =>
            setting.key === `${CONSTANTS.MODULE_ID}.${settingKey}`
        )
        ?.delete();
    }

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this._document);

    await this.close();
  }
}
