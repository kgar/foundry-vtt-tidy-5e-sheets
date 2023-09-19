import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import ThemeSettingsSheet from './ThemeSettingsSheet.svelte';
import {
  getCurrentSettings,
  type CurrentSettings,
} from 'src/settings/settings';
import { writable, type Writable } from 'svelte/store';
import { applyCurrentTheme, getThemeableColors } from 'src/theme/theme';
import type { ThemeColorSetting } from 'src/types/theme';

declare var FormApplication: any;

export type ThemeSettingsSheetFunctions = {
  save(settings: CurrentSettings): Promise<unknown>;
};

export class Tidy5eKgarThemeSettingsSheet extends FormApplication {
  themeableColors: ThemeColorSetting[] = getThemeableColors();
  store: Writable<CurrentSettings>;

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

    this.store = writable(getCurrentSettings());

    this.component = new ThemeSettingsSheet({
      target: node,
      props: {
        themeableColors: this.themeableColors,
      },
      context: new Map<any, any>([
        ['store', this.store],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
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
    const unsubscribeFn = this.store.subscribe(async (settings) => {
      await this.saveChangedSettings(settings);
    });
    unsubscribeFn();
  }
}
