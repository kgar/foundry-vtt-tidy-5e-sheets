import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import SheetSettings from './SheetSettings.svelte';
import { writable, type Writable } from 'svelte/store';
import {
  getCurrentSettings,
  type CurrentSettings,
  type Tidy5eSettingKey,
  SettingsProvider,
} from 'src/settings/settings';
import { debug, error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import type { RegisteredTab } from 'src/runtime/types';
import type {
  DefaultTabSelectionFields,
  SettingsSheetContext,
  SettingsSheetFunctions,
  SettingsSheetStore,
} from './SheetSettings.types';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';

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

  getData() {
    const currentSettings = getCurrentSettings();

    return {
      settings: currentSettings,
      defaultCharacterTabs: this.mapTabSelectionFields(
        CharacterSheetRuntime.getAllRegisteredTabs(),
        currentSettings.defaultCharacterSheetTabs
      ),
      defaultNpcTabs: this.mapTabSelectionFields(
        NpcSheetRuntime.getAllRegisteredTabs(),
        currentSettings.defaultNpcSheetTabs
      ),
      defaultVehicleTabs: this.mapTabSelectionFields(
        VehicleSheetRuntime.getAllRegisteredTabs(),
        currentSettings.defaultVehicleSheetTabs
      ),
      exhaustionConfig: {
        ...SettingsProvider.settings.exhaustionConfig.options.default,
        ...currentSettings.exhaustionConfig,
      },
      vehicleExhaustionConfig: {
        ...SettingsProvider.settings.vehicleExhaustionConfig.options.default,
        ...currentSettings.vehicleExhaustionConfig,
      },
    };
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    const data = this.getData();

    this.cacheSettingsForChangeTracking(data.settings);

    debug('Sheet Settings context data', data);

    return new SheetSettings({
      target: node,
      context: new Map<any, any>([
        ['context', writable(data) satisfies SettingsSheetStore],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
            apply: this.applyChangedSettings.bind(this),
            mapTabSelectionFields: this.mapTabSelectionFields.bind(this),
            validate: this.validate.bind(this),
            resetDefaultTabs: this.resetDefaultTabs.bind(this),
          } satisfies SettingsSheetFunctions,
        ],
        ['appId', this.appId],
      ]),
    });
  }

  mapTabSelectionFields(
    registeredTabs: RegisteredTab<any>[],
    selectedTabIds: string[]
  ): DefaultTabSelectionFields {
    const available = registeredTabs
      .filter((t) => !selectedTabIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(TabManager.getTabTitle(t)),
      }));

    const selected = registeredTabs
      .filter((t) => selectedTabIds.includes(t.id))
      .sort(
        (a, b) => selectedTabIds.indexOf(a.id) - selectedTabIds.indexOf(b.id)
      )
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(TabManager.getTabTitle(t)),
      }));

    return {
      available,
      selected,
    };
  }

  /**
    Detect settings drift from the point in time when the sheet was opened,
    rather than differences with the live settings upon saving/applying changes.
    This ensures that the only settings which are updated are those that
    the user actually changed during editing this form.
    Otherwise, for example, a user could open this form, change the color scheme from another form,
    and then save this form, causing the color scheme to revert back.
  */
  private cacheSettingsForChangeTracking(currentSettings: CurrentSettings) {
    this.unchangedSettings = structuredClone(currentSettings);
  }

  validate(context: SettingsSheetContext) {
    let valid = true;

    if (
      context.defaultCharacterTabs.selected.length === 0 ||
      context.defaultNpcTabs.selected.length === 0 ||
      context.defaultVehicleTabs.selected.length === 0
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'T5EK.Settings.DefaultSheetTabs.AtLeastOneTabRequiredErrorMessage'
        ),
        true
      );
    }

    if (
      context.exhaustionConfig.type === 'specific' &&
      context.exhaustionConfig.levels < 1
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'T5EK.Settings.Exhaustion.AtLeastOneLevelRequiredErrorMessage'
        ),
        true
      );
    }

    if (
      context.vehicleExhaustionConfig.type === 'specific' &&
      context.vehicleExhaustionConfig.levels < 1
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'T5EK.Settings.VehicleExhaustion.AtLeastOneLevelRequiredErrorMessage'
        ),
        true
      );
    }

    // Add more data validation here as needed

    return valid;
  }

  async applyChangedSettings(context: SettingsSheetContext) {
    if (!this.validate(context)) {
      return false;
    }

    if (!this.unchangedSettings) {
      error('Unable to apply changed settings due to a sheet error', true);
      return false;
    }

    if (context.exhaustionConfig.type === 'specific') {
      context.exhaustionConfig.hints = context.exhaustionConfig.hints.slice(
        0,
        context.exhaustionConfig.levels + 1
      );
    }

    if (context.vehicleExhaustionConfig.type === 'specific') {
      context.vehicleExhaustionConfig.hints =
        context.vehicleExhaustionConfig.hints.slice(
          0,
          context.vehicleExhaustionConfig.levels + 1
        );
    }

    const newSettings: CurrentSettings = {
      ...context.settings,
      defaultCharacterSheetTabs: context.defaultCharacterTabs.selected.map(
        (t) => t.id
      ),
      defaultNpcSheetTabs: context.defaultNpcTabs.selected.map((t) => t.id),
      defaultVehicleSheetTabs: context.defaultVehicleTabs.selected.map(
        (t) => t.id
      ),
      exhaustionConfig: context.exhaustionConfig,
      vehicleExhaustionConfig: context.vehicleExhaustionConfig,
    };

    const keys = Object.keys(this.unchangedSettings) as Tidy5eSettingKey[];
    for (let key of keys) {
      const currentValue = this.unchangedSettings[key];
      const newValue = newSettings[key];
      if (currentValue !== newValue) {
        await FoundryAdapter.setTidySetting(key, newValue);
        debug(`Updated ${key} to ${newValue}`);
      }
    }

    this.cacheSettingsForChangeTracking(newSettings);

    return true;
  }

  async saveChangedSettings(context: SettingsSheetContext) {
    const changesApplied = await this.applyChangedSettings(context);

    if (!changesApplied) {
      return;
    }

    this.close();
  }

  resetDefaultTabs(
    context$: Writable<SettingsSheetContext>,
    actorType: string
  ) {
    switch (actorType) {
      case CONSTANTS.SHEET_TYPE_CHARACTER:
        context$.update((context) => {
          context.defaultCharacterTabs = this.mapTabSelectionFields(
            CharacterSheetRuntime.getAllRegisteredTabs(),
            [
              ...SettingsProvider.settings.defaultCharacterSheetTabs.options
                .default,
            ]
          );
          return context;
        });
        break;
      case CONSTANTS.SHEET_TYPE_NPC:
        context$.update((context) => {
          context.defaultNpcTabs = this.mapTabSelectionFields(
            NpcSheetRuntime.getAllRegisteredTabs(),
            [...SettingsProvider.settings.defaultNpcSheetTabs.options.default]
          );
          return context;
        });
        break;
      case CONSTANTS.SHEET_TYPE_VEHICLE:
        context$.update((context) => {
          context.defaultVehicleTabs = this.mapTabSelectionFields(
            VehicleSheetRuntime.getAllRegisteredTabs(),
            [
              ...SettingsProvider.settings.defaultVehicleSheetTabs.options
                .default,
            ]
          );
          return context;
        });
        break;
    }
  }
}
