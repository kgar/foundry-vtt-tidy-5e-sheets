import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import SheetSettings from './SheetSettings.svelte';
import { writable, type Writable } from 'svelte/store';
import {
  getCurrentSettings,
  type CurrentSettings,
  type Tidy5eSettingKey,
} from 'src/settings/settings';
import { debug, error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import { getAllRegisteredCharacterSheetTabs } from 'src/runtime/character-sheet-state';
import { getAllRegisteredNpcSheetTabs } from 'src/runtime/npc-sheet-state';
import { getAllRegisteredVehicleSheetTabs } from 'src/runtime/vehicle-sheet-state';

type TabSelectionItem = {
  id: string;
  label: string;
};

export type SettingsSheetContext = {
  settings: CurrentSettings;
  availableCharacterTabs: TabSelectionItem[];
  selectedCharacterTabs: TabSelectionItem[];
  availableNpcTabs: TabSelectionItem[];
  selectedNpcTabs: TabSelectionItem[];
  availableVehicleTabs: TabSelectionItem[];
  selectedVehicleTabs: TabSelectionItem[];
};

export type SettingsSheetFunctions = {
  save(settings: SettingsSheetContext): Promise<unknown>;
  apply(settings: SettingsSheetContext): Promise<unknown>;
};

export type SettingsSheetStore = Writable<SettingsSheetContext>;

export class SheetSettingsFormApplication extends SvelteFormApplicationBase {
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
      classes: [...super.defaultOptions.classes, 'settings'],
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  // TODO: Create a `getData()` function to house the data prep
  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    const currentSettings = getCurrentSettings();

    const registeredCharacterTabs = getAllRegisteredCharacterSheetTabs();
    const availableCharacterTabs: TabSelectionItem[] = registeredCharacterTabs
      .filter((t) => !currentSettings.defaultCharacterSheetTabs.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(t.displayName),
      }));
    const selectedCharacterTabs: TabSelectionItem[] = registeredCharacterTabs
      .filter((t) => currentSettings.defaultCharacterSheetTabs.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(t.displayName),
      }));

    const registeredNpcTabs = getAllRegisteredNpcSheetTabs();
    const availableNpcTabs: TabSelectionItem[] = registeredNpcTabs
      .filter((t) => !currentSettings.defaultNpcSheetTabs.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(t.displayName),
      }));
    const selectedNpcTabs: TabSelectionItem[] = registeredNpcTabs
      .filter((t) => currentSettings.defaultNpcSheetTabs.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(t.displayName),
      }));

    const registeredVehicleTabs = getAllRegisteredVehicleSheetTabs();
    const availableVehicleTabs: TabSelectionItem[] = registeredVehicleTabs
      .filter((t) => !currentSettings.defaultVehicleSheetTabs.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(t.displayName),
      }));
    const selectedVehicleTabs: TabSelectionItem[] = registeredVehicleTabs
      .filter((t) => currentSettings.defaultVehicleSheetTabs.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(t.displayName),
      }));

    this.cacheSettingsForChangeTracking(currentSettings);
    return new SheetSettings({
      target: node,
      context: new Map<any, any>([
        [
          'context',
          writable({
            settings: currentSettings,
            availableCharacterTabs,
            selectedCharacterTabs,
            availableNpcTabs,
            selectedNpcTabs,
            availableVehicleTabs,
            selectedVehicleTabs,
          }) satisfies SettingsSheetStore,
        ],
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

  async applyChangedSettings(context: SettingsSheetContext) {
    // TODO: Validate before save

    if (!this.unchangedSettings) {
      error('Unable to apply changed settings due to a sheet error', true);
      return;
    }

    const newSettings: CurrentSettings = {
      ...context.settings,
      defaultCharacterSheetTabs: context.selectedCharacterTabs.map((t) => t.id),
      defaultNpcSheetTabs: context.selectedNpcTabs.map((t) => t.id),
      defaultVehicleSheetTabs: context.selectedVehicleTabs.map((t) => t.id),
    };

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

  async saveChangedSettings(context: SettingsSheetContext) {
    // TODO: Validate before save
    await this.applyChangedSettings(context);
    this.close();
  }
}
