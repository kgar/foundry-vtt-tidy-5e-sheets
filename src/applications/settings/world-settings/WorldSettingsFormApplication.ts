import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import type { SvelteComponent } from 'svelte';
import WorldSettings from './WorldSettings.svelte';
import {
  SettingsProvider,
  getCurrentSettings,
  type Tidy5eSettingKey,
  type CurrentSettings,
} from 'src/settings/settings';
import type {
  DefaultTabSelectionFields,
  WorldSettingsContext,
  WorldSettingsContextStore,
  WorldSettingsFunctions,
} from './WorldSettings.types';
import type { RegisteredTab } from 'src/runtime/types';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TabManager } from 'src/runtime/tab/TabManager';
import { debug, error } from 'src/utils/logging';
import { writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';

export class WorldSettingsFormApplication extends SvelteFormApplicationBase {
  unchangedSettings?: CurrentSettings;

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: 'TIDY5E.WorldSettings.Menu.title',
      width: 750,
      classes: [...super.defaultOptions.classes, 'settings'],
      id: 'tidy-5e-sheets-world-settings',
      popOut: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  getData(): WorldSettingsContext {
    const currentSettings = getCurrentSettings();

    return {
      settings: {
        hideDeathSavesFromPlayers: currentSettings.hideDeathSavesFromPlayers,
        useCharacterEncumbranceBar: currentSettings.useCharacterEncumbranceBar,
        useNpcEncumbranceBar: currentSettings.useNpcEncumbranceBar,
        useVehicleEncumbranceBar: currentSettings.useVehicleEncumbranceBar,
        showPlayerName: currentSettings.showPlayerName,
        sortFavoriteItemsAlphabetically:
          currentSettings.sortFavoriteItemsAlphabetically,
        showExpandedLimitedView: currentSettings.showExpandedLimitedView,
        itemCardsFixKey: currentSettings.itemCardsFixKey,
        useCircularPortraitStyle: currentSettings.useCircularPortraitStyle,
        permanentlyUnlockCharacterSheetForGm:
          currentSettings.permanentlyUnlockCharacterSheetForGm,
        permanentlyUnlockNpcSheetForGm:
          currentSettings.permanentlyUnlockNpcSheetForGm,
        permanentlyUnlockVehicleSheetForGm:
          currentSettings.permanentlyUnlockVehicleSheetForGm,
        limitEffectsManagementToGm: currentSettings.limitEffectsManagementToGm,
        useCharacterInspiration: currentSettings.useCharacterInspiration,
        useVehicleMotion: currentSettings.useVehicleMotion,
        useExhaustion: currentSettings.useExhaustion,
        showTraitLabels: currentSettings.showTraitLabels,
        allowCantripsToBePrepared: currentSettings.allowCantripsToBePrepared,
        allowHpMaxOverride: currentSettings.allowHpMaxOverride,
        showActiveEffectsMarker: currentSettings.showActiveEffectsMarker,
        useTotalSheetLock: currentSettings.useTotalSheetLock,
        lockExpChanges: currentSettings.lockExpChanges,
        lockHpMaxChanges: currentSettings.lockHpMaxChanges,
        lockConfigureSheet: currentSettings.lockConfigureSheet,
        lockMoneyChanges: currentSettings.lockMoneyChanges,
        lockLevelSelector: currentSettings.lockLevelSelector,
        lockItemQuantity: currentSettings.lockItemQuantity,
        initialNpcSheetTab: currentSettings.initialNpcSheetTab,
        useNpcRest: currentSettings.useNpcRest,
        showNpcRestInChat: currentSettings.showNpcRestInChat,
        showNpcActorLinkMarker: currentSettings.showNpcActorLinkMarker,
        initialCharacterSheetTab: currentSettings.initialCharacterSheetTab,
        initialVehicleSheetTab: currentSettings.initialVehicleSheetTab,
        itemIdentificationPermission:
          currentSettings.itemIdentificationPermission,
        includeFlagsInSpellScrollCreation:
          currentSettings.includeFlagsInSpellScrollCreation,
      },
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

    debug('World Settings context data', data);

    return new WorldSettings({
      target: node,
      context: new Map<any, any>([
        ['context', writable(data) satisfies WorldSettingsContextStore],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
            apply: this.applyChangedSettings.bind(this),
            resetDefaultTabs: this.resetDefaultTabs.bind(this),
          } satisfies WorldSettingsFunctions,
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

  validate(context: WorldSettingsContext) {
    let valid = true;

    if (
      context.defaultCharacterTabs.selected.length === 0 ||
      context.defaultNpcTabs.selected.length === 0 ||
      context.defaultVehicleTabs.selected.length === 0
    ) {
      valid = false;
      error(
        FoundryAdapter.localize(
          'TIDY5E.Settings.DefaultSheetTabs.AtLeastOneTabRequiredErrorMessage'
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
          'TIDY5E.WorldSettings.Exhaustion.AtLeastOneLevelRequiredErrorMessage'
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
          'TIDY5E.WorldSettings.VehicleExhaustion.AtLeastOneLevelRequiredErrorMessage'
        ),
        true
      );
    }

    // Add more data validation here as needed

    return valid;
  }

  async applyChangedSettings(context: WorldSettingsContext) {
    if (!this.validate(context)) {
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

    const newSettings: Partial<CurrentSettings> = {
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

    const currentSettings = getCurrentSettings();

    const keys = Object.keys(newSettings) as Tidy5eSettingKey[];
    for (let key of keys) {
      const currentValue = currentSettings[key];
      const newValue = newSettings[key];
      if (currentValue !== newValue) {
        await FoundryAdapter.setTidySetting(key, newValue);
        debug(`Updated ${key} to ${newValue}`);
      }
    }

    return true;
  }

  async saveChangedSettings(context: WorldSettingsContext) {
    const changesApplied = await this.applyChangedSettings(context);

    if (!changesApplied) {
      return;
    }

    this.close();
  }

  resetDefaultTabs(store: WorldSettingsContextStore, actorType: string) {
    switch (actorType) {
      case CONSTANTS.SHEET_TYPE_CHARACTER:
        store.update((context) => {
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
        store.update((context) => {
          context.defaultNpcTabs = this.mapTabSelectionFields(
            NpcSheetRuntime.getAllRegisteredTabs(),
            [...SettingsProvider.settings.defaultNpcSheetTabs.options.default]
          );
          return context;
        });
        break;
      case CONSTANTS.SHEET_TYPE_VEHICLE:
        store.update((context) => {
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
