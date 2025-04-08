import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import {
  getCurrentSettings,
  type CurrentSettings,
} from 'src/settings/settings.svelte';
import {
  applyCurrentThemeV1,
  getThemeOrDefaultV1,
  getThemeableColors,
} from 'src/theme/theme';
import type {
  ThemeColorSetting,
  Tidy5eThemeDataV1,
} from 'src/types/theme.types';
import { mount } from 'svelte';
import ThemeSettingsSheet from './ThemeSettingsSheet.svelte';
import { downloadTextFile } from 'src/utils/file';
import { CONSTANTS } from 'src/constants';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';

export type ThemeSettingsSheetFunctions = {
  save(settings: CurrentSettings): Promise<unknown>;
  useExistingThemeColors(themeId: string): void;
  exportTheme(settings: CurrentSettings): void;
};

export class ThemeSettingsFormApplication extends SvelteFormApplicationBase {
  themeableColors: ThemeColorSetting[] = getThemeableColors();
  settings = $state(getCurrentSettings());

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      width: 400,
      submitOnClose: false,
      minimizable: true,
      id: 'tidy-5e-sheets-theme-settings',
      popOut: true,
      resizable: true,
      closeOnSubmit: false,
    };
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.ThemeSettings.Sheet.title', {
      userName: game.user.name,
    });
  }

  createComponent(node: HTMLElement): Record<string, any> {
    return mount(ThemeSettingsSheet, {
      target: node,
      props: {
        themeableColors: this.themeableColors,
        settings: this.settings,
      },
      context: new Map<any, any>([
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
    Object.assign(this.settings, getCurrentSettings());
  }

  async saveChangedSettings(newSettings: CurrentSettings) {
    for (let color of this.themeableColors) {
      await FoundryAdapter.setTidySetting(color.key, newSettings[color.key]);
    }

    await FoundryAdapter.setTidySetting(
      'colorPickerEnabled',
      newSettings.colorPickerEnabled
    );

    applyCurrentThemeV1();

    await this.close();
  }

  useExistingThemeColors(themeId: string) {
    const targetTheme = getThemeOrDefaultV1(themeId);

    const colorsToUpdate = this.themeableColors.reduce<Record<string, unknown>>(
      (prev, color) => {
        prev[color.key] = targetTheme.variables[color.cssVariable];
        return prev;
      },
      {}
    );

    Object.assign(this.settings, colorsToUpdate);
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
    await this.saveChangedSettings(this.settings);
  }
}
