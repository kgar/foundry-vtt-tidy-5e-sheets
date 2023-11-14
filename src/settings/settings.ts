import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { ResetSettingsDialog } from './ResetSettingsDialog';
import type { GetFunctionReturnType } from 'src/types/types';
import { applyTheme, getTheme } from 'src/theme/theme';
import { defaultLightTheme } from 'src/theme/default-light-theme';
import { getCoreThemes, themeVariables } from 'src/theme/theme-reference';
import { Tidy5eKgarSettingsSheet } from 'src/sheets/settings/sheet/Tidy5eKgarSettingsSheet';
import { Tidy5eKgarThemeSettingsSheet } from 'src/sheets/settings/theme/Tidy5eKgarThemeSettingsSheet';
import { writable, type Writable } from 'svelte/store';
import { getAllRegisteredCharacterSheetTabs } from 'src/state/character-sheet-state';
import { getAllRegisteredVehicleSheetTabs } from 'src/state/vehicle-sheet-state';
import { getAllRegisteredNpcSheetTabs } from 'src/state/npc-sheet-state';
import { getTabsAsConfigOptions } from 'src/state/state-functions';

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

      defaultCharacterSheetTab: {
        options: {
          name: 'T5EK.Settings.DefaultSheetTab.name',
          hint: 'T5EK.Settings.DefaultSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            getTabsAsConfigOptions(getAllRegisteredCharacterSheetTabs()),
          default: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'defaultCharacterSheetTab'
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<boolean>('itemCardsForAllItems');
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
      useJournalTabForCharacter: {
        options: {
          name: 'T5EK.Settings.UseJournalTabForCharacter.name',
          hint: 'T5EK.Settings.UseJournalTabForCharacter.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useJournalTabForCharacter'
          );
        },
      },

      useJournalTabForNpc: {
        options: {
          name: 'T5EK.Settings.UseJournalTabForNPC.name',
          hint: 'T5EK.Settings.UseJournalTabForNPC.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useJournalTabForNpc');
        },
      },

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
          return FoundryAdapter.getTidySetting<boolean>('inspirationOnHover');
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
          return FoundryAdapter.getTidySetting<boolean>('exhaustionOnHover');
        },
      },

      useHpBar: {
        options: {
          name: 'T5EK.Settings.HpBar.name',
          hint: 'T5EK.Settings.HpBar.hint',
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
          name: 'T5EK.Settings.HpOverlay.name',
          hint: 'T5EK.Settings.HpOverlay.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpOverlay');
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
          return FoundryAdapter.getTidySetting<boolean>('traitsTogglePc');
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<boolean>('ammoEquippedOnly');
        },
      },

      // NPC Sheet Settings
      defaultNpcSheetTab: {
        options: {
          name: 'T5EK.Settings.DefaultSheetTab.name',
          hint: 'T5EK.Settings.DefaultSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () => getTabsAsConfigOptions(getAllRegisteredNpcSheetTabs()),
          default: CONSTANTS.TAB_NPC_ABILITIES,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('defaultNpcSheetTab');
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
          return FoundryAdapter.getTidySetting<boolean>(
            'traitsMovedBelowResourceNpc'
          );
        },
      },

      useHpBarNpc: {
        options: {
          name: 'T5EK.Settings.HpBar.name',
          hint: 'T5EK.Settings.HpBar.hint',
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
          name: 'T5EK.Settings.HpOverlay.name',
          hint: 'T5EK.Settings.HpOverlay.hint',
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useHpOverlayNpc');
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
          return FoundryAdapter.getTidySetting<boolean>('traitsAlwaysShownNpc');
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
          return FoundryAdapter.getTidySetting<boolean>('skillsAlwaysShownNpc');
        },
      },

      showSpellbookTabNpc: {
        options: {
          name: 'T5EK.Settings.ShowSpellbookTabNpc.name',
          hint: 'T5EK.Settings.ShowSpellbookTabNpc.hint',
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

      defaultVehicleSheetTab: {
        options: {
          name: 'T5EK.Settings.DefaultSheetTab.name',
          hint: 'T5EK.Settings.DefaultSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            getTabsAsConfigOptions(getAllRegisteredVehicleSheetTabs()),
          default: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'defaultVehicleSheetTab'
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
          name: 'T5EK.Settings.HpBar.name',
          hint: 'T5EK.Settings.HpBar.hint',
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
          name: 'T5EK.Settings.HpOverlay.name',
          hint: 'T5EK.Settings.HpOverlay.hint',
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
          return FoundryAdapter.getTidySetting<boolean>('playerNameEnabled');
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
          return FoundryAdapter.getTidySetting<boolean>('expandedSheetEnabled');
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
            [CONSTANTS.ROUNDED_PORTRAIT_OPTION_NONE]:
              'T5EK.Settings.PortraitStyle.default',
            [CONSTANTS.ROUNDED_PORTRAIT_OPTION_CHARACTER]:
              'T5EK.Settings.PortraitStyle.pc',
            [CONSTANTS.ROUNDED_PORTRAIT_OPTION_NPCVEHICLE]:
              'T5EK.Settings.PortraitStyle.npc',
            [CONSTANTS.ROUNDED_PORTRAIT_OPTION_ALL]:
              'T5EK.Settings.PortraitStyle.all',
          },
          default: CONSTANTS.ROUNDED_PORTRAIT_OPTION_ALL,
        },
        get(): string {
          return FoundryAdapter.getTidySetting<string>('portraitStyle');
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
          return FoundryAdapter.getTidySetting<boolean>('editTotalLockEnabled');
        },
      },

      enablePermanentUnlockOnCharacterIfYouAreGM: {
        options: {
          name: 'T5EK.Settings.EnablePermanentUnlockOnCharacterIfYouAreGM.name',
          hint: 'T5EK.Settings.EnablePermanentUnlockOnCharacterIfYouAreGM.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'enablePermanentUnlockOnCharacterIfYouAreGM'
          );
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<boolean>(
            'hiddenDeathSavesEnabled'
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
          return FoundryAdapter.getTidySetting<boolean>(
            'quantityAlwaysShownEnabled'
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

      useInspiration: {
        options: {
          name: 'T5EK.Settings.UseInspiration.name',
          hint: 'T5EK.Settings.UseInspiration.hint',
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useInspiration');
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<'default' | 'unlinked' | 'both'>(
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
          return FoundryAdapter.getTidySetting<boolean>('activeEffectsMarker');
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
          return FoundryAdapter.getTidySetting<number>('playerSheetWidth');
        },
      },

      // Default width for NPC sheet

      npcSheetWidth: {
        options: {
          name: 'T5EK.Settings.npcSheetWidth',
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getTidySetting<number>('npcSheetWidth');
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<number>('vehicleSheetWidth');
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          return FoundryAdapter.getTidySetting<boolean>(
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
          hint: 'T5EK.Settings.ColorPickerPrimaryAccent.hint',
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
          hint: 'T5EK.Settings.ColorPickerHpBar.hint',
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
          hint: 'T5EK.Settings.ColorPickerEquipped.hint',
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>('colorPickerPrepared');
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>('colorPickerPact');
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>('colorPickerPactAccent');
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
          return FoundryAdapter.getTidySetting<string>('colorPickerAtWill');
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>('colorPickerInnate');
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>(
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
          return FoundryAdapter.getTidySetting<string>(
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

  SettingsProvider.settings.colorScheme.options.onChange(
    SettingsProvider.settings.colorScheme.get()
  );

  settingStore = writable(getCurrentSettings());

  FoundryAdapter.hooksOn('closeSettingsConfig', () => {
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
