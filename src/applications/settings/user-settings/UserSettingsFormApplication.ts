import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent, mount } from 'svelte';
import { writable } from 'svelte/store';
import {
  getCurrentSettings,
  type CurrentSettings,
  type Tidy5eSettingKey,
} from 'src/settings/settings';
import { debug } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import UserSettings from './UserSettings.svelte';
import type {
  UserSettingsContext,
  UserSettingsFunctions,
  UserSettingsStore,
} from './UserSettings.types';

export class UserSettingsFormApplication extends SvelteFormApplicationBase {
  initialTabId: string;

  constructor(initialTabId: string, ...args: any[]) {
    super(...args);
    this.initialTabId = initialTabId ?? CONSTANTS.TAB_USER_SETTINGS_PLAYERS;
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      width: 750,
      classes: [
        ...super.defaultOptions.classes,
        'settings',
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      id: 'tidy-5e-sheets-user-settings',
      popOut: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.UserSettings.Menu.title', {
      userName: game.user.name,
    });
  }

  getData(): UserSettingsContext {
    const currentSettings = getCurrentSettings();

    return {
      settings: {
        actionListIncludeConsumables:
          currentSettings.actionListIncludeConsumables,
        actionListIncludeMinuteLongSpellsAsActions:
          currentSettings.actionListIncludeMinuteLongSpellsAsActions,
        actionListIncludeSpellsWithActiveEffects:
          currentSettings.actionListIncludeSpellsWithActiveEffects,
        actionListLimitActionsToCantrips:
          currentSettings.actionListLimitActionsToCantrips,
        alwaysShowNpcSkills: currentSettings.alwaysShowNpcSkills,
        alwaysShowNpcTraits: currentSettings.alwaysShowNpcTraits,
        animateInspiration: currentSettings.animateInspiration,
        hideIfZero: currentSettings.hideIfZero,
        moveTraitsBelowCharacterResources:
          currentSettings.moveTraitsBelowCharacterResources,
        moveTraitsBelowNpcResources:
          currentSettings.moveTraitsBelowNpcResources,
        showClassList: currentSettings.showClassList,
        showEquippedAmmoOnly: currentSettings.showEquippedAmmoOnly,
        showExhaustionOnHover: currentSettings.showExhaustionOnHover,
        showIconsNextToTheItemName: currentSettings.showIconsNextToTheItemName,
        showInspirationOnHover: currentSettings.showInspirationOnHover,
        showSpellbookTabNpc: currentSettings.showSpellbookTabNpc,
        toggleEmptyCharacterSkills: currentSettings.toggleEmptyCharacterSkills,
        toggleEmptyCharacterTraits: currentSettings.toggleEmptyCharacterTraits,
        useClassicControlsForCharacter:
          currentSettings.useClassicControlsForCharacter,
        useClassicControlsForNpc: currentSettings.useClassicControlsForNpc,
        useClassicControlsForVehicle:
          currentSettings.useClassicControlsForVehicle,
        useContextMenu: currentSettings.useContextMenu,
        useHpBar: currentSettings.useHpBar,
        useHpBarNpc: currentSettings.useHpBarNpc,
        useHpBarVehicle: currentSettings.useHpBarVehicle,
        useHpOverlay: currentSettings.useHpOverlay,
        useHpOverlayNpc: currentSettings.useHpOverlayNpc,
        useHpOverlayVehicle: currentSettings.useHpOverlayVehicle,
        useMulticlassSpellbookFilter:
          currentSettings.useMulticlassSpellbookFilter,
        useSpellClassFilterIcons: currentSettings.useSpellClassFilterIcons,
      },
    };
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    const data = this.getData();

    debug('Sheet Settings context data', data);

    return mount(UserSettings, {
      target: node,
      context: new Map<any, any>([
        ['context', writable(data) satisfies UserSettingsStore],
        [
          'functions',
          {
            save: this.saveChangedSettings.bind(this),
            apply: this.applyChangedSettings.bind(this),
            validate: this.validate.bind(this),
          } satisfies UserSettingsFunctions,
        ],
        ['appId', this.appId],
        ['initialTabId', this.initialTabId],
      ]),
    });
  }

  validate(context: UserSettingsContext) {
    let valid = true;

    // Add data validation here as needed
    // if (somethingIsNotValid) {
    //   valid = false;
    //   error(
    //     FoundryAdapter.localize(
    //       'Some.ValidationRule.Violation.Key.Here'
    //     ),
    //     true
    //   );
    // }

    return valid;
  }

  async applyChangedSettings(context: UserSettingsContext) {
    if (!this.validate(context)) {
      return false;
    }

    const newSettings: Partial<CurrentSettings> = {
      ...context.settings,
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

  async saveChangedSettings(context: UserSettingsContext) {
    const changesApplied = await this.applyChangedSettings(context);

    if (!changesApplied) {
      return;
    }

    this.close();
  }
}
