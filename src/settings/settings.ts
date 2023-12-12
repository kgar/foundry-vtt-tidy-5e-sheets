import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { ResetSettingsDialog } from './ResetSettingsDialog';
import type { GetFunctionReturnType } from 'src/types/types';
import { applyTheme, getTheme } from 'src/theme/theme';
import { defaultLightTheme } from 'src/theme/default-light-theme';
import { getCoreThemes, themeVariables } from 'src/theme/theme-reference';
import { SheetSettingsFormApplication } from 'src/applications/sheet-settings/SheetSettingsFormApplication';
import { writable, type Writable } from 'svelte/store';
import ThemeSettingsFormApplication from 'src/applications/theme/ThemeSettingsFormApplication';
import {
  getStandardExhaustionConfig,
  getStandardVehicleExhaustionConfig,
} from 'src/features/exhaustion/exhaustion';
import type { ExhaustionConfig } from '../features/exhaustion/exhaustion.types';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';

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
          type: SheetSettingsFormApplication,
          restricted: false,
        },
      },
      theme: {
        options: {
          name: `T5EK.ThemeSettings.SheetMenu.name`,
          label: 'T5EK.ThemeSettings.SheetMenu.buttonLabel',
          hint: `T5EK.ThemeSettings.SheetMenu.hint`,
          icon: 'fas fa-palette',
          type: ThemeSettingsFormApplication,
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
          return FoundryAdapter.getTidySetting<string>('defaultTheme');
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
          return FoundryAdapter.getTidySetting<string>('colorScheme');
        },
      },

      // Context Menu
      useContextMenu: {
        options: {
          name: 'T5EK.Settings.UseContextMenu.name',
          hint: 'T5EK.Settings.UseContextMenu.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useContextMenu');
        },
      },

      // Player Character Settings

      initialCharacterSheetTab: {
        options: {
          name: 'T5EK.Settings.InitialSheetTab.name',
          hint: 'T5EK.Settings.InitialSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            TabManager.getTabsAsConfigOptions(
              CharacterSheetRuntime.getAllRegisteredTabs()
            ),
          default: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'initialCharacterSheetTab'
          );
        },
      },

      defaultCharacterSheetTabs: {
        options: {
          name: 'T5EK.Settings.DefaultSheetTabs.name',
          hint: 'T5EK.Settings.DefaultSheetTabs.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [
            CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
            CONSTANTS.TAB_CHARACTER_INVENTORY,
            CONSTANTS.TAB_CHARACTER_SPELLBOOK,
            CONSTANTS.TAB_CHARACTER_FEATURES,
            CONSTANTS.TAB_CHARACTER_EFFECTS,
            CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
            CONSTANTS.TAB_CHARACTER_JOURNAL,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>(
            'defaultCharacterSheetTabs'
          );
        },
      },

      useClassicControlsForCharacter: {
        options: {
          name: 'T5EK.Settings.UseClassicControls.name',
          hint: 'T5EK.Settings.UseClassicControls.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useClassicControlsForCharacter'
          );
        },
      },

      showIconsNextToTheItemName: {
        options: {
          name: 'T5EK.Settings.ShowIconsNextToTheItemName.name',
          hint: 'T5EK.Settings.ShowIconsNextToTheItemName.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'showIconsNextToTheItemName'
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
          return FoundryAdapter.getTidySetting<boolean>('itemCardsForAllItems');
        },
      },

      itemCardsForNpcs: {
        options: {
          name: 'T5EK.Settings.ItemCardsForNPCs.name',
          hint: 'T5EK.Settings.ItemCardsForNPCs.hint',
          scope: 'world',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('itemCardsForNpcs');
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
          return FoundryAdapter.getTidySetting<boolean>('itemCardsAreFloating');
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
          return FoundryAdapter.getTidySetting<number>('itemCardsDelay');
        },
      },

      useOldAttributeTabbing: {
        options: {
          name: 'T5EK.Settings.UseOldAttributeTabbing.name',
          hint: 'T5EK.Settings.UseOldAttributeTabbing.hint',
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useOldAttributeTabbing');
        },
      },

      useOldHpTabbing: {
        options: {
          name: 'T5EK.Settings.UseOldHpTabbing.name',
          hint: 'T5EK.Settings.UseOldHpTabbing.hint',
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useOldHpTabbing');
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
          return FoundryAdapter.getTidySetting<string>('itemCardsFixKey');
        },
      },

      //Show trait labels
      showTraitLabels: {
        options: {
          name: 'T5EK.Settings.ShowTraitLabels.name',
          hint: 'T5EK.Settings.ShowTraitLabels.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('showTraitLabels');
        },
      },

      // Settings Menu

      // PC Sheet Settings
      showClassList: {
        options: {
          name: 'T5EK.Settings.ShowClassList.name',
          hint: 'T5EK.Settings.ShowClassList.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('showClassList');
        },
      },

      animateInspiration: {
        options: {
          name: 'T5EK.Settings.InspirationAnimation.name',
          hint: 'T5EK.Settings.InspirationAnimation.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('animateInspiration');
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
          return FoundryAdapter.getTidySetting<boolean>('hideIfZero');
        },
      },

      showInspirationOnHover: {
        options: {
          name: 'T5EK.Settings.ShowInspirationOnHover.name',
          hint: 'T5EK.Settings.ShowInspirationOnHover.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'showInspirationOnHover'
          );
        },
      },

      showExhaustionOnHover: {
        options: {
          name: 'T5EK.Settings.ShowExhaustionOnHover.name',
          hint: 'T5EK.Settings.ShowExhaustionOnHover.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'showExhaustionOnHover'
          );
        },
      },

      useHpBar: {
        options: {
          name: 'T5EK.Settings.UseHpBar.name',
          hint: 'T5EK.Settings.UseHpBar.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpBar');
        },
      },

      useHpOverlay: {
        options: {
          name: 'T5EK.Settings.UseHpOverlay.name',
          hint: 'T5EK.Settings.UseHpOverlay.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpOverlay');
        },
      },

      toggleEmptyCharacterSkills: {
        options: {
          name: 'T5EK.Settings.ToggleEmptyCharacterSkills.name',
          hint: 'T5EK.Settings.ToggleEmptyCharacterSkills.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'toggleEmptyCharacterSkills'
          );
        },
      },

      toggleEmptyCharacterTraits: {
        options: {
          name: 'T5EK.Settings.ToggleEmptyCharacterTraits.name',
          hint: 'T5EK.Settings.ToggleEmptyCharacterTraits.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'toggleEmptyCharacterTraits'
          );
        },
      },

      moveTraitsBelowCharacterResources: {
        options: {
          name: 'T5EK.Settings.MoveTraitsBelowResources.name',
          hint: 'T5EK.Settings.MoveTraitsBelowResources.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'moveTraitsBelowCharacterResources'
          );
        },
      },

      showEquippedAmmoOnly: {
        options: {
          name: 'T5EK.Settings.ShowEquippedAmmoOnly.name',
          hint: 'T5EK.Settings.ShowEquippedAmmoOnly.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('showEquippedAmmoOnly');
        },
      },

      // NPC Sheet Settings
      initialNpcSheetTab: {
        options: {
          name: 'T5EK.Settings.InitialSheetTab.name',
          hint: 'T5EK.Settings.InitialSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            TabManager.getTabsAsConfigOptions(
              NpcSheetRuntime.getAllRegisteredTabs()
            ),
          default: CONSTANTS.TAB_NPC_ABILITIES,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('initialNpcSheetTab');
        },
      },

      defaultNpcSheetTabs: {
        options: {
          name: 'T5EK.Settings.DefaultSheetTabs.name',
          hint: 'T5EK.Settings.DefaultSheetTabs.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [
            CONSTANTS.TAB_NPC_ABILITIES,
            CONSTANTS.TAB_NPC_SPELLBOOK,
            CONSTANTS.TAB_NPC_EFFECTS,
            CONSTANTS.TAB_NPC_BIOGRAPHY,
            CONSTANTS.TAB_NPC_JOURNAL,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>('defaultNpcSheetTabs');
        },
      },

      useClassicControlsForNpc: {
        options: {
          name: 'T5EK.Settings.UseClassicControls.name',
          hint: 'T5EK.Settings.UseClassicControls.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useClassicControlsForNpc'
          );
        },
      },

      moveTraitsBelowNpcResources: {
        options: {
          name: 'T5EK.Settings.MoveTraitsBelowResources.name',
          hint: 'T5EK.Settings.MoveTraitsBelowResources.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'moveTraitsBelowNpcResources'
          );
        },
      },

      useHpBarNpc: {
        options: {
          name: 'T5EK.Settings.UseHpBar.name',
          hint: 'T5EK.Settings.UseHpBar.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpBarNpc');
        },
      },

      useHpOverlayNpc: {
        options: {
          name: 'T5EK.Settings.UseHpOverlay.name',
          hint: 'T5EK.Settings.UseHpOverlay.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpOverlayNpc');
        },
      },

      alwaysShowNpcTraits: {
        options: {
          name: 'T5EK.Settings.AlwaysShowTraits.name',
          hint: 'T5EK.Settings.AlwaysShowTraits.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('alwaysShowNpcTraits');
        },
      },

      alwaysShowNpcSkills: {
        options: {
          name: 'T5EK.Settings.AlwaysShowSkills.name',
          hint: 'T5EK.Settings.AlwaysShowSkills.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('alwaysShowNpcSkills');
        },
      },

      showSpellbookTabNpc: {
        options: {
          name: 'T5EK.Settings.ShowNPCSpellbookTab.name',
          hint: 'T5EK.Settings.ShowNPCSpellbookTab.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('showSpellbookTabNpc');
        },
      },

      // Vehicle Sheet Settings

      initialVehicleSheetTab: {
        options: {
          name: 'T5EK.Settings.InitialSheetTab.name',
          hint: 'T5EK.Settings.InitialSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            TabManager.getTabsAsConfigOptions(
              VehicleSheetRuntime.getAllRegisteredTabs()
            ),
          default: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'initialVehicleSheetTab'
          );
        },
      },

      defaultVehicleSheetTabs: {
        options: {
          name: 'T5EK.Settings.DefaultSheetTabs.name',
          hint: 'T5EK.Settings.DefaultSheetTabs.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [
            CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
            CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
            CONSTANTS.TAB_VEHICLE_EFFECTS,
            CONSTANTS.TAB_VEHICLE_DESCRIPTION,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>(
            'defaultVehicleSheetTabs'
          );
        },
      },

      useClassicControlsForVehicle: {
        options: {
          name: 'T5EK.Settings.UseClassicControls.name',
          hint: 'T5EK.Settings.UseClassicControls.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useClassicControlsForVehicle'
          );
        },
      },

      useHpBarVehicle: {
        options: {
          name: 'T5EK.Settings.UseHpBar.name',
          hint: 'T5EK.Settings.UseHpBar.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpBarVehicle');
        },
      },

      useHpOverlayVehicle: {
        options: {
          name: 'T5EK.Settings.UseHpOverlay.name',
          hint: 'T5EK.Settings.UseHpOverlay.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpOverlayVehicle');
        },
      },

      //
      // GM Options
      //
      // Show Player Name
      showPlayerName: {
        options: {
          name: 'T5EK.Settings.ShowPlayerName.name',
          hint: 'T5EK.Settings.ShowPlayerName.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('showPlayerName');
        },
      },

      // Expanded Sheet
      showExpandedLimitedView: {
        options: {
          name: 'T5EK.Settings.ShowExpandedLimitedView.name',
          hint: 'T5EK.Settings.ShowExpandedLimitedView.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'showExpandedLimitedView'
          );
        },
      },

      // Portrait Settings
      // Portrait Style
      useCircularPortraitStyle: {
        options: {
          name: 'T5EK.Settings.UseCircularPortraitStyle.name',
          hint: 'T5EK.Settings.UseCircularPortraitStyle.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NONE]:
              'T5EK.Settings.UseCircularPortraitStyle.none',
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER]:
              'T5EK.Settings.UseCircularPortraitStyle.pc',
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NPCVEHICLE]:
              'T5EK.Settings.UseCircularPortraitStyle.npc',
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL]:
              'T5EK.Settings.UseCircularPortraitStyle.all',
          },
          default: CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL,
        },
        get(): string {
          return FoundryAdapter.getTidySetting<string>(
            'useCircularPortraitStyle'
          );
        },
      },

      // Total Edit Lock
      useTotalSheetLock: {
        options: {
          name: 'T5EK.Settings.UseTotalSheetLock.name',
          hint: 'T5EK.Settings.UseTotalSheetLock.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useTotalSheetLock');
        },
      },

      permanentlyUnlockCharacterSheetForGm: {
        options: {
          name: 'T5EK.Settings.PermanentlyUnlockCharacterSheetForGM.name',
          hint: 'T5EK.Settings.PermanentlyUnlockCharacterSheetForGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'permanentlyUnlockCharacterSheetForGm'
          );
        },
      },

      limitEffectsManagementToGm: {
        options: {
          name: 'T5EK.Settings.LimitEffectsManagementToGM.name',
          hint: 'T5EK.Settings.LimitEffectsManagementToGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'limitEffectsManagementToGm'
          );
        },
      },

      // Hidden Death Saves
      hideDeathSavesFromPlayers: {
        options: {
          name: 'T5EK.Settings.HideDeathSavesFromPlayers.name',
          hint: 'T5EK.Settings.HideDeathSavesFromPlayers.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'hideDeathSavesFromPlayers'
          );
        },
      },

      // Hide marker spell slot
      useSpellSlotMarker: {
        options: {
          name: 'T5EK.Settings.UseSpellSlotMarker.name',
          hint: 'T5EK.Settings.UseSpellSlotMarker.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useSpellSlotMarker');
        },
      },

      useCharacterEncumbranceBar: {
        options: {
          name: 'T5EK.Settings.UseCharacterEncumbranceBar.name',
          hint: 'T5EK.Settings.UseCharacterEncumbranceBar.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useCharacterEncumbranceBar'
          );
        },
      },

      useNpcEncumbranceBar: {
        options: {
          name: 'T5EK.Settings.UseNPCEncumbranceBar.name',
          hint: 'T5EK.Settings.UseNPCEncumbranceBar.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useNpcEncumbranceBar');
        },
      },

      useVehicleEncumbranceBar: {
        options: {
          name: 'T5EK.Settings.UseVehicleEncumbranceBar.name',
          hint: 'T5EK.Settings.UseVehicleEncumbranceBar.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useVehicleEncumbranceBar'
          );
        },
      },

      // Item quantity
      alwaysShowItemQuantity: {
        options: {
          name: 'T5EK.Settings.AlwaysShowItemQuantity.name',
          hint: 'T5EK.Settings.AlwaysShowItemQuantity.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'alwaysShowItemQuantity'
          );
        },
      },

      useExhaustion: {
        options: {
          name: 'T5EK.Settings.UseExhaustion.name',
          hint: 'T5EK.Settings.UseExhaustion.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useExhaustion');
        },
      },

      useCharacterInspiration: {
        options: {
          name: 'T5EK.Settings.UseInspiration.name',
          hint: 'T5EK.Settings.UseInspiration.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useCharacterInspiration'
          );
        },
      },

      useVehicleMotion: {
        options: {
          name: 'T5EK.Settings.UseVehicleMotion.name',
          hint: 'T5EK.Settings.UseVehicleMotion.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useVehicleMotion');
        },
      },

      // NPC Resting
      useNpcRest: {
        options: {
          name: 'T5EK.Settings.UseNPCRest.name',
          hint: 'T5EK.Settings.UseNPCRest.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useNpcRest');
        },
      },

      showNpcRestInChat: {
        options: {
          name: 'T5EK.Settings.ShowNPCRestInChat.name',
          hint: 'T5EK.Settings.ShowNPCRestInChat.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('showNpcRestInChat');
        },
      },

      // Link Marker
      showNpcActorLinkMarker: {
        options: {
          name: 'T5EK.Settings.ShowNPCActorLinkMarker.name',
          hint: 'T5EK.Settings.ShowNPCActorLinkMarker.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: 'T5EK.Settings.ShowNPCActorLinkMarker.default',
            unlinked: 'T5EK.Settings.ShowNPCActorLinkMarker.unlinked',
            both: 'T5EK.Settings.ShowNPCActorLinkMarker.both',
          },
          default: 'default',
        },
        get() {
          return FoundryAdapter.getTidySetting<'default' | 'unlinked' | 'both'>(
            'showNpcActorLinkMarker'
          );
        },
      },

      // Show if item has active effects
      showActiveEffectsMarker: {
        options: {
          name: 'T5EK.Settings.ShowActiveEffectsMarker.name',
          hint: 'T5EK.Settings.ShowActiveEffectsMarker.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'showActiveEffectsMarker'
          );
        },
      },

      // Default width for player sheet
      playerSheetWidth: {
        options: {
          name: 'T5EK.Settings.PlayerSheetWidth.name',
          hint: 'T5EK.Settings.PlayerSheetWidth.hint',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getTidySetting<number>('playerSheetWidth');
        },
      },

      // Default width for NPC sheet
      npcSheetWidth: {
        options: {
          name: 'T5EK.Settings.NPCSheetWidth.name',
          hint: 'T5EK.Settings.NPCSheetWidth.hint',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getTidySetting<number>('npcSheetWidth');
        },
      },

      permanentlyUnlockNpcSheetForGm: {
        options: {
          name: 'T5EK.Settings.PermanentlyUnlockNPCSheetForGM.name',
          hint: 'T5EK.Settings.PermanentlyUnlockNPCSheetForGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'permanentlyUnlockNpcSheetForGm'
          );
        },
      },

      // Default width for vehicle sheet

      vehicleSheetWidth: {
        options: {
          name: 'T5EK.Settings.VehicleSheetWidth.name',
          hint: 'T5EK.Settings.VehicleSheetWidth.hint',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getTidySetting<number>('vehicleSheetWidth');
        },
      },

      permanentlyUnlockVehicleSheetForGm: {
        options: {
          name: 'T5EK.Settings.PermanentlyUnlockVehicleSheetForGM.name',
          hint: 'T5EK.Settings.PermanentlyUnlockVehicleSheetForGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'permanentlyUnlockVehicleSheetForGm'
          );
        },
      },

      // Favorites

      sortFavoriteItemsAlphabetically: {
        options: {
          name: 'T5EK.Settings.SortFavoriteItemsAlphabetically.name',
          hint: 'T5EK.Settings.SortFavoriteItemsAlphabetically.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'sortFavoriteItemsAlphabetically'
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
          return FoundryAdapter.getTidySetting<boolean>('lockMoneyChanges');
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
          return FoundryAdapter.getTidySetting<boolean>('lockExpChanges');
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
          return FoundryAdapter.getTidySetting<boolean>('lockHpMaxChanges');
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
          return FoundryAdapter.getTidySetting<boolean>('lockLevelSelector');
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
          return FoundryAdapter.getTidySetting<boolean>('lockConfigureSheet');
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
          return FoundryAdapter.getTidySetting<boolean>('lockItemQuantity');
        },
      },

      // Other
      allowCantripsToBePrepared: {
        options: {
          name: 'T5EK.Settings.AllowCantripsToBePrepared.name',
          hint: 'T5EK.Settings.AllowCantripsToBePrepared.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'allowCantripsToBePrepared'
          );
        },
      },

      useMulticlassSpellbookFilter: {
        options: {
          name: 'T5EK.Settings.UseMulticlassSpellbookFilter.name',
          hint: 'T5EK.Settings.UseMulticlassSpellbookFilter.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useMulticlassSpellbookFilter'
          );
        },
      },

      useSpellClassFilterIcons: {
        options: {
          name: 'T5EK.Settings.UseSpellClassIcons.name',
          hint: 'T5EK.Settings.UseSpellClassIcons.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useSpellClassFilterIcons'
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<boolean>('allowHpMaxOverride');
        },
      },

      // Actions List

      actionListLimitActionsToCantrips: {
        options: {
          name: 'T5EK.Settings.ActionsListLimitActionsToCantrips.name',
          hint: 'T5EK.Settings.ActionsListLimitActionsToCantrips.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListLimitActionsToCantrips'
          );
        },
      },

      actionListIncludeMinuteLongSpellsAsActions: {
        options: {
          name: 'T5EK.Settings.ActionsListIncludeMinuteLongSpellsAsActions.name',
          hint: 'T5EK.Settings.ActionsListIncludeMinuteLongSpellsAsActions.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListIncludeMinuteLongSpellsAsActions'
          );
        },
      },

      actionListIncludeSpellsWithActiveEffects: {
        options: {
          name: 'T5EK.Settings.ActionsListIncludeSpellsWithActiveEffects.name',
          hint: 'T5EK.Settings.ActionsListIncludeSpellsWithActiveEffects.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListIncludeSpellsWithActiveEffects'
          );
        },
      },

      actionListIncludeConsumables: {
        options: {
          name: 'T5EK.Settings.ActionsListIncludeConsumables.name',
          hint: 'T5EK.Settings.ActionsListIncludeConsumables.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListIncludeConsumables'
          );
        },
      },

      actionListScaleCantripDamage: {
        options: {
          name: 'T5EK.Settings.ActionsListScaleCantripDamage.name',
          hint: 'T5EK.Settings.ActionsListScaleCantripDamage.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListScaleCantripDamage'
          );
        },
      },

      // Exhaustion

      exhaustionConfig: {
        options: {
          name: 'T5EK.Settings.Exhaustion.name',
          hint: 'T5EK.Settings.Exhaustion.hint',
          scope: 'world',
          config: false,
          default: getStandardExhaustionConfig(),
          type: Object,
        },
        get() {
          return FoundryAdapter.getTidySetting<ExhaustionConfig>(
            'exhaustionConfig'
          );
        },
      },

      vehicleExhaustionConfig: {
        options: {
          name: 'T5EK.Settings.VehicleExhaustion.name',
          hint: 'T5EK.Settings.VehicleExhaustion.hint',
          scope: 'world',
          config: false,
          default: getStandardVehicleExhaustionConfig(),
          type: Object,
        },
        get() {
          return FoundryAdapter.getTidySetting<ExhaustionConfig>(
            'vehicleExhaustionConfig'
          );
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
          return FoundryAdapter.getTidySetting<boolean>('colorPickerEnabled');
        },
      },

      colorPickerPrimaryAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerPrimaryAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-primary-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPrimaryAccent'
          );
        },
        representsCssVariable: '--t5ek-primary-accent-color',
      },
      colorPickerHpBar: {
        options: {
          name: 'T5EK.Settings.ColorPickerHpBar.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-hp-bar-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerHpBar');
        },
        representsCssVariable: '--t5ek-hp-bar-color',
      },
      colorPickerEquipped: {
        options: {
          name: 'T5EK.Settings.ColorPickerEquipped.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-equipped-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerEquipped');
        },
        representsCssVariable: '--t5ek-equipped-background',
      },
      colorPickerEquippedOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerEquippedOutline.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-equipped-item-grid-tile-outline-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerEquippedOutline'
          );
        },
        representsCssVariable: '--t5ek-equipped-item-grid-tile-outline-color',
      },
      colorPickerEquippedAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerEquippedAccent.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-equipped-item-grid-tile-accent-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerEquippedAccent'
          );
        },
        representsCssVariable: '--t5ek-equipped-item-grid-tile-accent-color',
      },

      colorPickerPrepared: {
        options: {
          name: 'T5EK.Settings.ColorPickerPrepared.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-prepared-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerPrepared');
        },
        representsCssVariable: '--t5ek-prepared-background',
      },
      colorPickerPreparedOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerPreparedOutline.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-prepared-item-grid-tile-outline-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPreparedOutline'
          );
        },
        representsCssVariable: '--t5ek-prepared-item-grid-tile-outline-color',
      },
      colorPickerPreparedAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerPreparedAccent.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5ek-prepared-item-grid-tile-accent-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPreparedAccent'
          );
        },
        representsCssVariable: '--t5ek-prepared-item-grid-tile-accent-color',
      },

      colorPickerPact: {
        options: {
          name: 'T5EK.Settings.ColorPickerPact.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-pact-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerPact');
        },
        representsCssVariable: '--t5ek-pact-background',
      },
      colorPickerPactOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerPactOutline.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-pact-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPactOutline'
          );
        },
        representsCssVariable: '--t5ek-pact-outline-color',
      },
      colorPickerPactAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerPactAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-pact-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerPactAccent');
        },
        representsCssVariable: '--t5ek-pact-accent-color',
      },

      colorPickerAtWill: {
        options: {
          name: 'T5EK.Settings.ColorPickerAtWill.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-atwill-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerAtWill');
        },
        representsCssVariable: '--t5ek-atwill-background',
      },
      colorPickerAtWillOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerAtWillOutline.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-atwill-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAtWillOutline'
          );
        },
        representsCssVariable: '--t5ek-atwill-outline-color',
      },
      colorPickerAtWillAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerAtWillAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-atwill-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAtWillAccent'
          );
        },
        representsCssVariable: '--t5ek-atwill-accent-color',
      },

      colorPickerInnate: {
        options: {
          name: 'T5EK.Settings.ColorPickerInnate.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-innate-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerInnate');
        },
        representsCssVariable: '--t5ek-innate-background',
      },
      colorPickerInnateOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerInnateOutline.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-innate-outline'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerInnateOutline'
          );
        },
        representsCssVariable: '--t5ek-innate-outline',
      },
      colorPickerInnateAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerInnateAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5ek-innate-accent'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerInnateAccent'
          );
        },
        representsCssVariable: '--t5ek-innate-accent',
      },

      colorPickerAlwaysPrepared: {
        options: {
          name: 'T5EK.Settings.ColorPickerAlwaysPrepared.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5ek-alwaysprepared-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAlwaysPrepared'
          );
        },
        representsCssVariable: '--t5ek-alwaysprepared-background',
      },
      colorPickerAlwaysPreparedOutline: {
        options: {
          name: 'T5EK.Settings.ColorPickerAlwaysPreparedOutline.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5ek-alwaysprepared-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAlwaysPreparedOutline'
          );
        },
        representsCssVariable: '--t5ek-alwaysprepared-outline-color',
      },
      colorPickerAlwaysPreparedAccent: {
        options: {
          name: 'T5EK.Settings.ColorPickerAlwaysPreparedAccent.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5ek-alwaysprepared-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAlwaysPreparedAccent'
          );
        },
        representsCssVariable: '--t5ek-alwaysprepared-accent-color',
      },

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
          return FoundryAdapter.getTidySetting<boolean>('debug');
        },
      },
    } satisfies Tidy5eSettings,
  } as const;
}

export let SettingsProvider: ReturnType<typeof createSettings>;

export function initSettings() {
  SettingsProvider = createSettings();

  for (let menu of Object.entries(SettingsProvider.menus)) {
    FoundryAdapter.registerTidyMenu(menu[0], menu[1].options);
  }

  const debouncedSettingStoreRefresh = FoundryAdapter.debounce(() => {
    settingStore.set(getCurrentSettings());
  }, 100);

  for (let setting of Object.entries(SettingsProvider.settings)) {
    const options = {
      ...setting[1].options,
      onChange: (...args: any[]) => {
        debouncedSettingStoreRefresh();

        (setting[1].options as any).onChange?.(...args);
      },
    };
    FoundryAdapter.registerTidySetting(setting[0], options);
  }

  // Apply current color scheme
  SettingsProvider.settings.colorScheme.options.onChange(
    SettingsProvider.settings.colorScheme.get()
  );

  settingStore = writable(getCurrentSettings());

  FoundryAdapter.hooksOn('closeSettingsConfig', () => {
    settingStore.set(getCurrentSettings());
  });
}
