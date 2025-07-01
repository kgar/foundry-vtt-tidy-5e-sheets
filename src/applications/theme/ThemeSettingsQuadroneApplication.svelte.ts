import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  PortraitShape,
  ThemeColorSetting,
  ThemeSettingsV1 as ThemeSettingsV1,
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
import type { Unsubscribable } from 'src/foundry/TidyHooks.types';

export type ThemeColorSettingConfigEntry = ThemeColorSetting & {
  label: string;
};

export type ThemeSettingsContext = {
  accentColor: string;
  headerBackground: string;
  portraitShape: PortraitShape | undefined;
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
    portraitShape: undefined,
    rarityColors: [],
    spellPreparationModeColors: [],
    useSaturatedRarityColors: false,
  });

  private get themeConfigOptions() {
    return {
      doc: this.document,
      mergeParentDocumentSettings: true,
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

  _getSettings(settingsOverride?: ThemeSettingsV1) {
    let themeSettings =
      settingsOverride ??
      structuredClone(
        this.document
          ? ThemeQuadrone.getSheetThemeSettings({
              doc: this.document,
            })
          : ThemeQuadrone.getWorldThemeSettings()
      );

    let context: ThemeSettingsContext = {
      accentColor: themeSettings.accentColor,
      headerBackground: themeSettings.headerBackground,
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

  themeSettingsSubscription?: Unsubscribable;

  async _renderFrame(options: ApplicationRenderOptions) {
    const element = await super._renderFrame(options);

    if (this.document) {
      try {
        applyThemeToApplication(element, this.document);

        ThemeQuadrone.applyCurrentThemeSettingsToStylesheet(
          this.themeConfigOptions
        );

        this.themeSettingsSubscription =
          ThemeQuadrone.subscribeAndReactToThemeSettingsChanges(
            this.themeConfigOptions
          );
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

    let themeSettings: ThemeSettingsV1 = this.mapContextToSettings(data);

    if (this.document) {
      await ThemeQuadrone.saveSheetThemeSettings(this.document, themeSettings);
    } else {
      await ThemeQuadrone.saveWorldThemeSettings(themeSettings);
    }
  }

  mapContextToSettings(data: ThemeSettingsContext): ThemeSettingsV1 {
    return {
      accentColor: data.accentColor ?? '',
      headerBackground: data.headerBackground,
      portraitShape: data.portraitShape,
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
    this.themeSettingsSubscription?.unsubscribe();

    TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);

    await super.close(options);
  }
}
