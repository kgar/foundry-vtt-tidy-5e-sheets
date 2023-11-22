import SvelteApplicationBase from 'src/applications/SvelteApplicationBase';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import {
  getCurrentSettings,
  type CurrentSettings,
} from 'src/settings/settings';
import {
  applyCurrentTheme,
  getTheme,
  getThemeableColors,
} from 'src/theme/theme';
import type { ThemeColorSetting, Tidy5eThemeDataV1 } from 'src/types/theme';
import type { SvelteComponent } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import ThemeSettingsSheet from './ThemeSettingsSheet.svelte';
import { downloadTextFile } from 'src/utils/file';
import { CONSTANTS } from 'src/constants';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';

export type ThemeSettingsSheetFunctions = {
  save(settings: CurrentSettings): Promise<unknown>;
  useExistingThemeColors(themeId: string): void;
  exportTheme(settings: CurrentSettings): void;
};

export default class ThemeSettingsFormApplication extends SvelteFormApplicationBase {
  themeableColors: ThemeColorSetting[] = getThemeableColors();
  context: Writable<CurrentSettings> = writable(getCurrentSettings());

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: 'T5EK.ThemeSettings.Sheet.title',
      width: 400,
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new ThemeSettingsSheet({
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

  refreshContext(): void {
    this.context.set(getCurrentSettings());
  }

  async saveChangedSettings(newSettings: CurrentSettings) {
    for (let color of this.themeableColors) {
      await FoundryAdapter.setTidySetting(color.key, newSettings[color.key]);
    }

    await FoundryAdapter.setTidySetting(
      'colorPickerEnabled',
      newSettings.colorPickerEnabled
    );

    applyCurrentTheme();

    this.close();
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

  async _updateObject() {
    const settings = get(this.context);
    await this.saveChangedSettings(settings);
  }
}
