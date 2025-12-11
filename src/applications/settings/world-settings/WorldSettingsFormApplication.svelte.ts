import { mount } from 'svelte';
import WorldSettings from './WorldSettings.svelte';
import {
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
import { debug } from 'src/utils/logging';
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
        defaultDeathSaveRoll: currentSettings.defaultDeathSaveRoll,
        allowCantripsToBePrepared: currentSettings.allowCantripsToBePrepared,
        lockMoneyChanges: currentSettings.lockMoneyChanges,
        showNpcRestInChat: currentSettings.showNpcRestInChat,
        itemIdentificationPermission:
          currentSettings.itemIdentificationPermission,
        includeFlagsInSpellScrollCreation:
          currentSettings.includeFlagsInSpellScrollCreation,
        globalCustomSections: currentSettings.globalCustomSections,
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

  async applyChangedSettings() {
    if (!this.context || !this.validate(this.context)) {
      return false;
    }

    const newSettings: Partial<CurrentSettings> = {
      ...this.context.settings,
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
