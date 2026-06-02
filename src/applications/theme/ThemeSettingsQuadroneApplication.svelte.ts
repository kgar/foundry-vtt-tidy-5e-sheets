import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
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
import { mount, type Component } from 'svelte';
import ThemeSettingsQuadrone from './ThemeSettingsQuadrone.svelte';
import SettingsDialogShell from 'src/applications/settings/SettingsDialogShell.svelte';
import type {
  SettingsFooterHost,
  SettingsPane,
} from 'src/applications/settings/settings-pane.types';
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
    useBasicTheme: boolean | null;
    useHeaderBackground: boolean | null;
    headerColor: string;
    actorHeaderBackground: string;
    headerBackgroundColor: string;
    itemSidebarBackground: string;
    portraitShape: PortraitShape | undefined;
    rarityColors: ThemeColorSettingConfigEntry[];
    spellPreparationMethodColors: ThemeColorSettingConfigEntry[];
  };
};

type ConstructorArgs = Partial<ApplicationConfiguration & { document?: any }>;

export class ThemeSettingsQuadroneApplication
  extends SvelteApplicationMixin<ConstructorArgs>(
    foundry.applications.api.ApplicationV2
  )
  implements SettingsPane, SettingsFooterHost
{
  document?: any;

  _settings: ThemeSettingsContext = $state({
    value: {
      accentColor: '',
      useBasicTheme: null,
      useHeaderBackground: null,
      headerColor: '',
      actorHeaderBackground: '',
      headerBackgroundColor: '',
      itemSidebarBackground: '',
      portraitShape: undefined,
      rarityColors: [],
      spellPreparationMethodColors: [],
    },
  });

  _initialSnapshot = $state('');

  hasChanges = $derived(
    JSON.stringify($state.snapshot(this._settings.value)) !==
      this._initialSnapshot
  );

  // Standalone window is its own single-pane host.
  canUndo = $derived(this.hasChanges);
  canUseDefault = true;

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
    this._resetToGlobalDefaults();
    const placeholders = this.document
      ? this._mapSettings(ThemeQuadrone.getWorldThemeSettings(), {
        allowNullBooleans: false,
      })
      : undefined;


    const component = mount(SettingsDialogShell, {
      target: node,
      props: {
        host: this,
        pane: ThemeSettingsQuadrone,
        paneProps: {
          app: this,
          settings: this._settings,
          placeholders,
        },
      },
    });

    return component;
  }

  async _prepareContext(options: ApplicationRenderOptions) {
    // There has to be a better way for simple forms.
    this._settings = this._getSettings();
    return {};
  }

  _getSettings(settingsOverride?: Partial<ThemeSettingsV3>) {
    const allowNullBooleans = !!this.document;

    const source =
      settingsOverride ??
      (this.document
        ? TidyFlags.sheetThemeSettings.get(this.document) ?? {}
        : ThemeQuadrone.getChangedWorldThemeSettingsForForm());

    return this._mapSettings(source, { allowNullBooleans });
  }

  _mapSettings(
    source: Partial<ThemeSettingsV3>,
    options: { allowNullBooleans: boolean }
  ): ThemeSettingsContext {
    const nullableBool = (value: boolean | null | undefined, fallback: boolean) =>
      options.allowNullBooleans ? value ?? null : value ?? fallback;

    return {
      value: {
        accentColor: source.accentColor ?? '',
        useBasicTheme: nullableBool(source.useBasicTheme, false),
        useHeaderBackground: nullableBool(source.useHeaderBackground, true),
        headerColor: source.headerColor ?? '',
        actorHeaderBackground: source.actorHeaderBackground ?? '',
        headerBackgroundColor: source.headerBackgroundColor ?? '',
        itemSidebarBackground: source.itemSidebarBackground ?? '',
        portraitShape: source.portraitShape,
        rarityColors: Object.entries(CONFIG.DND5E.itemRarity).map(
          ([key, label]) => ({
            label,
            key,
            value: source.rarityColors?.[key] ?? '',
          })
        ),
        spellPreparationMethodColors: Object.entries(
          CONFIG.DND5E.spellcasting
        ).map(([key, config]) => ({
          label: config.label,
          key,
          value: source.spellPreparationMethodColors?.[key] ?? '',
        })),
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
    const changedSettings = this.mapContextToChangedSettings(this._settings);

    if (this.document) {
      if (Object.keys(changedSettings).length === 0) {
        await TidyFlags.sheetThemeSettings.unset(this.document);
      } else {
        await ThemeQuadrone.saveSheetThemeSettings(
          this.document,
          changedSettings as ThemeSettingsV3
        );
      }
    } else {
      await ThemeQuadrone.saveWorldThemeSettings(changedSettings as ThemeSettingsV3);
    }

    this._resetToGlobalDefaults();
  }

  _resetToGlobalDefaults() {
    this._initialSnapshot = JSON.stringify(
      $state.snapshot(this._settings.value)
    );
  }

  undoChanges() {
    // Mutate in place so bound fields refresh whether the settings object was
    // captured once (standalone shell) or re-read each render (composite host).
    Object.assign(this._settings.value, this._getSettings().value);
    this._resetToGlobalDefaults();
  }

  // Only capture settings that have been changed
  mapContextToChangedSettings(
    context: ThemeSettingsContext
  ): Partial<ThemeSettingsV3> {
    const currentSettings = context.value;
    const changedSettings: Partial<ThemeSettingsV3> = {};

    const stringFields = [
      'accentColor',
      'headerColor',
      'actorHeaderBackground',
      'headerBackgroundColor',
      'itemSidebarBackground',
    ] as const;
    for (const key of stringFields) {
      if (!isNil(currentSettings[key], '')) {
        changedSettings[key] = currentSettings[key];
      }
    }

    if (currentSettings.useBasicTheme !== null) {
      changedSettings.useBasicTheme = currentSettings.useBasicTheme;
    }
    if (currentSettings.useHeaderBackground !== null) {
      changedSettings.useHeaderBackground = currentSettings.useHeaderBackground;
    }
    if (currentSettings.portraitShape !== undefined) {
      changedSettings.portraitShape = currentSettings.portraitShape;
    }

    const rarities = this._collectColors(currentSettings.rarityColors);
    if (Object.keys(rarities).length) {
      changedSettings.rarityColors = rarities;
    }

    const methods = this._collectColors(currentSettings.spellPreparationMethodColors);
    if (Object.keys(methods).length) {
      changedSettings.spellPreparationMethodColors = methods;
    }

    return changedSettings;
  }

  private _collectColors(entries: ThemeColorSettingConfigEntry[]) {
    return entries
      .filter((t) => !isNil(t.value.trim(), ''))
      .reduce<Record<string, string>>((prev, curr) => {
        prev[curr.key] = curr.value;
        return prev;
      }, {});
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

    this.resetToDefault();
  }

  /**
   * Stage defaults into memory (sheet: inherit world via null/empty; world:
   * system fallbacks). Persisted on the dialog's Save, reversible via Undo.
   */
  resetToDefault() {
    const defaults = this._mapSettings(
      {},
      { allowNullBooleans: !!this.document }
    ).value;
    Object.assign(this._settings.value, defaults);
  }

  /* -------------------------------------------- */
  /*  Closing                                     */
  /* -------------------------------------------- */

  async close(options: ApplicationClosingOptions = {}) {
    TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);

    await super.close(options);
  }
}
