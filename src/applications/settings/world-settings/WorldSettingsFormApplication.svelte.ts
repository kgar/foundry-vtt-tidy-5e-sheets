import { mount } from 'svelte';
import WorldSettings from './WorldSettings.svelte';
import {
  SettingsProvider,
  getCurrentSettings,
  type Tidy5eSettingKey,
  type CurrentSettings,
} from 'src/settings/settings.svelte';
import type {
  DefaultTabSelectionFields,
  WorldSettingsContext,
  WorldSettingsFunctions,
} from './WorldSettings.types';
import type { RegisteredTab } from 'src/runtime/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TabManager } from 'src/runtime/tab/TabManager';
import { debug, error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { applyThemeToApplication } from 'src/utils/applications.svelte';

export class WorldSettingsFormApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  WorldSettingsContext
>(foundry.applications.api.ApplicationV2) {
  unchangedSettings?: CurrentSettings;
  context = $state<WorldSettingsContext>();

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'settings',
      'application',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    id: 'tidy5e-sheet-world-settings',
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.WorldSettings.Menu.title',
    },
    position: {
      width: 750,
      height: 750,
    },
    actions: {},
    submitOnClose: false,
  };

  async _prepareContext() {
    const currentSettings = getCurrentSettings();

    return {
      settings: {
        hideDeathSavesFromPlayers: currentSettings.hideDeathSavesFromPlayers,
        defaultDeathSaveRoll: currentSettings.defaultDeathSaveRoll,
        useCharacterEncumbranceBar: currentSettings.useCharacterEncumbranceBar,
        useNpcEncumbranceBar: currentSettings.useNpcEncumbranceBar,
        useVehicleEncumbranceBar: currentSettings.useVehicleEncumbranceBar,
        showPlayerName: currentSettings.showPlayerName,
        showExpandedLimitedView: currentSettings.showExpandedLimitedView,
        itemCardsFixKey: currentSettings.itemCardsFixKey,
        useCircularPortraitStyle: currentSettings.useCircularPortraitStyle,
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
        lockMoneyChanges: currentSettings.lockMoneyChanges,
        lockLevelSelector: currentSettings.lockLevelSelector,
        lockItemQuantity: currentSettings.lockItemQuantity,
        showNpcRestInChat: currentSettings.showNpcRestInChat,
        showNpcActorLinkMarker: currentSettings.showNpcActorLinkMarker,
        itemIdentificationPermission:
          currentSettings.itemIdentificationPermission,
        includeFlagsInSpellScrollCreation:
          currentSettings.includeFlagsInSpellScrollCreation,
        useTidySpellSchoolIcons: currentSettings.useTidySpellSchoolIcons,
        globalCustomSections: currentSettings.globalCustomSections,
      },
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

  _createComponent(node: HTMLElement): Record<string, any> {
    // This is a temporary fix for reactivity issues surrounding the coarse reactivity provider.
    this.context = this._context.data;

    return mount(WorldSettings, {
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
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

  async applyChangedSettings() {
    if (!this.context || !this.validate(this.context)) {
      return false;
    }

    if (this.context.exhaustionConfig.type === 'specific') {
      this.context.exhaustionConfig.hints =
        this.context.exhaustionConfig.hints.slice(
          0,
          this.context.exhaustionConfig.levels + 1
        );
    }

    if (this.context.vehicleExhaustionConfig.type === 'specific') {
      this.context.vehicleExhaustionConfig.hints =
        this.context.vehicleExhaustionConfig.hints.slice(
          0,
          this.context.vehicleExhaustionConfig.levels + 1
        );
    }

    const newSettings: Partial<CurrentSettings> = {
      ...this.context.settings,
      exhaustionConfig: this.context.exhaustionConfig,
      vehicleExhaustionConfig: this.context.vehicleExhaustionConfig,
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

  async saveChangedSettings() {
    const changesApplied = await this.applyChangedSettings();

    if (!changesApplied) {
      return;
    }

    this.close();
  }

  // Not going to refactor this because this application is living on borrowed time
  _attachFrameListeners() {
    super._attachFrameListeners();

    applyThemeToApplication(this.element);
  }
}
