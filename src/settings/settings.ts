import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { ResetSettingsDialog } from './ResetSettingsDialog';
import type { GetFunctionReturnType } from 'src/types/types';
import { applyTheme, getTheme } from 'src/theme/theme';
import { defaultLightTheme } from 'src/theme/default-light-theme';
import { getCoreThemes, themeVariables } from 'src/theme/theme-reference';
import { SheetSettingsFormApplication } from 'src/applications/settings/client-settings/ClientSettingsFormApplication';
import { writable, type Writable } from 'svelte/store';
import { WorldSettingsFormApplication } from 'src/applications/settings/world-settings/WorldSettingsFormApplication';
import { ThemeSettingsFormApplication } from 'src/applications/theme/ThemeSettingsFormApplication';
import {
  getStandardExhaustionConfig,
  getStandardVehicleExhaustionConfig,
} from 'src/features/exhaustion/exhaustion';
import type { ExhaustionConfig } from '../features/exhaustion/exhaustion.types';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { MigrationsApplication } from 'src/applications/migrations/MigrationsApplication';
import { AboutApplication } from 'src/applications/settings/about/AboutApplication';

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
      worldSettings: {
        options: {
          name: `TIDY5E.WorldSettings.Menu.name`,
          label: 'TIDY5E.WorldSettings.Menu.label',
          hint: `TIDY5E.WorldSettings.Menu.hint`,
          icon: 'fa-solid fa-globe',
          type: WorldSettingsFormApplication,
          restricted: true,
        },
      },
      userMenu: {
        options: {
          name: `TIDY5E.Settings.SheetMenu.name`,
          label: 'TIDY5E.Settings.SheetMenu.label',
          hint: `TIDY5E.Settings.SheetMenu.hint`,
          icon: 'fa-solid fa-user-gear',
          type: SheetSettingsFormApplication,
          restricted: false,
        },
      },
      theme: {
        options: {
          name: `TIDY5E.ThemeSettings.SheetMenu.name`,
          label: 'TIDY5E.ThemeSettings.SheetMenu.buttonLabel',
          hint: `TIDY5E.ThemeSettings.SheetMenu.hint`,
          icon: 'fa-solid fa-palette',
          type: ThemeSettingsFormApplication,
          restricted: false,
        },
      },
      resetAllSettings: {
        options: {
          name: `TIDY5E.Settings.Reset.name`,
          hint: `TIDY5E.Settings.Reset.hint`,
          icon: 'fa-solid fa-database',
          type: ResetSettingsDialog,
          restricted: true,
        },
      },
      migrations: {
        options: {
          name: `TIDY5E.Settings.Migrations.name`,
          label: 'TIDY5E.Settings.Migrations.buttonLabel',
          hint: `TIDY5E.Settings.Migrations.hint`,
          icon: 'fa-solid fa-right-left',
          type: MigrationsApplication,
          restricted: true,
        },
      },
      about: {
        options: {
          name: `TIDY5E.Settings.About.name`,
          label: 'TIDY5E.Settings.About.buttonLabel',
          hint: `TIDY5E.Settings.About.hint`,
          icon: 'fa-solid fa-question',
          type: AboutApplication,
          restricted: false,
        },
      },
    },
    settings: {
      defaultTheme: {
        options: {
          name: 'TIDY5E.Settings.DefaultTheme.name',
          hint: 'TIDY5E.Settings.DefaultTheme.hint',
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
          name: 'TIDY5E.Settings.SheetTheme.name',
          hint: 'TIDY5E.Settings.SheetTheme.hint',
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
          name: 'TIDY5E.Settings.UseContextMenu.name',
          hint: 'TIDY5E.Settings.UseContextMenu.hint',
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
          name: 'TIDY5E.Settings.InitialSheetTab.name',
          hint: 'TIDY5E.Settings.InitialSheetTab.hint',
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
          name: 'TIDY5E.Settings.DefaultSheetTabs.name',
          hint: 'TIDY5E.Settings.DefaultSheetTabs.hint',
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
          name: 'TIDY5E.Settings.UseClassicControls.name',
          hint: 'TIDY5E.Settings.UseClassicControls.hint',
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
          name: 'TIDY5E.Settings.ShowIconsNextToTheItemName.name',
          hint: 'TIDY5E.Settings.ShowIconsNextToTheItemName.hint',
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
          name: 'TIDY5E.Settings.ItemCardsForAllItems.name',
          hint: 'TIDY5E.Settings.ItemCardsForAllItems.hint',
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
          name: 'TIDY5E.Settings.ItemCardsForNPCs.name',
          hint: 'TIDY5E.Settings.ItemCardsForNPCs.hint',
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
          name: 'TIDY5E.Settings.ItemCardsAreFloating.name',
          hint: 'TIDY5E.Settings.ItemCardsAreFloating.hint',
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
          name: 'TIDY5E.Settings.ItemCardsDelay.name',
          hint: 'TIDY5E.Settings.ItemCardsDelay.hint',
          scope: 'client',
          config: true,
          default: 300,
          type: Number,
        },
        get() {
          return FoundryAdapter.getTidySetting<number>('itemCardsDelay');
        },
      },

      useAccessibleKeyboardSupport: {
        options: {
          name: 'TIDY5E.Settings.UseAccessibleKeyboardSupport.name',
          hint: 'TIDY5E.Settings.UseAccessibleKeyboardSupport.hint',
          scope: 'world',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useAccessibleKeyboardSupport'
          );
        },
      },

      useDefaultSheetAttributeTabbing: {
        options: {
          name: 'TIDY5E.Settings.UseDefaultSheetAttributeTabbing.name',
          hint: 'TIDY5E.Settings.UseDefaultSheetAttributeTabbing.hint',
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useDefaultSheetAttributeTabbing'
          );
        },
      },

      useDefaultSheetHpTabbing: {
        options: {
          name: 'TIDY5E.Settings.UseDefaultSheetHpTabbing.name',
          hint: 'TIDY5E.Settings.UseDefaultSheetHpTabbing.hint',
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useDefaultSheetHpTabbing'
          );
        },
      },

      itemCardsFixKey: {
        options: {
          name: 'TIDY5E.Settings.ItemCardsFixKey.name',
          hint: 'TIDY5E.Settings.ItemCardsFixKey.hint',
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
          name: 'TIDY5E.Settings.ShowTraitLabels.name',
          hint: 'TIDY5E.Settings.ShowTraitLabels.hint',
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
          name: 'TIDY5E.Settings.ShowClassList.name',
          hint: 'TIDY5E.Settings.ShowClassList.hint',
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
          name: 'TIDY5E.Settings.InspirationAnimation.name',
          hint: 'TIDY5E.Settings.InspirationAnimation.hint',
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
          name: 'TIDY5E.Settings.HideIfZero.name',
          hint: 'TIDY5E.Settings.HideIfZero.hint',
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
          name: 'TIDY5E.Settings.ShowInspirationOnHover.name',
          hint: 'TIDY5E.Settings.ShowInspirationOnHover.hint',
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
          name: 'TIDY5E.Settings.ShowExhaustionOnHover.name',
          hint: 'TIDY5E.Settings.ShowExhaustionOnHover.hint',
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
          name: 'TIDY5E.Settings.UseHpBar.name',
          hint: 'TIDY5E.Settings.UseHpBar.hint',
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
          name: 'TIDY5E.Settings.UseHpOverlay.name',
          hint: 'TIDY5E.Settings.UseHpOverlay.hint',
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
          name: 'TIDY5E.Settings.ToggleEmptyCharacterSkills.name',
          hint: 'TIDY5E.Settings.ToggleEmptyCharacterSkills.hint',
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
          name: 'TIDY5E.Settings.ToggleEmptyCharacterTraits.name',
          hint: 'TIDY5E.Settings.ToggleEmptyCharacterTraits.hint',
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
          name: 'TIDY5E.Settings.MoveTraitsBelowResources.name',
          hint: 'TIDY5E.Settings.MoveTraitsBelowResources.hint',
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
          name: 'TIDY5E.Settings.ShowEquippedAmmoOnly.name',
          hint: 'TIDY5E.Settings.ShowEquippedAmmoOnly.hint',
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
          name: 'TIDY5E.Settings.InitialSheetTab.name',
          hint: 'TIDY5E.Settings.InitialSheetTab.hint',
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
          name: 'TIDY5E.Settings.DefaultSheetTabs.name',
          hint: 'TIDY5E.Settings.DefaultSheetTabs.hint',
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
          name: 'TIDY5E.Settings.UseClassicControls.name',
          hint: 'TIDY5E.Settings.UseClassicControls.hint',
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
          name: 'TIDY5E.Settings.MoveTraitsBelowResources.name',
          hint: 'TIDY5E.Settings.MoveTraitsBelowResources.hint',
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
          name: 'TIDY5E.Settings.UseHpBar.name',
          hint: 'TIDY5E.Settings.UseHpBar.hint',
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
          name: 'TIDY5E.Settings.UseHpOverlay.name',
          hint: 'TIDY5E.Settings.UseHpOverlay.hint',
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
          name: 'TIDY5E.Settings.AlwaysShowTraits.name',
          hint: 'TIDY5E.Settings.AlwaysShowTraits.hint',
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
          name: 'TIDY5E.Settings.AlwaysShowSkills.name',
          hint: 'TIDY5E.Settings.AlwaysShowSkills.hint',
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
          name: 'TIDY5E.Settings.ShowNPCSpellbookTab.name',
          hint: 'TIDY5E.Settings.ShowNPCSpellbookTab.hint',
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
          name: 'TIDY5E.Settings.InitialSheetTab.name',
          hint: 'TIDY5E.Settings.InitialSheetTab.hint',
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
          name: 'TIDY5E.Settings.DefaultSheetTabs.name',
          hint: 'TIDY5E.Settings.DefaultSheetTabs.hint',
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
          name: 'TIDY5E.Settings.UseClassicControls.name',
          hint: 'TIDY5E.Settings.UseClassicControls.hint',
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
          name: 'TIDY5E.Settings.UseHpBar.name',
          hint: 'TIDY5E.Settings.UseHpBar.hint',
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
          name: 'TIDY5E.Settings.UseHpOverlay.name',
          hint: 'TIDY5E.Settings.UseHpOverlay.hint',
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
          name: 'TIDY5E.Settings.ShowPlayerName.name',
          hint: 'TIDY5E.Settings.ShowPlayerName.hint',
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
          name: 'TIDY5E.Settings.ShowExpandedLimitedView.name',
          hint: 'TIDY5E.Settings.ShowExpandedLimitedView.hint',
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
          name: 'TIDY5E.Settings.UseCircularPortraitStyle.name',
          hint: 'TIDY5E.Settings.UseCircularPortraitStyle.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NONE]:
              'TIDY5E.Settings.UseCircularPortraitStyle.none',
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER]:
              'TIDY5E.Settings.UseCircularPortraitStyle.pc',
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NPCVEHICLE]:
              'TIDY5E.Settings.UseCircularPortraitStyle.npc',
            [CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL]:
              'TIDY5E.Settings.UseCircularPortraitStyle.all',
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
          name: 'TIDY5E.Settings.UseTotalSheetLock.name',
          hint: 'TIDY5E.Settings.UseTotalSheetLock.hint',
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
          name: 'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.name',
          hint: 'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.hint',
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
          name: 'TIDY5E.Settings.LimitEffectsManagementToGM.name',
          hint: 'TIDY5E.Settings.LimitEffectsManagementToGM.hint',
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
          name: 'TIDY5E.Settings.HideDeathSavesFromPlayers.name',
          hint: 'TIDY5E.Settings.HideDeathSavesFromPlayers.hint',
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
          name: 'TIDY5E.Settings.UseSpellSlotMarker.name',
          hint: 'TIDY5E.Settings.UseSpellSlotMarker.hint',
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
          name: 'TIDY5E.Settings.UseCharacterEncumbranceBar.name',
          hint: 'TIDY5E.Settings.UseCharacterEncumbranceBar.hint',
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
          name: 'TIDY5E.Settings.UseNPCEncumbranceBar.name',
          hint: 'TIDY5E.Settings.UseNPCEncumbranceBar.hint',
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
          name: 'TIDY5E.Settings.UseVehicleEncumbranceBar.name',
          hint: 'TIDY5E.Settings.UseVehicleEncumbranceBar.hint',
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
          name: 'TIDY5E.Settings.AlwaysShowItemQuantity.name',
          hint: 'TIDY5E.Settings.AlwaysShowItemQuantity.hint',
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
          name: 'TIDY5E.Settings.UseExhaustion.name',
          hint: 'TIDY5E.Settings.UseExhaustion.hint',
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
          name: 'TIDY5E.Settings.UseInspiration.name',
          hint: 'TIDY5E.Settings.UseInspiration.hint',
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
          name: 'TIDY5E.Settings.UseVehicleMotion.name',
          hint: 'TIDY5E.Settings.UseVehicleMotion.hint',
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
          name: 'TIDY5E.Settings.UseNPCRest.name',
          hint: 'TIDY5E.Settings.UseNPCRest.hint',
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
          name: 'TIDY5E.Settings.ShowNPCRestInChat.name',
          hint: 'TIDY5E.Settings.ShowNPCRestInChat.hint',
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
          name: 'TIDY5E.Settings.ShowNPCActorLinkMarker.name',
          hint: 'TIDY5E.Settings.ShowNPCActorLinkMarker.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: 'TIDY5E.Settings.ShowNPCActorLinkMarker.default',
            unlinked: 'TIDY5E.Settings.ShowNPCActorLinkMarker.unlinked',
            both: 'TIDY5E.Settings.ShowNPCActorLinkMarker.both',
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
          name: 'TIDY5E.Settings.ShowActiveEffectsMarker.name',
          hint: 'TIDY5E.Settings.ShowActiveEffectsMarker.hint',
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
          name: 'TIDY5E.Settings.PlayerSheetWidth.name',
          hint: 'TIDY5E.Settings.PlayerSheetWidth.hint',
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
          name: 'TIDY5E.Settings.NPCSheetWidth.name',
          hint: 'TIDY5E.Settings.NPCSheetWidth.hint',
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
          name: 'TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.name',
          hint: 'TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.hint',
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
          name: 'TIDY5E.Settings.VehicleSheetWidth.name',
          hint: 'TIDY5E.Settings.VehicleSheetWidth.hint',
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
          name: 'TIDY5E.Settings.PermanentlyUnlockVehicleSheetForGM.name',
          hint: 'TIDY5E.Settings.PermanentlyUnlockVehicleSheetForGM.hint',
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
          name: 'TIDY5E.Settings.SortFavoriteItemsAlphabetically.name',
          hint: 'TIDY5E.Settings.SortFavoriteItemsAlphabetically.hint',
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
          name: 'TIDY5E.Settings.LockMoneyChanges.name',
          hint: 'TIDY5E.Settings.LockMoneyChanges.hint',
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
          name: 'TIDY5E.Settings.LockExpChanges.name',
          hint: 'TIDY5E.Settings.LockExpChanges.hint',
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
          name: 'TIDY5E.Settings.LockHpMaxChanges.name',
          hint: 'TIDY5E.Settings.LockHpMaxChanges.hint',
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
          name: 'TIDY5E.Settings.LockLevelSelector.name',
          hint: 'TIDY5E.Settings.LockLevelSelector.hint',
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
          name: 'TIDY5E.Settings.LockConfigureSheet.name',
          hint: 'TIDY5E.Settings.LockConfigureSheet.hint',
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
          name: 'TIDY5E.Settings.LockItemQuantity.name',
          hint: 'TIDY5E.Settings.LockItemQuantity.hint',
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
          name: 'TIDY5E.Settings.AllowCantripsToBePrepared.name',
          hint: 'TIDY5E.Settings.AllowCantripsToBePrepared.hint',
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
          name: 'TIDY5E.Settings.UseMulticlassSpellbookFilter.name',
          hint: 'TIDY5E.Settings.UseMulticlassSpellbookFilter.hint',
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
          name: 'TIDY5E.Settings.UseSpellClassIcons.name',
          hint: 'TIDY5E.Settings.UseSpellClassIcons.hint',
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
          name: 'TIDY5E.Settings.SpellClassFilterAdditionalClasses.name',
          hint: 'TIDY5E.Settings.SpellClassFilterAdditionalClasses.hint',
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
          name: 'TIDY5E.Settings.AllowHpMaxOverride.name',
          hint: 'TIDY5E.Settings.AllowHpMaxOverride.hint',
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
          name: 'TIDY5E.Settings.ActionListLimitActionsToCantrips.name',
          hint: 'TIDY5E.Settings.ActionListLimitActionsToCantrips.hint',
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
          name: 'TIDY5E.Settings.ActionListIncludeMinuteLongSpellsAsActions.name',
          hint: 'TIDY5E.Settings.ActionListIncludeMinuteLongSpellsAsActions.hint',
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
          name: 'TIDY5E.Settings.ActionListIncludeSpellsWithActiveEffects.name',
          hint: 'TIDY5E.Settings.ActionListIncludeSpellsWithActiveEffects.hint',
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
          name: 'TIDY5E.Settings.ActionListIncludeConsumables.name',
          hint: 'TIDY5E.Settings.ActionListIncludeConsumables.hint',
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
          name: 'TIDY5E.Settings.ActionListScaleCantripDamage.name',
          hint: 'TIDY5E.Settings.ActionListScaleCantripDamage.hint',
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
          name: 'TIDY5E.Settings.Exhaustion.name',
          hint: 'TIDY5E.Settings.Exhaustion.hint',
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
          name: 'TIDY5E.Settings.VehicleExhaustion.name',
          hint: 'TIDY5E.Settings.VehicleExhaustion.hint',
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
          name: 'TIDY5E.Settings.ColorPickerEnabled.name',
          hint: 'TIDY5E.Settings.ColorPickerEnabled.hint',
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
          name: 'TIDY5E.Settings.ColorPickerPrimaryAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-primary-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPrimaryAccent'
          );
        },
        representsCssVariable: '--t5e-primary-accent-color',
      },
      colorPickerHpBar: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerHpBar.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-hp-bar-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerHpBar');
        },
        representsCssVariable: '--t5e-hp-bar-color',
      },
      colorPickerEquipped: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerEquipped.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-equipped-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerEquipped');
        },
        representsCssVariable: '--t5e-equipped-background',
      },
      colorPickerEquippedOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerEquippedOutline.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5e-equipped-item-grid-tile-outline-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerEquippedOutline'
          );
        },
        representsCssVariable: '--t5e-equipped-item-grid-tile-outline-color',
      },
      colorPickerEquippedAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerEquippedAccent.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5e-equipped-item-grid-tile-accent-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerEquippedAccent'
          );
        },
        representsCssVariable: '--t5e-equipped-item-grid-tile-accent-color',
      },

      colorPickerPrepared: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerPrepared.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-prepared-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerPrepared');
        },
        representsCssVariable: '--t5e-prepared-background',
      },
      colorPickerPreparedOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerPreparedOutline.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5e-prepared-item-grid-tile-outline-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPreparedOutline'
          );
        },
        representsCssVariable: '--t5e-prepared-item-grid-tile-outline-color',
      },
      colorPickerPreparedAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerPreparedAccent.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables[
              '--t5e-prepared-item-grid-tile-accent-color'
            ],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPreparedAccent'
          );
        },
        representsCssVariable: '--t5e-prepared-item-grid-tile-accent-color',
      },

      colorPickerPact: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerPact.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-pact-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerPact');
        },
        representsCssVariable: '--t5e-pact-background',
      },
      colorPickerPactOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerPactOutline.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-pact-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerPactOutline'
          );
        },
        representsCssVariable: '--t5e-pact-outline-color',
      },
      colorPickerPactAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerPactAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-pact-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerPactAccent');
        },
        representsCssVariable: '--t5e-pact-accent-color',
      },

      colorPickerAtWill: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerAtWill.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-atwill-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerAtWill');
        },
        representsCssVariable: '--t5e-atwill-background',
      },
      colorPickerAtWillOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerAtWillOutline.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-atwill-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAtWillOutline'
          );
        },
        representsCssVariable: '--t5e-atwill-outline-color',
      },
      colorPickerAtWillAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerAtWillAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-atwill-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAtWillAccent'
          );
        },
        representsCssVariable: '--t5e-atwill-accent-color',
      },

      colorPickerInnate: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerInnate.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-innate-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerInnate');
        },
        representsCssVariable: '--t5e-innate-background',
      },
      colorPickerInnateOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerInnateOutline.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-innate-outline'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerInnateOutline'
          );
        },
        representsCssVariable: '--t5e-innate-outline',
      },
      colorPickerInnateAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerInnateAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-innate-accent'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerInnateAccent'
          );
        },
        representsCssVariable: '--t5e-innate-accent',
      },

      colorPickerAlwaysPrepared: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerAlwaysPrepared.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5e-alwaysprepared-background'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAlwaysPrepared'
          );
        },
        representsCssVariable: '--t5e-alwaysprepared-background',
      },
      colorPickerAlwaysPreparedOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerAlwaysPreparedOutline.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5e-alwaysprepared-outline-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAlwaysPreparedOutline'
          );
        },
        representsCssVariable: '--t5e-alwaysprepared-outline-color',
      },
      colorPickerAlwaysPreparedAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerAlwaysPreparedAccent.name',
          scope: 'client',
          type: String,
          default:
            defaultLightTheme.variables['--t5e-alwaysprepared-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAlwaysPreparedAccent'
          );
        },
        representsCssVariable: '--t5e-alwaysprepared-accent-color',
      },
      colorPickerScrollbarThumb: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerScrollbarThumb.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-scrollbar-thumb-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerScrollbarThumb'
          );
        },
        representsCssVariable: '--t5e-scrollbar-thumb-color',
      },
      colorPickerScrollbarTrack: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerScrollbarTrack.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-scrollbar-track-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerScrollbarTrack'
          );
        },
        representsCssVariable: '--t5e-scrollbar-track-color',
      },
      colorPickerMagicAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerMagicAccent.name',
          scope: 'client',
          type: String,
          default: defaultLightTheme.variables['--t5e-magic-accent-color'],
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerMagicAccent'
          );
        },
        representsCssVariable: '--t5e-magic-accent-color',
      },

      debug: {
        options: {
          name: `TIDY5E.Settings.Debug.name`,
          hint: `TIDY5E.Settings.Debug.hint`,
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

  Hooks.on('closeSettingsConfig', () => {
    settingStore.set(getCurrentSettings());
  });
}
