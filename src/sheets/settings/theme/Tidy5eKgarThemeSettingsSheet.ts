import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import ThemeSettingsSheet from './ThemeSettingsSheet.svelte';
import {
  getCurrentSettings,
  type CurrentSettings,
} from 'src/settings/settings';
import { get, writable, type Writable } from 'svelte/store';
import {
  applyCurrentTheme,
  getTheme,
  getThemeableColors,
} from 'src/theme/theme';
import type { ThemeColorSetting, Tidy5eThemeDataV1 } from 'src/types/theme';
import { downloadTextFile } from 'src/utils/file';
import { CONSTANTS } from 'src/constants';

declare var FormApplication: any;

export type ThemeSettingsSheetFunctions = {
  save(settings: CurrentSettings): Promise<unknown>;
  useExistingThemeColors(themeId: string): void;
  exportTheme(settings: CurrentSettings): void;
};

export class Tidy5eKgarThemeSettingsSheet extends FormApplication {
  themeableColors: ThemeColorSetting[] = getThemeableColors();
  context: Writable<CurrentSettings> = writable(getCurrentSettings());

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: 'T5EK.ThemeSettings.Sheet.title',
      width: 400,
      classes: ['tidy5e-kgar', 'settings'],
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    const node = html.get(0);

    this.context = writable(getCurrentSettings());

    this.component = new ThemeSettingsSheet({
      target: node,
      props: {
        themeableColors: this.themeableColors,
      },
      context: new Map<any, any>([
        ['context', this.context],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
            useExistingThemeColors: this.useExistingThemeColors.bind(this),
            exportTheme: this.exportTheme.bind(this),
          } satisfies ThemeSettingsSheetFunctions,
        ],
        ['appId', this.appId],
      ]),
    });
  }

  async saveChangedSettings(newSettings: CurrentSettings) {
    for (let color of this.themeableColors) {
      await FoundryAdapter.setGameSetting(color.key, newSettings[color.key]);
    }

    await FoundryAdapter.setGameSetting(
      'colorPickerEnabled',
      newSettings.colorPickerEnabled
    );

    applyCurrentTheme();

    this.close();
  }

  render(force = false, ...args: any[]) {
    if (force) {
      this.component?.$destroy();
      super.render(force, ...args);
      return this;
    }

    // TODO: If there's context to refresh, do it here
    return this;
  }

  close(...args: any[]) {
    this.component?.$destroy();
    return super.close(...args);
  }

  async _updateObject() {
    const settings = get(this.context);
    await this.saveChangedSettings(settings);
  }

  useExistingThemeColors(themeId: string) {
    const targetTheme = getTheme(themeId);

    const colorsToUpdate = this.themeableColors.reduce<Record<string, unknown>>(
      (prev, color) => {
        prev[color.key] = targetTheme.variables[color.cssVariable];
        return prev;
      },
      {}
    );

    this.context.update((current) => {
      return {
        ...current,
        ...colorsToUpdate,
      };
    });
  }

  exportTheme(settings: CurrentSettings) {
    const variables = this.themeableColors.reduce<Record<string, string>>(
      (prev, curr) => {
        prev[curr.cssVariable] = settings[curr.key]?.toString();
        return prev;
      },
      {}
    );

    const exportData: Tidy5eThemeDataV1 = {
      version: 1,
      variables,
    };

    downloadTextFile(
      'theme' + CONSTANTS.THEME_EXTENSION_WITH_DOT,
      JSON.stringify(exportData, null, ' ')
    );
  }
}
