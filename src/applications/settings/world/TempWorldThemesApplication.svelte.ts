import { CONSTANTS } from 'src/constants';
import { getSvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { WorldThemeSetting } from 'src/settings/settings.types';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount, type ComponentProps } from 'svelte';
import TempWorldThemes from './TempWorldThemes.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';

export type ThemeColorSettingOption = {
  label: string;
  key: string;
};

export type TempWorldThemesContext = {
  themes: WorldThemeSetting[];
  rarityColors: ThemeColorSettingOption[];
  spellPreparationMethodColors: ThemeColorSettingOption[];
};

export class TempWorldThemesApplication extends getSvelteApplicationMixin<
  Partial<ApplicationConfiguration>,
  TempWorldThemesContext
>(foundry.applications.api.ApplicationV2) {
  _config: TempWorldThemesContext = $state({
    themes: [],
    rarityColors: [],
    spellPreparationMethodColors: [],
  });

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-sheet-settings'],
    id: 'temp-world-themes-settings',
    tag: 'div',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'Temp - World Themes (DELETE ME)',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 1000,
      height: 700,
    },
    actions: {
      addTheme: TempWorldThemesApplication.#addTheme,
      deleteTheme: TempWorldThemesApplication.#deleteTheme,
      save: TempWorldThemesApplication.#save,
    },
    submitOnClose: false,
  };

  constructor(options: Partial<ApplicationConfiguration> = {}) {
    super(options);
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(TempWorldThemes, {
      target: node,
      props: {
        app: this,
        config: this._config,
      } satisfies ComponentProps<typeof TempWorldThemes>,
    });
  }

  async _prepareContext(
    options: ApplicationRenderOptions,
  ): Promise<TempWorldThemesContext> {
    if (options.isFirstRender) {
      this._config.themes = Object.values({
        ...SettingsProvider.settings.worldThemes.get(),
      });
      // Set some necessary defaults
      this._config.themes.forEach((t) => {
        t.settings.rarityColors ??= {};
        t.settings.spellPreparationMethodColors ??= {};
      });

      this._config.rarityColors = Object.entries(CONFIG.DND5E.itemRarity).map(
        ([key, label]) => ({
          label,
          key,
        }),
      );

      this._config.spellPreparationMethodColors = Object.entries(
        CONFIG.DND5E.spellcasting,
      ).map(([key, config]) => ({
        label: config.label,
        key,
      }));
    }

    return this._config;
  }

  async save() {
    const toSave = this._config.themes.reduce<
      Record<string, WorldThemeSetting>
    >((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});

    game.settings.set('tidy5e-sheet', 'worldThemes', toSave);
  }

  // TODO: Nice dividers -- can't even afford those in this economy while prototyping

  static async #addTheme(
    this: TempWorldThemesApplication,
    _event: Event,
    _target: HTMLElement,
  ) {
    const maxSort = this._config.themes.reduce(
      (prev, curr) => Math.max(prev, curr.sort),
      0,
    );

    this._config.themes.push({
      filterMode: 'basic',
      id: foundry.utils.randomID(),
      name: 'TODO: New Name Here',
      settings: {},
      sort: maxSort + 1,
      documentName: undefined,
      filter: undefined,
      type: undefined,
    });
  }

  static async #deleteTheme(
    this: TempWorldThemesApplication,
    _event: Event,
    target: HTMLElement,
  ) {
    const id = target.getAttribute('data-id');

    this._config.themes = this._config.themes
      .filter((t) => t.id !== id)
      .sort((a, b) => a.sort - b.sort);

    for (let i = 0; i < this._config.themes.length; i++) {
      this._config.themes[i].sort = i + 1;
    }
  }

  static async #save(
    this: TempWorldThemesApplication,
    _event: Event,
    target: HTMLElement,
  ) {
    await this.save();
  }
}
