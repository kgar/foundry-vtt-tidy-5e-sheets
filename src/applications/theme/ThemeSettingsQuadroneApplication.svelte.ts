import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ThemeColorSetting,
  ThemeSettings,
} from 'src/theme/theme-quadrone.types';
import type {
  ApplicationClosingOptions,
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
  document?: any;
  _settings: ThemeSettingsContext = $state({
    accentColor: '',
    headerBackground: '',
    rarityColors: [],
    spellPreparationModeColors: [],
    useSaturatedRarityColors: false,
  });

  constructor(options: ConstructorArgs = {}) {
    options.id = options?.document
      ? `tidy-theme-settings-${options.document.uuid.replaceAll('.', '-')}`
      : 'tidy-theme-settings';
    super(options);

    this.document = options.document;
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
    return this.document
      ? `(Localize) ${this.document.name}: Theme Settings`
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
      this.document
        ? ThemeQuadrone.getSheetThemeSettings(this.document)
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

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  themeSettingsChangeHookId?: number;

  async _renderFrame(options: ApplicationRenderOptions) {
    const element = await super._renderFrame(options);

    if (this.document) {
      try {
        applyThemeToApplication(element, this.document);

        ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
          doc: this.document,
          mergeParentDocumentSettings: true,
          idOverride: this.id,
        });

        this.themeSettingsChangeHookId =
          TidyHooks.tidy5eSheetsThemeSettingsChangedSubscribe((doc?: any) => {
            const appliesToThisSheet =
              !!doc &&
              (doc.uuid === this.document.uuid ||
                doc.uuid === this.document.parent?.uuid);

            if (appliesToThisSheet) {
              ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
                doc: this.document,
                mergeParentDocumentSettings: true,
                idOverride: this.id,
              });
            }
          });
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

    if (this.document) {
      await ThemeQuadrone.saveSheetThemeSettings(this.document, themeSettings);
    } else {
      await ThemeQuadrone.saveWorldThemeSettings(themeSettings);
    }

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);
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

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);

    await this.close();
  }

  /* -------------------------------------------- */
  /*  Closing                                     */
  /* -------------------------------------------- */

  async close(options: ApplicationClosingOptions = {}) {
    TidyHooks.tidy5eSheetsThemeSettingsChangedUnsubscribe(
      this.themeSettingsChangeHookId
    );

    await super.close(options);
  }
}
