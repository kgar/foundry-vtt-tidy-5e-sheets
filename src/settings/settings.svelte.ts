import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { ResetSettingsDialog } from './ResetSettingsDialog';
import type { GetFunctionReturnType } from 'src/types/types';
import { UserSettingsFormApplication } from 'src/applications/settings/user-settings/UserSettingsFormApplication.svelte';
import { WorldSettingsFormApplication } from 'src/applications/settings/world-settings/WorldSettingsFormApplication.svelte';
import { ThemeSettingsFormApplication } from 'src/applications/theme/ThemeSettingsFormApplication.svelte';
import type { ExhaustionConfig } from '../features/exhaustion/exhaustion.types';
import CharacterSheetClassicRuntime from 'src/runtime/actor/CharacterSheetClassicRuntime.svelte';
import { TabManager } from 'src/runtime/tab/TabManager';
import { BulkMigrationsApplication } from 'src/migrations/BulkMigrationsApplication';
import { AboutApplication } from 'src/applications/settings/about/AboutApplication';
import { ApplyTidySheetPreferencesApplication } from 'src/applications/sheet-preferences/ApplyTidySheetPreferencesApplication.svelte';
import { getDefaultExhaustionConfig } from 'src/features/exhaustion/exhaustion';
import type {
  GlobalCustomSectionsetting,
  TabConfiguration,
} from './settings.types';
import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime.svelte';
import VehicleSheetClassicRuntime from 'src/runtime/actor/VehicleSheetClassicRuntime.svelte';
import { applyCurrentThemeClassic } from 'src/theme/theme';
import type { ThemeSettingsV2 } from 'src/theme/theme-quadrone.types';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { WorldTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/WorldTabConfigurationQuadroneApplication.svelte';
import { HomebrewSettingsApplication } from 'src/applications/homebrew-settings/HomebrewSettingsApplication.svelte';
import type { TrackedTabs } from 'src/features/expand-collapse/ExpansionTracker.svelte';

export type Tidy5eSettings = {
  [settingKey: string]: Tidy5eSetting;
};

/** Any Foundry Core Settings that are relevant to Tidy and need cached access. */
export type FoundryCoreSettings = {
  fontSizePx: number;
};

/** Any D&D 5E System Settings that are relevant to Tidy and need cached access. */
export type Dnd5eSystemSettings = {
  defaultSkills: string[];
  levelingMode: string;
  bastionConfiguration: {
    button: boolean;
    duration: number;
    enabled: boolean;
  };
  currencyWeight: boolean;
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
    default?: any;
    /**
     * Executes when the value of this Setting changes
     * @param data the new value
     */
    onChange?: (data: any) => void;

    /**
     * Prompts a reload if the setting is changed.
     */
    requiresReload?: boolean;
  };
  get: () => any;
  /**
   * Denotes which CSS Variable is represented by the target setting. Used for color picking.
   */
  representsCssVariable?: string;
};

/**
 * The current Tidy 5e settings.
 */
let _settings: CurrentSettings = $state()!; // For ergonomics, pretend like this is never undefined, because it is initialized in the hooks lifecycle.
let _foundryCoreSettings: FoundryCoreSettings = $state({
  fontSizePx: 16,
});
let _systemSettings: Dnd5eSystemSettings = $state({
  currencyWeight: false,
  bastionConfiguration: {
    button: false,
    duration: 0,
    enabled: false,
  },
  defaultSkills: [],
  levelingMode: '',
} satisfies Dnd5eSystemSettings);

export const settings = {
  get value() {
    return _settings;
  },
};

export const foundryCoreSettings = {
  get value() {
    return _foundryCoreSettings;
  },
};

export const systemSettings = {
  get value() {
    return _systemSettings;
  },
};

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
          name: `TIDY5E.UserSettings.Menu.name`,
          label: 'TIDY5E.UserSettings.Menu.label',
          hint: `TIDY5E.UserSettings.Menu.hint`,
          icon: 'fa-solid fa-user-gear',
          type: UserSettingsFormApplication,
          restricted: false,
        },
      },
      theme: {
        options: {
          name: `TIDY5E.ThemeSettings.SheetMenu.name`,
          label: 'TIDY5E.ThemeSettings.SheetMenu.buttonLabel',
          hint: `TIDY5E.ThemeSettings.SheetMenu.hint`,
          icon: 'fa-solid fa-swatchbook',
          type: ThemeSettingsFormApplication,
          restricted: false,
        },
      },
      worldThemeSettingsMenu: {
        options: {
          name: `TIDY5E.SettingsMenu.WorldThemeSettings.name`,
          label: 'TIDY5E.SettingsMenu.WorldThemeSettings.label',
          hint: `TIDY5E.SettingsMenu.WorldThemeSettings.hint`,
          icon: 'fa-solid fa-swatchbook',
          type: ThemeSettingsQuadroneApplication,
          restricted: true,
        },
      },
      tabConfigurationMenu: {
        options: {
          name: `TIDY5E.SettingsMenu.TabConfiguration.name`,
          label: 'TIDY5E.SettingsMenu.TabConfiguration.label',
          hint: `TIDY5E.SettingsMenu.TabConfiguration.hint`,
          icon: 'fa-solid fa-table-columns',
          type: WorldTabConfigurationQuadroneApplication,
          restricted: true,
        },
      },
      homebrew: {
        options: {
          name: `TIDY5E.SettingsMenu.Homebrew.name`,
          label: `TIDY5E.SettingsMenu.Homebrew.label`,
          hint: `TIDY5E.SettingsMenu.Homebrew.hint`,
          icon: `fa-solid fa-beer-mug`,
          type: HomebrewSettingsApplication,
          restricted: true,
        },
      },
      resetAllSettings: {
        options: {
          name: `TIDY5E.Settings.Reset.name`,
          hint: `TIDY5E.Settings.Reset.hint`,
          icon: 'fa-solid fa-broom-wide',
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
          type: BulkMigrationsApplication,
          restricted: true,
        },
      },
      applyTidySheetPreferences: {
        options: {
          name: `TIDY5E.Settings.SheetPreferences.name`,
          label: 'TIDY5E.Settings.SheetPreferences.buttonLabel',
          hint: `TIDY5E.Settings.SheetPreferences.hint`,
          icon: 'fa-solid fa-file-circle-check',
          type: ApplyTidySheetPreferencesApplication,
          restricted: true,
        },
      },
      about: {
        options: {
          name: `TIDY5E.Settings.About.name`,
          label: 'TIDY5E.Settings.About.buttonLabel',
          hint: `TIDY5E.Settings.About.hint`,
          icon: 'fa-solid fa-block-question',
          type: AboutApplication,
          restricted: false,
        },
      },
    },
    settings: {
      notifications: {
        options: {
          name: 'Tidy Notifications Tracker',
          hint: '',
          scope: 'world',
          config: false,
          type: Object,
          default: {},
        },
        get() {
          return FoundryAdapter.getTidySetting<Record<string, boolean>>(
            'notifications'
          );
        },
      },

      migrationsConfirmationTally: {
        options: {
          name: 'Migrations Confirmation Tally',
          hint: 'Developer Only: This field tells the developer when was the last time the GM indicated "Do Not Show Again" for a migration notification. This is so Tidy does not notify of migrations until a new migration has become available. A migration tick counter increments each release where a migration has become available.',
          scope: 'world',
          config: false,
          type: Number,
          default: 0,
        },
        get() {
          return FoundryAdapter.getTidySetting<number>(
            'migrationsConfirmationTally'
          );
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
              CharacterSheetClassicRuntime.getAllRegisteredTabs()
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
            CONSTANTS.TAB_ACTOR_INVENTORY,
            CONSTANTS.TAB_ACTOR_SPELLBOOK,
            CONSTANTS.TAB_CHARACTER_FEATURES,
            CONSTANTS.TAB_EFFECTS,
            CONSTANTS.TAB_ACTOR_BIOGRAPHY,
            CONSTANTS.TAB_CHARACTER_JOURNAL,
            CONSTANTS.TAB_CHARACTER_BASTION,
            CONSTANTS.TAB_ACTOR_SPECIAL_TRAITS,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>(
            'defaultCharacterSheetTabs'
          );
        },
      },

      tabConfiguration: {
        options: {
          name: 'TIDY5E.SettingsMenu.TabConfiguration.name',
          hint: 'TIDY5E.SettingsMenu.TabConfiguration.hint',
          scope: 'world',
          config: false,
          type: new foundry.data.fields.TypedObjectField(
            new foundry.data.fields.TypedObjectField(
              new foundry.data.fields.SchemaField(
                {
                  selected: new foundry.data.fields.ArrayField(
                    new foundry.data.fields.StringField({
                      required: true,
                      nullable: false,
                      blank: false,
                    })
                  ),
                },
                { initial: [] },
                { name: 'Tab Configuration' }
              ),
              { initial: {} },
              {
                name: 'Document Type to Tab Configuration Object',
              }
            ),
            { initial: {} },
            { name: 'Document Names to Document Type Tab Configuration Object' }
          ),
          default: {},
        },
        get() {
          return FoundryAdapter.getTidySetting<TabConfiguration>(
            'tabConfiguration'
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

      // Info Cards
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

      useEffectCards: {
        options: {
          name: 'TIDY5E.Settings.UseEffectCards.name',
          hint: 'TIDY5E.Settings.UseEffectCards.hint',
          scope: 'client',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('useEffectCards');
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
          name: 'TIDY5E.Settings.InfoCardsInspectKey.name',
          hint: 'TIDY5E.Settings.InfoCardsInspectKey.hint',
          scope: 'world',
          config: false,
          default: 't',
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

      moveCharacterTraitsToRightOfSkills: {
        options: {
          name: 'TIDY5E.Settings.MoveTraitsToRightOfSkills.name',
          hint: 'TIDY5E.Settings.MoveTraitsToRightOfSkills.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'moveCharacterTraitsToRightOfSkills'
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

      initialNpcSheetTab: {
        options: {
          name: 'TIDY5E.Settings.InitialSheetTab.name',
          hint: 'TIDY5E.Settings.InitialSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            TabManager.getTabsAsConfigOptions(
              NpcSheetClassicRuntime.getAllRegisteredTabs()
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
            CONSTANTS.TAB_ACTOR_INVENTORY,
            CONSTANTS.TAB_ACTOR_SPELLBOOK,
            CONSTANTS.TAB_EFFECTS,
            CONSTANTS.TAB_ACTOR_BIOGRAPHY,
            CONSTANTS.TAB_ACTOR_SPECIAL_TRAITS,
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

      moveNpcTraitsToRightOfSkills: {
        options: {
          name: 'TIDY5E.Settings.MoveTraitsToRightOfSkills.name',
          hint: 'TIDY5E.Settings.MoveTraitsToRightOfSkills.hint',
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'moveNpcTraitsToRightOfSkills'
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

      initialVehicleSheetTab: {
        options: {
          name: 'TIDY5E.Settings.InitialSheetTab.name',
          hint: 'TIDY5E.Settings.InitialSheetTab.hint',
          scope: 'world',
          config: false,
          type: String,
          choices: () =>
            TabManager.getTabsAsConfigOptions(
              VehicleSheetClassicRuntime.getAllRegisteredTabs()
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
            CONSTANTS.TAB_EFFECTS,
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

      defaultGroupSheetTabs: {
        options: {
          name: 'TIDY5E.Settings.DefaultSheetTabs.name',
          hint: 'TIDY5E.Settings.DefaultSheetTabs.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [
            CONSTANTS.TAB_GROUP_MEMBERS,
            CONSTANTS.TAB_ACTOR_INVENTORY,
            CONSTANTS.TAB_GROUP_DESCRIPTION,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>(
            'defaultGroupSheetTabs'
          );
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

      defaultDeathSaveRoll: {
        options: {
          name: 'TIDY5E.Settings.DefaultDeathSaveRoll.name',
          hint: 'TIDY5E.Settings.DefaultDeathSaveRoll.hint',
          scope: 'world',
          config: false,
          default: CONST.DICE_ROLL_MODES.PUBLIC,
          type: String,
          choices: {
            [CONST.DICE_ROLL_MODES.PUBLIC]: 'CHAT.RollPublic',
            [CONST.DICE_ROLL_MODES.PRIVATE]: 'CHAT.RollPrivate',
            [CONST.DICE_ROLL_MODES.BLIND]: 'CHAT.RollBlind',
            [CONST.DICE_ROLL_MODES.SELF]: 'CHAT.RollSelf',
          },
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('defaultDeathSaveRoll');
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

      exhaustionConfig: {
        options: {
          name: 'TIDY5E.WorldSettings.Exhaustion.name',
          hint: 'TIDY5E.WorldSettings.Exhaustion.hint',
          scope: 'world',
          config: false,
          default: getDefaultExhaustionConfig(),
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
          name: 'TIDY5E.WorldSettings.VehicleExhaustion.name',
          hint: 'TIDY5E.WorldSettings.VehicleExhaustion.hint',
          scope: 'world',
          config: false,
          default: getDefaultExhaustionConfig(),
          type: Object,
        },
        get() {
          return FoundryAdapter.getTidySetting<ExhaustionConfig>(
            'vehicleExhaustionConfig'
          );
        },
      },

      itemIdentificationPermission: {
        options: {
          name: 'TIDY5E.WorldSettings.ItemIdentificationPermission.name',
          hint: 'TIDY5E.WorldSettings.ItemIdentificationPermission.hint',
          scope: 'world',
          type: String,
          default: CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS,
          config: false,
          choices: {
            [CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS]:
              'TIDY5E.WorldSettings.ItemIdentificationPermission.options.GmAndOwners',
            [CONSTANTS.SHEET_SETTINGS_OPTION_GM_ONLY]:
              'TIDY5E.WorldSettings.ItemIdentificationPermission.options.GmOnly',
          },
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'itemIdentificationPermission'
          );
        },
      },

      includeFlagsInSpellScrollCreation: {
        options: {
          name: 'TIDY5E.WorldSettings.IncludeFlagsInSpellScrollCreation.name',
          hint: 'TIDY5E.WorldSettings.IncludeFlagsInSpellScrollCreation.hint',
          scope: 'world',
          type: Boolean,
          default: false,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'includeFlagsInSpellScrollCreation'
          );
        },
      },

      worldThemeSettings: {
        options: {
          name: 'TIDY5E.ThemeSettings.SheetMenu.buttonLabel',
          hint: 'TIDY5E.ThemeSettings.hint',
          scope: 'world',
          type: Object,
          default: undefined,
          config: false,
          onChange: (settings: ThemeSettingsV2) => {
            ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
              settingsOverride: settings,
            });
          },
        },
        get() {
          return (
            FoundryAdapter.getTidySetting<ThemeSettingsV2>(
              'worldThemeSettings'
            ) ?? ThemeQuadrone.getDefaultThemeSettings()
          );
        },
      },

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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerAtWillAccent'
          );
        },
        representsCssVariable: '--t5e-atwill-accent-color',
      },

      colorPickerRitualOnly: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerRitualOnly.name',
          scope: 'client',
          type: String,
          default: undefined,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('colorPickerRitualOnly');
        },
        representsCssVariable: '--t5e-ritual-only-background',
      },
      colorPickerRitualOnlyOutline: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerRitualOnlyOutline.name',
          scope: 'client',
          type: String,
          default: undefined,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerRitualOnlyOutline'
          );
        },
        representsCssVariable: '--t5e-ritual-only-outline-color',
      },
      colorPickerRitualOnlyAccent: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerRitualOnlyAccent.name',
          scope: 'client',
          type: String,
          default: undefined,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerRitualOnlyAccent'
          );
        },
        representsCssVariable: '--t5e-ritual-only-accent-color',
      },

      colorPickerInnate: {
        options: {
          name: 'TIDY5E.Settings.ColorPickerInnate.name',
          scope: 'client',
          type: String,
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
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
          default: undefined,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'colorPickerMagicAccent'
          );
        },
        representsCssVariable: '--t5e-magic-accent-color',
      },

      // Icons
      useTidySpellSchoolIcons: {
        options: {
          name: 'TIDY5E.Settings.UseTidySpellSchoolIcons.name',
          hint: 'TIDY5E.Settings.UseTidySpellSchoolIcons.hint',
          scope: 'world',
          type: Boolean,
          default: true,
          config: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useTidySpellSchoolIcons'
          );
        },
      },

      // Custom Sections
      globalCustomSections: {
        options: {
          name: 'TIDY5E.Settings.GlobalCustomSections.name',
          hint: 'TIDY5E.Settings.GlobalCustomSections.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [],
        },
        get() {
          return FoundryAdapter.getTidySetting<
            Partial<GlobalCustomSectionsetting>[]
          >('globalCustomSections').map((c) => ({
            section: '',
            showWhenEmptyFilters: {},
            showWhenEmpty: false,
            ...c,
          }));
        },
      },

      // Activities
      inlineActivitiesPosition: {
        options: {
          name: 'TIDY5E.Settings.InlineActivitiesPosition.name',
          hint: 'TIDY5E.Settings.InlineActivitiesPosition.hint',
          scope: 'client',
          config: false,
          default: CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP,
          type: String,
          choices: {
            [CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP]:
              'TIDY5E.Settings.InlineActivitiesPosition.top',
            [CONSTANTS.INLINE_ACTIVITIES_POSITION_BOTTOM]:
              'TIDY5E.Settings.InlineActivitiesPosition.bottom',
          },
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'inlineActivitiesPosition'
          );
        },
      },

      // Homebrew
      enableBankedInspiration: {
        options: {
          name: 'TIDY5E.Settings.EnableBankedInspiration.name',
          hint: 'TIDY5E.Settings.EnableBankedInspiration.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'enableBankedInspiration'
          );
        },
      },
      bankedInspirationGmOnly: {
        options: {
          name: 'TIDY5E.Settings.BankedInspirationGmOnly.name',
          hint: 'TIDY5E.Settings.BankedInspirationGmOnly.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'bankedInspirationGmOnly'
          );
        },
      },

      sectionExpansionState: {
        options: {
          name: 'Section expansion state',
          hint: 'Internal use only: Track the state of sections on any sheet with expandable/collapsible sections. This is an object mapping "{UUID}-{Location Section}" keys to full expansion tracking graphs.',
          scope: 'client',
          config: false,
          default: {},
          type: Object,
        },
        get() {
          return FoundryAdapter.getTidySetting<Record<string, TrackedTabs>>(
            'sectionExpansionState'
          );
        },
      },

      // Development and Troubleshooting
      debug: {
        options: {
          name: `TIDY5E.Settings.Debug.name`,
          hint: `TIDY5E.Settings.Debug.hint`,
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
          requiresReload: true,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('debug');
        },
      },

      truesight: {
        options: {
          name: 'Tidy 5e Truesight',
          hint: 'Grants the world the ability to see things which are still in development and not ready for the general public.',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
          requiresReload: true,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('truesight');
        },
      },
    } satisfies Tidy5eSettings,
  } as const;
}

function refreshFoundryCoreSettings() {
  _foundryCoreSettings.fontSizePx = parseFloat(
    document.documentElement.style.fontSize
  );
}

function refreshSystemSettings() {
  _systemSettings.currencyWeight = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_CURRENCY_WEIGHT
  );
  _systemSettings.bastionConfiguration = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_BASTION_CONFIGURATION
  );
  _systemSettings.levelingMode = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_LEVELING_MODE
  );
  _systemSettings.defaultSkills = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_DEFAULT_SKILLS
  );
}

export let SettingsProvider: ReturnType<typeof createSettings>;

export function initSettings() {
  SettingsProvider = createSettings();

  const debouncedSettingStoreRefresh = FoundryAdapter.debounce(() => {
    _settings = getCurrentSettings();
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

  const truesight = SettingsProvider.settings.truesight.get();

  for (let menu of Object.entries(SettingsProvider.menus)) {
    if ('truesight' in menu[1].options && !truesight) {
      continue;
    }

    FoundryAdapter.registerTidyMenu(menu[0], menu[1].options);
  }

  _settings = getCurrentSettings();

  applyCurrentThemeClassic();

  ThemeQuadrone.insertTidyThemeStyleTag();
  ThemeQuadrone.applyCurrentThemeSettingsToStylesheet();

  Hooks.on('closeSettingsConfig', () => {
    _settings = getCurrentSettings();
  });

  Hooks.once('ready', () => {
    refreshFoundryCoreSettings();
    refreshSystemSettings();
  });

  Hooks.on('clientSettingChanged', () => {
    refreshFoundryCoreSettings();
    refreshSystemSettings();
  });

  Hooks.on('updateSetting', () => {
    refreshFoundryCoreSettings();
    refreshSystemSettings();
  });
}
