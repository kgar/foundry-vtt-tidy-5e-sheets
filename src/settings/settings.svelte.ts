import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import type { GetFunctionReturnType } from 'src/types/types';
import type { ExhaustionConfig } from '../features/exhaustion/exhaustion.types';
import { getDefaultExhaustionConfig } from 'src/features/exhaustion/exhaustion';
import type {
  GlobalCustomSectionsetting,
  HeaderControlConfiguration,
  TabConfiguration,
} from './settings.types';
import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import type { TrackedTabs } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import {
  HeaderControlConfigurationSchema,
  TabConfigurationSchema,
} from './settings-data-models';
import { WorldSettingsQuadroneApplication } from 'src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte';
import { MakeAllSheetsTidyDialog } from './MakeAllSheetsTidyDialog';
import { SettingsShims } from './settings-shims';

export type Tidy5eSettings = {
  [settingKey: string]: Tidy5eSetting;
};

/** Any Foundry Core Settings that are relevant to Tidy and need cached access. */
export type FoundryCoreSettings = {
  fontSizePx: number;
  performanceMode: number;
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
    SettingsProvider.settings,
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
    scope: 'world' | 'client' | 'user';
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
  debugOnly?: boolean;
};

/**
 * The current Tidy 5e settings.
 */
let _settings: CurrentSettings = $state()!; // For ergonomics, pretend like this is never undefined, because it is initialized in the hooks lifecycle.
let _foundryCoreSettings: FoundryCoreSettings = $state({
  fontSizePx: 16,
  performanceMode: 2, // 2 - High is the default until we know better
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
          name: `TIDY5E.SettingsMenu.TidySettings.name`,
          label: 'TIDY5E.SettingsMenu.TidySettings.label',
          hint: `TIDY5E.SettingsMenu.TidySettings.hint`,
          icon: 'fa-solid fa-swatchbook',
          type: WorldSettingsQuadroneApplication,
          restricted: true,
        },
      },
      makeAllSheetsTidy: {
        options: {
          name: `TIDY5E.SettingsMenu.Defaults.name`,
          label: 'TIDY5E.SettingsMenu.Defaults.label',
          hint: `TIDY5E.SettingsMenu.Defaults.hint`,
          icon: 'fa-solid fa-scroll',
          type: MakeAllSheetsTidyDialog,
          restricted: true,
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
            'notifications',
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
            'migrationsConfirmationTally',
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
            'defaultCharacterSheetTabs',
          );
        },
      },

      headerControlConfiguration: {
        options: {
          name: 'TIDY5E.SettingsMenu.HeaderControlConfiguration.name',
          hint: 'TIDY5E.SettingsMenu.HeaderControlConfiguration.hint',
          scope: 'world',
          config: false,
          type: new foundry.data.fields.TypedObjectField(
            new foundry.data.fields.TypedObjectField(
              HeaderControlConfigurationSchema,
              { initial: {} },
              {
                name: 'Document Type to Header Control Configuration Object',
              },
            ),
            { initial: {} },
            {
              name: 'Document Names to Document Type Header Control Configuration Object',
            },
          ),
          default: {},
        },
        get() {
          return FoundryAdapter.getTidySetting<HeaderControlConfiguration>(
            'headerControlConfiguration',
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
              TabConfigurationSchema,
              { initial: {} },
              {
                name: 'Document Type to Tab Configuration Object',
              },
            ),
            { initial: {} },
            {
              name: 'Document Names to Document Type Tab Configuration Object',
            },
          ),
          default: {},
        },
        get() {
          const setting =
            FoundryAdapter.getTidySetting<Partial<TabConfiguration>>(
              'tabConfiguration',
            );

          return SettingsShims.tabConfiguration(setting);
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

      defaultGroupSheetTabs: {
        options: {
          name: 'TIDY5E.Settings.DefaultSheetTabs.name',
          hint: 'TIDY5E.Settings.DefaultSheetTabs.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [
            CONSTANTS.TAB_MEMBERS,
            CONSTANTS.TAB_ACTOR_INVENTORY,
            CONSTANTS.TAB_DESCRIPTION,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>(
            'defaultGroupSheetTabs',
          );
        },
      },

      useGroupSheetMemberSecurity: {
        options: {
          name: 'TIDY5E.Settings.UseGroupSheetMemberSecurity.name',
          hint: 'TIDY5E.Settings.UseGroupSheetMemberSecurity.hint',
          scope: 'world',
          type: Boolean,
          config: true,
          default: false,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'useGroupSheetMemberSecurity',
          );
        },
      },

      defaultEncounterSheetTabs: {
        options: {
          name: 'TIDY5E.Settings.DefaultSheetTabs.name',
          hint: 'TIDY5E.Settings.DefaultSheetTabs.hint',
          scope: 'world',
          config: false,
          type: Array,
          default: [
            CONSTANTS.TAB_MEMBERS,
            CONSTANTS.TAB_ACTOR_INVENTORY,
            CONSTANTS.TAB_DESCRIPTION,
          ],
        },
        get() {
          return FoundryAdapter.getTidySetting<string[]>(
            'defaultEncounterSheetTabs',
          );
        },
      },

      defaultDeathSaveRoll: {
        options: {
          name: 'TIDY5E.Settings.DefaultDeathSaveRoll.name',
          hint: 'TIDY5E.Settings.DefaultDeathSaveRoll.hint',
          scope: 'world',
          config: true,
          default:
            game.release.generation < 14
              ? CONST.DICE_ROLL_MODES.PUBLIC
              : 'public',
          type: String,
          choices:
            game.release.generation < 14
              ? {
                  [CONST.DICE_ROLL_MODES.PUBLIC]: 'CHAT.RollPublic',
                  [CONST.DICE_ROLL_MODES.PRIVATE]: 'CHAT.RollPrivate',
                  [CONST.DICE_ROLL_MODES.BLIND]: 'CHAT.RollBlind',
                  [CONST.DICE_ROLL_MODES.SELF]: 'CHAT.RollSelf',
                }
              : CONFIG.ChatMessage.modes,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('defaultDeathSaveRoll');
        },
      },

      actionListLimitActionsToCantrips: {
        options: {
          name: 'TIDY5E.Settings.ActionListLimitActionsToCantrips.name',
          hint: 'TIDY5E.Settings.ActionListLimitActionsToCantrips.hint',
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListLimitActionsToCantrips',
          );
        },
      },

      actionListIncludeMinuteLongSpellsAsActions: {
        options: {
          name: 'TIDY5E.Settings.ActionListIncludeMinuteLongSpellsAsActions.name',
          hint: 'TIDY5E.Settings.ActionListIncludeMinuteLongSpellsAsActions.hint',
          scope: 'client',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListIncludeMinuteLongSpellsAsActions',
          );
        },
      },

      actionListIncludeSpellsWithActiveEffects: {
        options: {
          name: 'TIDY5E.Settings.ActionListIncludeSpellsWithActiveEffects.name',
          hint: 'TIDY5E.Settings.ActionListIncludeSpellsWithActiveEffects.hint',
          scope: 'client',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListIncludeSpellsWithActiveEffects',
          );
        },
      },

      actionListIncludeConsumables: {
        options: {
          name: 'TIDY5E.Settings.ActionListIncludeConsumables.name',
          hint: 'TIDY5E.Settings.ActionListIncludeConsumables.hint',
          scope: 'client',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'actionListIncludeConsumables',
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
          config: true,
          choices: {
            [CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS]:
              'TIDY5E.WorldSettings.ItemIdentificationPermission.options.GmAndOwners',
            [CONSTANTS.SHEET_SETTINGS_OPTION_GM_ONLY]:
              'TIDY5E.WorldSettings.ItemIdentificationPermission.options.GmOnly',
          },
        },
        get() {
          return FoundryAdapter.getTidySetting<string>(
            'itemIdentificationPermission',
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
          config: true,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'includeFlagsInSpellScrollCreation',
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
          onChange: (settings: ThemeSettingsV3) => {
            ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
              settingsOverride: settings,
            });
          },
        },
        get() {
          return (
            FoundryAdapter.getTidySetting<ThemeSettingsV3>(
              'worldThemeSettings',
            ) ?? ThemeQuadrone.getDefaultThemeSettings()
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
          config: true,
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
            'inlineActivitiesPosition',
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
            'enableBankedInspiration',
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
            'bankedInspirationGmOnly',
          );
        },
      },
      swapAbilityScoreAndBonus: {
        options: {
          name: 'TIDY5E.Settings.SwapAbilityScoreAndBonus.name',
          hint: 'TIDY5E.Settings.SwapAbilityScoreAndBonus.hint',
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'swapAbilityScoreAndBonus',
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
            'sectionExpansionState',
          );
        },
      },
      characterSheetTabOrganization: {
        options: {
          name: 'TIDY5E.Settings.CharacterSheetTabSectionOrganization.name',
          hint: 'TIDY5E.Settings.CharacterSheetTabSectionOrganization.hint',
          scope: 'world',
          config: true,
          type: String,
          choices: {
            [CONSTANTS.SECTION_ORGANIZATION_ORIGIN]:
              'TIDY5E.Settings.CharacterSheetTabSectionOrganization.option.origin',
            [CONSTANTS.SECTION_ORGANIZATION_ACTION]:
              'TIDY5E.Settings.CharacterSheetTabSectionOrganization.option.action',
          },
          default: CONSTANTS.SECTION_ORGANIZATION_ORIGIN,
        },
        get() {
          return FoundryAdapter.getTidySetting<
            | typeof CONSTANTS.SECTION_ORGANIZATION_ACTION
            | typeof CONSTANTS.SECTION_ORGANIZATION_ORIGIN
          >('characterSheetTabOrganization');
        },
      },

      characterSheetTabAutomaticallyIncludeUsableItems: {
        options: {
          name: 'TIDY5E.Settings.CharacterSheetTabAutomaticallyIncludeUsableItems.name',
          hint: 'TIDY5E.Settings.CharacterSheetTabAutomaticallyIncludeUsableItems.hint',
          scope: 'world',
          config: true,
          type: Boolean,
          default: true,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'characterSheetTabAutomaticallyIncludeUsableItems',
          );
        },
      },

      referenceTooltipCondition: {
        options: {
          name: 'TIDY5E.Settings.ShowTooltipCondition.name',
          scope: 'user',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'referenceTooltipCondition',
          );
        },
      },
      referenceTooltipCreatureType: {
        options: {
          name: 'TIDY5E.Settings.ShowTooltipCreatureType.name',
          scope: 'user',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'referenceTooltipCreatureType',
          );
        },
      },
      referenceTooltipSkill: {
        options: {
          name: 'TIDY5E.Settings.ShowTooltipSkill.name',
          scope: 'user',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'referenceTooltipSkill',
          );
        },
      },
      referenceTooltipTool: {
        options: {
          name: 'TIDY5E.Settings.ShowTooltipTool.name',
          scope: 'user',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('referenceTooltipTool');
        },
      },
      referenceTooltipMastery: {
        options: {
          name: 'TIDY5E.Settings.ShowTooltipMastery.name',
          scope: 'user',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>(
            'referenceTooltipMastery',
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

      performanceMode: {
        options: {
          name: 'Performance Mode',
          hint: "Disable all Tidy sheet transition animations and drop shadows. Turning off Foundry's Performance Mode or Animation Duration settings will also modify this setting. (This currently only works when Debug is enabled.)",
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getTidySetting<boolean>('performanceMode');
        },
        debugOnly: true,
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
    document.documentElement.style.fontSize,
  );
  _foundryCoreSettings.performanceMode = game.settings.get(
    'core',
    'performanceMode',
  );
}

function refreshSystemSettings() {
  _systemSettings.currencyWeight = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_CURRENCY_WEIGHT,
  );
  _systemSettings.bastionConfiguration = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_BASTION_CONFIGURATION,
  );
  _systemSettings.levelingMode = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_LEVELING_MODE,
  );
  _systemSettings.defaultSkills = FoundryAdapter.getSystemSetting(
    CONSTANTS.SYSTEM_SETTING_DEFAULT_SKILLS,
  );
}

export let SettingsProvider: ReturnType<typeof createSettings>;

export type Tidy5eSheetsPerformanceClassToggles = [string, boolean][];

export function usePerformanceMode(): boolean {
  return (
    (SettingsProvider.settings.debug.get() &&
      SettingsProvider.settings.performanceMode.get()) ||
    foundryCoreSettings.value.performanceMode === 0
  );
}

export function getTidyPerformanceSettings(): Tidy5eSheetsPerformanceClassToggles {
  const performanceModeEnabled = usePerformanceMode();

  return [
    ['disable-shadows', performanceModeEnabled],
    ['disable-transitions', performanceModeEnabled],
  ];
}

export function initSettings() {
  SettingsProvider = createSettings();

  const debouncedSettingStoreRefresh = FoundryAdapter.debounce(() => {
    _settings = getCurrentSettings();
  }, 100);

  const registerSetting = (
    key: string,
    setting: Tidy5eSetting,
    overrides: Record<string, unknown> = {},
  ) => {
    const options = {
      ...setting.options,
      ...overrides,
      onChange: (...args: any[]) => {
        debouncedSettingStoreRefresh();

        (setting.options as any).onChange?.(...args);
      },
    };
    FoundryAdapter.registerTidySetting(key, options);
  };

  // Register before init-time reads (used to filter menus and classic-only config).
  registerSetting('truesight', SettingsProvider.settings.truesight);

  const initRegisteredKeys = new Set(['hideClassic', 'truesight']);

  for (let setting of Object.entries(SettingsProvider.settings).filter(
    (x: [string, Tidy5eSetting]) =>
      !x[1].debugOnly && !initRegisteredKeys.has(x[0]),
  )) {
    const options = {
      ...setting[1].options,
      onChange: (...args: any[]) => {
        debouncedSettingStoreRefresh();

        (setting[1].options as any).onChange?.(...args);
      },
    };
    FoundryAdapter.registerTidySetting(setting[0], options);
  }

  const debug = SettingsProvider.settings.debug.get();

  for (let setting of Object.entries(SettingsProvider.settings).filter(
    (x: [string, Tidy5eSetting]) => x[1].debugOnly,
  )) {
    const options = {
      ...setting[1].options,
      config: debug,
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

  Hooks.on('userSettingChanged', () => {
    refreshFoundryCoreSettings();
    refreshSystemSettings();
  });

  Hooks.on('worldSettingChanged', () => {
    refreshFoundryCoreSettings();
    refreshSystemSettings();
  });

  Hooks.on('updateSetting', () => {
    refreshFoundryCoreSettings();
    refreshSystemSettings();
  });
}
