import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { mount } from 'svelte';
import {
  getCurrentSettings,
  type CurrentSettings,
  type Tidy5eSettingKey,
} from 'src/settings/settings.svelte';
import { debug } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import UserSettings from './UserSettings.svelte';
import type {
  UserSettingsContext,
  UserSettingsFunctions,
} from './UserSettings.types';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { applyThemeToApplication } from 'src/utils/applications.svelte';

export class UserSettingsFormApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  UserSettingsContext
>(foundry.applications.api.ApplicationV2) {
  initialTabId: string;
  context = $state<UserSettingsContext>();

  constructor(initialTabId: string, args?: Partial<ApplicationConfiguration>) {
    super(args);
    this.initialTabId = initialTabId ?? CONSTANTS.TAB_USER_SETTINGS_PLAYERS;
  }

  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'settings',
      'application',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    tag: 'div',
    id: 'tidy5e-sheet-user-settings',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: '',
    },
    position: {
      height: 750,
      width: 750,
    },
    actions: {},
    submitOnClose: false,
  };

  get title() {
    return FoundryAdapter.localize('TIDY5E.UserSettings.Menu.title', {
      userName: game.user.name,
    });
  }

  async _prepareContext() {
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
        animateInspiration: currentSettings.animateInspiration,
        hideIfZero: currentSettings.hideIfZero,
        inlineActivitiesPosition: currentSettings.inlineActivitiesPosition,
        moveCharacterTraitsToRightOfSkills:
          currentSettings.moveCharacterTraitsToRightOfSkills,
        moveNpcTraitsToRightOfSkills:
          currentSettings.moveNpcTraitsToRightOfSkills,
        showClassList: currentSettings.showClassList,
        showEquippedAmmoOnly: currentSettings.showEquippedAmmoOnly,
        showExhaustionOnHover: currentSettings.showExhaustionOnHover,
        showInspirationOnHover: currentSettings.showInspirationOnHover,
        showSpellbookTabNpc: currentSettings.showSpellbookTabNpc,
        toggleEmptyCharacterSkills: currentSettings.toggleEmptyCharacterSkills,
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
        useSpellClassFilterIcons: currentSettings.useSpellClassFilterIcons,
      },
    };
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    // Temporary fix due to strange reactivity issues with coarse reactivity provider
    this.context = this._context.data;

    return mount(UserSettings, {
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
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

  async applyChangedSettings() {
    if (!this.context) {
      return;
    }

    if (!this.validate(this.context)) {
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
