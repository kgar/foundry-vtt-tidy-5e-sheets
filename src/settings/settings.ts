import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { ResetSettingsDialog } from './ResetSettingsDialog';
import type {
  GetFunctionReturnType,
  RoundedPortaitStyleOptions,
} from 'src/types/types';
import { applyTheme, getTheme } from 'src/theme/theme';
import { defaultLightTheme } from 'src/theme/default-light-theme';
import { getCoreThemes, themeVariables } from 'src/theme/theme-reference';
import { Tidy5eKgarSettingsSheet } from 'src/sheets/settings/sheet/Tidy5eKgarSettingsSheet';
import { Tidy5eKgarThemeSettingsSheet } from 'src/sheets/settings/theme/Tidy5eKgarThemeSettingsSheet';
import { writable, type Writable } from 'svelte/store';
import { debug } from 'src/utils/logging';

export type Tidy5eSettings = {
  [settingKey: string]: Tidy5eSetting;
};

export type Tidy5eSettingKey = keyof (typeof SettingsProvider)['settings'];

/**
 * A simple object-to-value mapping of all settings at a given point in time.
 */
export type CurrentSettings = {
  [K in Tidy5eSettingKey]: GetFunctionReturnType<
    (typeof SettingsProvider.settings)[K]
  >;
};

export function getCurrentSettings(): CurrentSettings {
  const keys = Object.keys(
    SettingsProvider.settings
  ) as (keyof (typeof SettingsProvider)['settings'])[];

  return keys.reduce<Record<string, any>>((obj, key) => {
    obj[key] = SettingsProvider.settings[key].get();
    return obj;
  }, {}) as CurrentSettings;
}

export type Tidy5eSetting = {
  options: {
    /**
     * The human-readable name
     */
    name: string;
    /**
     * An additional human readable hint
     */
    hint?: string;
    /**
     * The scope the Setting is stored in, either World or Client
     */
    scope: 'world' | 'client';
    /**
     * Indicates if this Setting should render in the Config application
     */
    config: boolean;
    /**
     * The JS Type that the Setting is storing
     */
    type: any;
    /**
     * For string Types, defines the allowable values
     */
    choices?: any;
    /**
     * For numeric Types, defines the allowable range
     */
    range?: {
      min: number;
      max: number;
      step: number;
    };
    /**
     * The default value
     */
    default: any;
    /**
     * Executes when the value of this Setting changes
     * @param data the new value
     */
    onChange?: (data: any) => void;
  };
  get: () => any;
  /**
   * Denotes which CSS Variable is represented by the target setting. Used for color picking.
   */
  representsCssVariable?: keyof typeof themeVariables;
};

/**
 * The current Tidy 5e settings.
 */
export let settingStore: Writable<CurrentSettings>;

export function createSettings() {
  return {
    menus: {
      userMenu: {
        options: {
          name: `T5EK.Settings.SheetMenu.name`,
          label: 'T5EK.Settings.SheetMenu.label',
          hint: `T5EK.Settings.SheetMenu.hint`,
          icon: 'fas fa-cog',
          type: Tidy5eKgarSettingsSheet,
          restricted: false,
        },
      },
      theme: {
        options: {
          name: `T5EK.ThemeSettings.SheetMenu.name`,
          label: 'T5EK.ThemeSettings.SheetMenu.buttonLabel',
          hint: `T5EK.ThemeSettings.SheetMenu.hint`,
          icon: 'fas fa-palette',
          type: Tidy5eKgarThemeSettingsSheet,
          restricted: false,
        },
      },
      resetAllSettings: {
        options: {
          name: `T5EK.Settings.Reset.name`,
          hint: `T5EK.Settings.Reset.hint`,
          icon: 'fas fa-database',
          type: ResetSettingsDialog,
          restricted: true,
        },
      },
    },
    settings: {
      defaultTheme: {
        options: {
          name: 'T5EK.Settings.DefaultTheme.name',
          hint: 'T5EK.Settings.DefaultTheme.hint',
          scope: 'world',
          config: true,
          type: String,
          choices: () => getCoreThemes(false),
          default: CONSTANTS.THEME_ID_DEFAULT_LIGHT,
          onChange: (data: string) => {
            const theme = getTheme(data) ?? null;

            const colorScheme = SettingsProvider.settings.colorScheme.get();

            if (theme && colorScheme === CONSTANTS.THEME_ID_DEFAULT) {
              applyTheme(theme);
            }
          },
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('defaultTheme');
        },
      },
      // Color Theme
      colorScheme: {
        options: {
          name: 'T5EK.Settings.SheetTheme.name',
          hint: 'T5EK.Settings.SheetTheme.hint',
          scope: 'client',
          config: true,
          type: String,
          choices: () => getCoreThemes(true),
          default: CONSTANTS.THEME_ID_DEFAULT,
          onChange: (
            data: string,
            colorPickerEnabledOverride: boolean | null = null
          ) => {
            const theme = getTheme(data) ?? null;

            if (theme === null) {
              const defaultThemeId =
                SettingsProvider.settings.defaultTheme.get();

              const defaultTheme = getTheme(defaultThemeId) ?? null;

              defaultTheme &&
                applyTheme(defaultTheme, colorPickerEnabledOverride);
            } else {
              applyTheme(theme, colorPickerEnabledOverride);
            }
          },
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorScheme');
        },
      },

      // Disable Right Click
      rightClickDisabled: {
        options: {
          name: 'T5EK.Settings.RightClickDisabled.name',
          hint: 'T5EK.Settings.RightClickDisabled.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('rightClickDisabled');
        },
      },

      // Classic Item Controls
      classicControlsEnabled: {
        options: {
          name: 'T5EK.Settings.ClassicControls.name',
          hint: 'T5EK.Settings.ClassicControls.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'classicControlsEnabled'
          );
        },
      },

      hideIconsNextToTheItemName: {
        options: {
          name: 'T5EK.Settings.HideIconsNextToTheItemName.name',
          hint: 'T5EK.Settings.HideIconsNextToTheItemName.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hideIconsNextToTheItemName'
          );
        },
      },

      // Item Info Cards
      itemCardsForAllItems: {
        options: {
          name: 'T5EK.Settings.ItemCardsForAllItems.name',
          hint: 'T5EK.Settings.ItemCardsForAllItems.hint',
          scope: 'client',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('itemCardsForAllItems');
        },
      },

      itemCardsForNpcs: {
        options: {
          name: 'T5EK.Settings.ItemCardsForNpcs.name',
          hint: 'T5EK.Settings.ItemCardsForNpcs.hint',
          scope: 'world',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('itemCardsForNpcs');
        },
      },

      itemCardsAreFloating: {
        options: {
          name: 'T5EK.Settings.ItemCardsAreFloating.name',
          hint: 'T5EK.Settings.ItemCardsAreFloating.hint',
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('itemCardsAreFloating');
        },
      },

      itemCardsDelay: {
        options: {
          name: 'T5EK.Settings.ItemCardsDelay.name',
          hint: 'T5EK.Settings.ItemCardsDelay.hint',
          scope: 'client',
          config: true,
          default: 300,
          type: Number,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('itemCardsDelay');
        },
      },

      itemCardsFixKey: {
        options: {
          name: 'T5EK.Settings.ItemCardsFixKey.name',
          hint: 'T5EK.Settings.ItemCardsFixKey.hint',
          scope: 'world',
          config: false,
          default: 'x',
          type: String,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('itemCardsFixKey');
        },
      },

      // Show Roll buttons in context Menu
      contextRollButtons: {
        options: {
          name: 'T5EK.Settings.RollButtonsToCard.name',
          hint: 'T5EK.Settings.RollButtonsToCard.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('contextRollButtons');
        },
      },

      //Show trait labels
      traitLabelsEnabled: {
        options: {
          name: 'T5EK.Settings.TraitLabels.name',
          hint: 'T5EK.Settings.TraitLabels.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('traitLabelsEnabled');
        },
      },

      // Settings Menu

      // PC Sheet Settings
      journalTabDisabled: {
        options: {
          name: 'T5EK.Settings.JournalTab.name',
          hint: 'T5EK.Settings.JournalTab.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('journalTabDisabled');
        },
      },

      journalTabNPCDisabled: {
        options: {
          name: 'T5EK.Settings.JournalTabNPCDisabled.name',
          hint: 'T5EK.Settings.JournalTabNPCDisabled.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'journalTabNPCDisabled'
          );
        },
      },

      classListDisabled: {
        options: {
          name: 'T5EK.Settings.ClassList.name',
          hint: 'T5EK.Settings.ClassList.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('classListDisabled');
        },
      },

      inspirationAnimationDisabled: {
        options: {
          name: 'T5EK.Settings.InspirationAnimation.name',
          hint: 'T5EK.Settings.InspirationAnimation.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'inspirationAnimationDisabled'
          );
        },
      },

      hideIfZero: {
        options: {
          name: 'T5EK.Settings.HideIfZero.name',
          hint: 'T5EK.Settings.HideIfZero.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hideIfZero');
        },
      },

      inspirationOnHover: {
        options: {
          name: 'T5EK.Settings.InspirationOnHover.name',
          hint: 'T5EK.Settings.InspirationOnHover.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('inspirationOnHover');
        },
      },

      exhaustionOnHover: {
        options: {
          name: 'T5EK.Settings.ExhaustionOnHover.name',
          hint: 'T5EK.Settings.ExhaustionOnHover.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('exhaustionOnHover');
        },
      },

      hpBarDisabled: {
        options: {
          name: 'T5EK.Settings.HpBar.name',
          hint: 'T5EK.Settings.HpBar.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpBarDisabled');
        },
      },

      hpOverlayDisabled: {
        options: {
          name: 'T5EK.Settings.HpOverlay.name',
          hint: 'T5EK.Settings.HpOverlay.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpOverlayDisabled');
        },
      },

      traitsTogglePc: {
        options: {
          name: 'T5EK.Settings.TraitsTogglePc.name',
          hint: 'T5EK.Settings.TraitsTogglePc.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('traitsTogglePc');
        },
      },

      traitsMovedBelowResource: {
        options: {
          name: 'T5EK.Settings.TraitsMovedBelowResource.name',
          hint: 'T5EK.Settings.TraitsMovedBelowResource.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'traitsMovedBelowResource'
          );
        },
      },

      ammoEquippedOnly: {
        options: {
          name: 'T5EK.Settings.AmmoEquippedOnly.name',
          hint: 'T5EK.Settings.AmmoEquippedOnly.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('ammoEquippedOnly');
        },
      },

      // NPC Sheet Settings

      traitsMovedBelowResourceNpc: {
        options: {
          name: 'T5EK.Settings.TraitsMovedBelowResource.name',
          hint: 'T5EK.Settings.TraitsMovedBelowResource.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'traitsMovedBelowResourceNpc'
          );
        },
      },

      hpBarDisabledNpc: {
        options: {
          name: 'T5EK.Settings.HpBar.name',
          hint: 'T5EK.Settings.HpBar.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpBarDisabledNpc');
        },
      },

      hpOverlayDisabledNpc: {
        options: {
          name: 'T5EK.Settings.HpOverlay.name',
          hint: 'T5EK.Settings.HpOverlay.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpOverlayDisabledNpc');
        },
      },

      traitsAlwaysShownNpc: {
        options: {
          name: 'T5EK.Settings.TraitsAlwaysShown.name',
          hint: 'T5EK.Settings.TraitsAlwaysShown.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('traitsAlwaysShownNpc');
        },
      },

      skillsAlwaysShownNpc: {
        options: {
          name: 'T5EK.Settings.SkillsAlwaysShown.name',
          hint: 'T5EK.Settings.SkillsAlwaysShown.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('skillsAlwaysShownNpc');
        },
      },

      hideSpellbookTabNpc: {
        options: {
          name: 'T5EK.Settings.SkillsAlwaysShown.name',
          hint: 'T5EK.Settings.SkillsAlwaysShown.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hideSpellbookTabNpc');
        },
      },

      // Vehicle Sheet Settings

      hpBarDisabledVehicle: {
        options: {
          name: 'T5EK.Settings.HpBar.name',
          hint: 'T5EK.Settings.HpBar.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpBarDisabledVehicle');
        },
      },

      hpOverlayDisabledVehicle: {
        options: {
          name: 'T5EK.Settings.HpOverlay.name',
          hint: 'T5EK.Settings.HpOverlay.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hpOverlayDisabledVehicle'
          );
        },
      },

      //
      // GM Options
      //
      // Show Player Name
      playerNameEnabled: {
        options: {
          name: 'T5EK.Settings.PlayerName.name',
          hint: 'T5EK.Settings.PlayerName.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('playerNameEnabled');
        },
      },

      // Expanded Sheet
      expandedSheetEnabled: {
        options: {
          name: 'T5EK.Settings.ExpandedSheet.name',
          hint: 'T5EK.Settings.ExpandedSheet.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('expandedSheetEnabled');
        },
      },

      // Portrait Settings
      // Portrait Style
      portraitStyle: {
        options: {
          name: 'T5EK.Settings.PortraitStyle.name',
          hint: 'T5EK.Settings.PortraitStyle.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: 'T5EK.Settings.PortraitStyle.default',
            pc: 'T5EK.Settings.PortraitStyle.pc',
            npc: 'T5EK.Settings.PortraitStyle.npc',
            all: 'T5EK.Settings.PortraitStyle.all',
          },
          default: 'all',
        },
        get(): RoundedPortaitStyleOptions {
          return FoundryAdapter.getGameSetting<RoundedPortaitStyleOptions>(
            'portraitStyle'
          );
        },
      },

      // Total Edit Lock
      editTotalLockEnabled: {
        options: {
          name: 'T5EK.Settings.EditTotalLock.name',
          hint: 'T5EK.Settings.EditTotalLock.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('editTotalLockEnabled');
        },
      },

      editGmAlwaysEnabled: {
        options: {
          name: 'T5EK.Settings.EditGmAlways.name',
          hint: 'T5EK.Settings.EditGmAlways.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('editGmAlwaysEnabled');
        },
      },

      editEffectsGmOnlyEnabled: {
        options: {
          name: 'T5EK.Settings.EditEffectsGmOnly.name',
          hint: 'T5EK.Settings.EditEffectsGmOnly.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'editEffectsGmOnlyEnabled'
          );
        },
      },

      // Hidden Death Saves
      hiddenDeathSavesEnabled: {
        options: {
          name: 'T5EK.Settings.HiddenDeathSaves.name',
          hint: 'T5EK.Settings.HiddenDeathSaves.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hiddenDeathSavesEnabled'
          );
        },
      },

      // Hide marker spell slot
      hideSpellSlotMarker: {
        options: {
          name: 'T5EK.Settings.HideSpellSlotMarker.name',
          hint: 'T5EK.Settings.HideSpellSlotMarker.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hideSpellSlotMarker');
        },
      },

      // Enable Spell Level Buttons
      enableSpellLevelButtons: {
        options: {
          name: 'T5EK.Settings.EnableSpellLevelButtons.name',
          hint: 'T5EK.Settings.EnableSpellLevelButtons.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enableSpellLevelButtons'
          );
        },
      },

      // Hide Standard Encumbrance Bar
      hideStandardEncumbranceBar: {
        options: {
          name: 'T5EK.Settings.HideStandardEncumbranceBar.name',
          hint: 'T5EK.Settings.HideStandardEncumbranceBar.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hideStandardEncumbranceBar'
          );
        },
      },

      // Item quantity
      quantityAlwaysShownEnabled: {
        options: {
          name: 'T5EK.Settings.QuantityAlwaysShown.name',
          hint: 'T5EK.Settings.QuantityAlwaysShown.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'quantityAlwaysShownEnabled'
          );
        },
      },

      // Tracker Settings
      exhaustionEffectsEnabled: {
        options: {
          name: 'T5EK.Settings.ExhaustionEffects.name',
          hint: 'T5EK.Settings.ExhaustionEffects.hint',
          scope: 'world',
          config: false,
          choices: {
            default: 'T5EK.Settings.ExhaustionEffects.default',
            tidy5e: 'T5EK.Settings.ExhaustionEffects.default',
            dfredce: 'T5EK.Settings.ExhaustionEffects.dfredce',
            cub: 'T5EK.Settings.ExhaustionEffects.cub',
          },
          type: String,
          default: 'default',
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'exhaustionEffectsEnabled'
          );
        },
      },

      exhaustionEffectIcon: {
        options: {
          name: 'T5EK.Settings.CustomExhaustionIcon.name',
          hint: 'T5EK.Settings.CustomExhaustionIcon.hint',
          scope: 'world',
          config: false,
          type: String,
          default: `modules/${CONSTANTS.MODULE_ID}/images/exhaustion.svg`,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('exhaustionEffectIcon');
        },
      },

      exhaustionEffectCustom: {
        options: {
          name: 'T5EK.Settings.CustomExhaustionEffect.name',
          hint: 'T5EK.Settings.CustomExhaustionEffect.hint',
          scope: 'world',
          config: false,
          default: 'Exhaustion',
          type: String,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'exhaustionEffectCustom'
          );
        },
      },

      exhaustionEffectCustomTiers: {
        options: {
          name: 'T5EK.Settings.CustomExhaustionEffect.tiers',
          hint: 'T5EK.Settings.CustomExhaustionEffect.hint',
          scope: 'world',
          config: false,
          default: 5,
          type: Number,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>(
            'exhaustionEffectCustomTiers'
          );
        },
      },

      exhaustionDisabled: {
        options: {
          name: 'T5EK.Settings.ExhaustionDisabled.name',
          hint: 'T5EK.Settings.ExhaustionDisabled.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('exhaustionDisabled');
        },
      },

      inspirationDisabled: {
        options: {
          name: 'T5EK.Settings.InspirationDisabled.name',
          hint: 'T5EK.Settings.InspirationDisabled.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('inspirationDisabled');
        },
      },

      vehicleMotionDisabled: {
        options: {
          name: 'T5EK.Settings.VehicleMotionDisabled.name',
          hint: 'T5EK.Settings.VehicleMotionDisabled.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'vehicleMotionDisabled'
          );
        },
      },

      // NPC Resting
      restingForNpcsEnabled: {
        options: {
          name: 'T5EK.Settings.RestingForNpcs.name',
          hint: 'T5EK.Settings.RestingForNpcs.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'restingForNpcsEnabled'
          );
        },
      },

      restingForNpcsChatDisabled: {
        options: {
          name: 'T5EK.Settings.RestingForNpcsChat.name',
          hint: 'T5EK.Settings.RestingForNpcsChat.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'restingForNpcsChatDisabled'
          );
        },
      },

      // Link Marker
      linkMarkerNpc: {
        options: {
          name: 'T5EK.Settings.LinkMarker.name',
          hint: 'T5EK.Settings.LinkMarker.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: 'T5EK.Settings.LinkMarker.default',
            unlinked: 'T5EK.Settings.LinkMarker.unlinked',
            both: 'T5EK.Settings.LinkMarker.both',
          },
          default: 'default',
        },
        get() {
          return FoundryAdapter.getGameSetting<'default' | 'unlinked' | 'both'>(
            'linkMarkerNpc'
          );
        },
      },

      // Show if item has active effects
      activeEffectsMarker: {
        options: {
          name: 'T5EK.Settings.ActiveEffectsMarker.name',
          hint: 'T5EK.Settings.ActiveEffectsMarker.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('activeEffectsMarker');
        },
      },

      // Set default Tab for character actions list

      enableActionListOnFavoritePanel: {
        options: {
          name: 'T5EK.Settings.EnableActionListOnFavoritePanel.name',
          hint: 'T5EK.Settings.EnableActionListOnFavoritePanel.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enableActionListOnFavoritePanel'
          );
        },
      },

      defaultActionsTab: {
        options: {
          name: 'T5EK.Settings.defaultActionsTab.name',
          hint: 'T5EK.Settings.defaultActionsTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: 'T5EK.Settings.defaultActionsTab.default',
            attributes: 'T5EK.Settings.defaultActionsTab.attributes',
            inventory: 'T5EK.Settings.defaultActionsTab.inventory',
            spellbook: 'T5EK.Settings.defaultActionsTab.spellbook',
            features: 'T5EK.Settings.defaultActionsTab.features',
            effects: 'T5EK.Settings.defaultActionsTab.effects',
            biography: 'T5EK.Settings.defaultActionsTab.biography',
            journal: 'T5EK.Settings.defaultActionsTab.journal',
            actions: 'T5EK.Settings.defaultActionsTab.actions',
          },
          default: 'default',
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('defaultActionsTab');
        },
      },

      // Default width for player sheet

      playerSheetWidth: {
        options: {
          name: 'T5EK.Settings.playerSheetWidth',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('playerSheetWidth');
        },
      },

      // Default width for NPC sheet

      npsSheetWidth: {
        options: {
          name: 'T5EK.Settings.npsSheetWidth',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('npsSheetWidth');
        },
      },

      enablePermanentUnlockOnNPCIfYouAreGM: {
        options: {
          name: 'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.name',
          hint: 'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enablePermanentUnlockOnNPCIfYouAreGM'
          );
        },
      },

      // Default width for vehicle sheet

      vehicleSheetWidth: {
        options: {
          name: 'T5EK.Settings.vehicleSheetWidth',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('vehicleSheetWidth');
        },
      },

      enablePermanentUnlockOnVehicleIfYouAreGM: {
        options: {
          name: 'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.name',
          hint: 'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enablePermanentUnlockOnVehicleIfYouAreGM'
          );
        },
      },

      // Favorites

      enableSortFavoritesItemsAlphabetically: {
        options: {
          name: 'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.name',
          hint: 'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enableSortFavoritesItemsAlphabetically'
          );
        },
      },

      // Locks

      lockMoneyChanges: {
        options: {
          name: 'T5EK.Settings.LockMoneyChanges.name',
          hint: 'T5EK.Settings.LockMoneyChanges.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockMoneyChanges');
        },
      },

      lockExpChanges: {
        options: {
          name: 'T5EK.Settings.LockExpChanges.name',
          hint: 'T5EK.Settings.LockExpChanges.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockExpChanges');
        },
      },

      lockHpMaxChanges: {
        options: {
          name: 'T5EK.Settings.LockHpMaxChanges.name',
          hint: 'T5EK.Settings.LockHpMaxChanges.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockHpMaxChanges');
        },
      },

      lockLevelSelector: {
        options: {
          name: 'T5EK.Settings.LockLevelSelector.name',
          hint: 'T5EK.Settings.LockLevelSelector.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockLevelSelector');
        },
      },

      lockConfigureSheet: {
        options: {
          name: 'T5EK.Settings.LockConfigureSheet.name',
          hint: 'T5EK.Settings.LockConfigureSheet.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockConfigureSheet');
        },
      },

      lockItemQuantity: {
        options: {
          name: 'T5EK.Settings.LockItemQuantity.name',
          hint: 'T5EK.Settings.LockItemQuantity.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockItemQuantity');
        },
      },

      // Other

      allowCantripToBePreparedOnContext: {
        options: {
          name: 'T5EK.Settings.AllowCantripToBePreparedOnContext.name',
          hint: 'T5EK.Settings.AllowCantripToBePreparedOnContext.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'allowCantripToBePreparedOnContext'
          );
        },
      },

      spellClassFilterSelect: {
        options: {
          name: 'T5EK.Settings.SpellClassFilterSelect.name',
          hint: 'T5EK.Settings.SpellClassFilterSelect.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'spellClassFilterSelect'
          );
        },
      },

      spellClassFilterIconReplace: {
        options: {
          name: 'T5EK.Settings.SpellClassFilterIconReplace.name',
          hint: 'T5EK.Settings.SpellClassFilterIconReplace.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'spellClassFilterIconReplace'
          );
        },
      },

      spellClassFilterAdditionalClasses: {
        options: {
          name: 'T5EK.Settings.SpellClassFilterAdditionalClasses.name',
          hint: 'T5EK.Settings.SpellClassFilterAdditionalClasses.hint',
          scope: 'client',
          config: false,
          default: '',
          type: String,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'spellClassFilterAdditionalClasses'
          );
        },
      },

      allowHpMaxOverride: {
        options: {
          name: 'T5EK.Settings.AllowHpMaxOverride.name',
          hint: 'T5EK.Settings.AllowHpMaxOverride.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('allowHpMaxOverride');
        },
      },

      allowHpConfigOverride: {
        options: {
          name: 'T5EK.Settings.AllowHpConfigOverride.name',
          hint: 'T5EK.Settings.AllowHpConfigOverride.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'allowHpConfigOverride'
          );
        },
      },

      betterAttackDialog: {
        options: {
          name: 'T5EK.Settings.BetterAttackDialog.name',
          hint: 'T5EK.Settings.BetterAttackDialog.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
          // TODO: Suspected to be dead feature.
          // onChange: (newValue) => {
          // const style = `<style id="tidy5e-better-attack">
          // .dialog-button.default.advantage {
          // border: 2px groove green !important;
          // }
          // .dialog-button.default.disadvantage {
          // border: 2px groove red !important;
          // }
          // </style>`;
          // const styleElement = $('#tidy5e-sheet-better-attack');
          // if (styleElement.length == 0 && newValue) {
          //   $('body').append(style);
          // } else if (styleElement.length != 0 && !newValue) {
          //   styleElement.remove();
          // }
          // },
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('betterAttackDialog');
        },
      },

      // Color customization

      colorPickerEnabled: {
        options: {
          name: 'T5EK.Settings.ColorPickerEnabled.name',
          hint: 'T5EK.Settings.ColorPickerEnabled.hint',
          scope: 'client',
          type: Boolean,
          default: false,
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('colorPickerEnabled');
        },
      },

      colorPickerPrimaryAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerPrimaryAccent.name',
          hint: 'T5EK.Settings.ColorPickerPrimaryAccent.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-primary-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPrimaryAccent'
          );
        },
        representsCssVariable: '--t5ek-primary-accent-color',
      },
      colorPickerEquipped: {
        options: {
          name: 'T5EK.Settings.ColorPickerEquipped.name',
          hint: 'T5EK.Settings.ColorPickerEquipped.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-equipped-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerEquipped');
        },
        representsCssVariable: '--t5ek-equipped-background',
      },
      colorPickerEquippedOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerEquippedOutline.name',
          hint: 'T5EK.Settings.ColorPickerEquippedOutline.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-equipped-item-grid-tile-outline-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerEquippedOutline'
          );
        },
        representsCssVariable: '--t5ek-equipped-item-grid-tile-outline-color',
      },
      colorPickerEquippedAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerEquippedAccent.name',
          hint: 'T5EK.Settings.ColorPickerEquippedAccent.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-equipped-item-grid-tile-accent-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerEquippedAccent'
          );
        },
        representsCssVariable: '--t5ek-equipped-item-grid-tile-accent-color',
      },

      colorPickerPrepared: {
        options: {
          name: 'T5EK.Settings.ColorPickerPrepared.name',
          hint: 'T5EK.Settings.ColorPickerPrepared.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-prepared-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerPrepared');
        },
        representsCssVariable: '--t5ek-prepared-background',
      },
      colorPickerPreparedOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerPreparedOutline.name',
          hint: 'T5EK.Settings.ColorPickerPreparedOutline.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-prepared-item-grid-tile-outline-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPreparedOutline'
          );
        },
        representsCssVariable: '--t5ek-prepared-item-grid-tile-outline-color',
      },
      colorPickerPreparedAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerPreparedAccent.name',
          hint: 'T5EK.Settings.ColorPickerPreparedAccent.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-prepared-item-grid-tile-accent-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPreparedAccent'
          );
        },
        representsCssVariable: '--t5ek-prepared-item-grid-tile-accent-color',
      },

      colorPickerPact: {
        options: {
          name: 'T5EK.Settings.ColorPickerPact.name',
          hint: 'T5EK.Settings.ColorPickerPact.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-pact-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerPact');
        },
        representsCssVariable: '--t5ek-pact-background',
      },
      colorPickerPactOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerPactOutline.name',
          hint: 'T5EK.Settings.ColorPickerPactOutline.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-pact-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPactOutline'
          );
        },
        representsCssVariable: '--t5ek-pact-outline-color',
      },
      colorPickerPactAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerPactAccent.name',
          hint: 'T5EK.Settings.ColorPickerPactAccent.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-pact-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerPactAccent');
        },
        representsCssVariable: '--t5ek-pact-accent-color',
      },

      colorPickerAtWill: {
        options: {
          name: 'T5EK.Settings.ColorPickerAtWill.name',
          hint: 'T5EK.Settings.ColorPickerAtWill.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-atwill-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerAtWill');
        },
        representsCssVariable: '--t5ek-atwill-background',
      },
      colorPickerAtWillOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerAtWillOutline.name',
          hint: 'T5EK.Settings.ColorPickerAtWillOutline.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-atwill-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAtWillOutline'
          );
        },
        representsCssVariable: '--t5ek-atwill-outline-color',
      },
      colorPickerAtWillAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerAtWillAccent.name',
          hint: 'T5EK.Settings.ColorPickerAtWillAccent.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-atwill-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAtWillAccent'
          );
        },
        representsCssVariable: '--t5ek-atwill-accent-color',
      },

      colorPickerInnate: {
        options: {
          name: 'T5EK.Settings.ColorPickerInnate.name',
          hint: 'T5EK.Settings.ColorPickerInnate.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-innate-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerInnate');
        },
        representsCssVariable: '--t5ek-innate-background',
      },
      colorPickerInnateOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerInnateOutline.name',
          hint: 'T5EK.Settings.ColorPickerInnateOutline.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-innate-outline'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerInnateOutline'
          );
        },
        representsCssVariable: '--t5ek-innate-outline',
      },
      colorPickerInnateAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerInnateAccent.name',
          hint: 'T5EK.Settings.ColorPickerInnateAccent.hint',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-innate-accent'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerInnateAccent'
          );
        },
        representsCssVariable: '--t5ek-innate-accent',
      },

      colorPickerAlwaysPrepared: {
        options: {
          name: 'T5EK.Settings.ColorPickerAlwaysPrepared.name',
          hint: 'T5EK.Settings.ColorPickerAlwaysPrepared.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5ek-alwaysprepared-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAlwaysPrepared'
          );
        },
        representsCssVariable: '--t5ek-alwaysprepared-background',
      },
      colorPickerAlwaysPreparedOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerAlwaysPreparedOutline.name',
          hint: 'T5EK.Settings.ColorPickerAlwaysPreparedOutline.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5ek-alwaysprepared-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAlwaysPreparedOutline'
          );
        },
        representsCssVariable: '--t5ek-alwaysprepared-outline-color',
      },
      colorPickerAlwaysPreparedAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerAlwaysPreparedAccent.name',
          hint: 'T5EK.Settings.ColorPickerAlwaysPreparedAccent.hint',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5ek-alwaysprepared-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAlwaysPreparedAccent'
          );
        },
        representsCssVariable: '--t5ek-alwaysprepared-accent-color',
      },

      // ===============================
      // Homebrew Rules
      // ===============================

      hbEnableUpcastFreeSpell: {
        options: {
          name: 'T5EK.Settings.HBEnableUpcastFreeSpell.name',
          hint: 'T5EK.Settings.HBEnableUpcastFreeSpell.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hbEnableUpcastFreeSpell'
          );
        },
      },

      hbSetFeaturesForUpcastFreeSpell: {
        options: {
          name: 'T5EK.Settings.HBSetFeaturesForUpcastFreeSpell.name',
          hint: 'T5EK.Settings.HBSetFeaturesForUpcastFreeSpell.hint',
          scope: 'world',
          config: false,
          default: '',
          type: String,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'hbSetFeaturesForUpcastFreeSpell'
          );
        },
      },

      // ========================================================================
      debug: {
        options: {
          name: `T5EK.Settings.Debug.name`,
          hint: `T5EK.Settings.Debug.hint`,
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('debug');
        },
      },
    } satisfies Tidy5eSettings,
  } as const;
}

export let SettingsProvider: ReturnType<typeof createSettings>;

export function initSettings() {
  SettingsProvider = createSettings();

  for (let menu of Object.entries(SettingsProvider.menus)) {
    // TODO: Need some way to notify when new setting menus are not configured correctly; doesn't have to be perfect
    game.settings.registerMenu(CONSTANTS.MODULE_ID, menu[0], menu[1].options);
  }

  const debouncedSettingStoreRefresh = foundry.utils.debounce(() => {
    settingStore.set(getCurrentSettings());
  }, 100);

  for (let setting of Object.entries(SettingsProvider.settings)) {
    // TODO: Need some way to notify when new settings are not configured correctly; doesn't have to be perfect
    const options = {
      ...setting[1].options,
      onChange: (...args: any[]) => {
        debouncedSettingStoreRefresh();

        (setting[1].options as any).onChange?.(...args);
      },
    };
    game.settings.register(CONSTANTS.MODULE_ID, setting[0], options);
  }

  SettingsProvider.settings.colorScheme.options.onChange(
    SettingsProvider.settings.colorScheme.get()
  );

  settingStore = writable(getCurrentSettings());

  Hooks.on('closeSettingsConfig', () => {
    settingStore.set(getCurrentSettings());
  });
}

function setDnd5eCssVariable(
  ...params: Parameters<CSSStyleDeclaration['setProperty']>
) {
  document
    .querySelector<HTMLElement>('.system-dnd5e')
    ?.style.setProperty(params[0], params[1]);
}
