import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import SettingsSheet from './SettingsSheet.svelte';
import { writable, type Writable } from 'svelte/store';
import {
  getCurrentSettings,
  type CurrentSettings,
  type Tidy5eSettingKey,
} from 'src/settings/settings';
import { debug, error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';

export type SettingsSheetFunctions = {
  save(settings: CurrentSettings): Promise<unknown>;
  apply(settings: CurrentSettings): Promise<unknown>;
};

export type SettingsSheetStore = Writable<CurrentSettings>;

declare var FormApplication: any;

export class Tidy5eKgarSettingsSheet extends FormApplication {
  initialTabId: string;
  unchangedSettings?: CurrentSettings;

  constructor(initialTabId: string, ...args: any[]) {
    super(...args);
    this.initialTabId = initialTabId ?? CONSTANTS.TAB_SETTINGS_PLAYERS;
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: 'T5EK.Settings.SheetMenu.title',
      width: 750,
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

    const currentSettings = getCurrentSettings();

    this.cacheSettingsForChangeTracking(currentSettings);
    this.component = new SettingsSheet({
      target: node,
      props: {
        selectedTabId: this.initialTabId,
      },
      context: new Map<any, any>([
        ['context', writable(currentSettings) satisfies SettingsSheetStore],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
            apply: this.applyChangedSettings.bind(this),
          } satisfies SettingsSheetFunctions,
        ],
        ['appId', this.appId],
      ]),
    });
  }

  /**
    Detect settings drift from the point in time when the sheet was opened,
    rather than differences with the live settings upon saving/applying changes.
    This ensures that the only settings which are update are those that
    the user actually changed during editing this form.
    Otherwise, for example, a user could open this form, change the color scheme from another form,
    and then save this form, causing the color scheme to revert back.
  */
  private cacheSettingsForChangeTracking(currentSettings: CurrentSettings) {
    this.unchangedSettings = structuredClone(currentSettings);
  }

  close(options: unknown = {}) {
    this.component?.$destroy();
    return super.close(options);
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

  async applyChangedSettings(newSettings: CurrentSettings) {
    if (!this.unchangedSettings) {
      error('Unable to apply changed settings due to a sheet error', true);
      return;
    }

    const keys = Object.keys(this.unchangedSettings) as Tidy5eSettingKey[];
    let settingsUpdated = false;
    for (let key of keys) {
      const currentValue = this.unchangedSettings[key];
      const newValue = newSettings[key];
      if (currentValue !== newValue) {
        await FoundryAdapter.setTidySetting(key, newValue);
        debug(`Updated ${key} to ${newValue}`);
        settingsUpdated = true;
      }
    }

    this.cacheSettingsForChangeTracking(newSettings);
  }

  async saveChangedSettings(newSettings: CurrentSettings) {
    await this.applyChangedSettings(newSettings);
    this.close();
  }
}
