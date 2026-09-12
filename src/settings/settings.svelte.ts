import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import type { GetFunctionReturnType } from 'src/types/types';
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
          name: `TIDY5E.SETTINGS.Menu.TidySettings.name`,
          label: 'TIDY5E.SETTINGS.Menu.TidySettings.label',
          hint: `TIDY5E.SETTINGS.Menu.TidySettings.hint`,
          icon: 'fa-solid fa-swatchbook',
          type: WorldSettingsQuadroneApplication,
          restricted: true,
        },
      },
      makeAllSheetsTidy: {
        options: {
          name: `TIDY5E.SETTINGS.Menu.Defaults.name`,
          label: 'TIDY5E.SETTINGS.Menu.Defaults.label',
          hint: `TIDY5E.SETTINGS.Menu.Defaults.hint`,
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
          name: 'TIDY5E.SETTINGS.Option.Interaction.ContextMenu.name',
          hint: 'TIDY5E.SETTINGS.Option.Interaction.ContextMenu.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.hint',
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
          name: 'TIDY5E.SETTINGS.Menu.HeaderControls.name',
          hint: 'TIDY5E.SETTINGS.Menu.HeaderControls.hint',
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
          name: 'TIDY5E.SETTINGS.Menu.Tabs.name',
          hint: 'TIDY5E.SETTINGS.Menu.Tabs.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Security.GroupSheetMembers.name',
          hint: 'TIDY5E.SETTINGS.Option.Security.GroupSheetMembers.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.DefaultTabs.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.DefaultDeathSaveRoll.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.DefaultDeathSaveRoll.hint',
          scope: 'world',
          config: true,
          default: 'public',
          type: String,
          choices: CONFIG.ChatMessage.modes,
        },
        get() {
          return FoundryAdapter.getTidySetting<string>('defaultDeathSaveRoll');
        },
      },

      actionListLimitActionsToCantrips: {
        options: {
          name: 'TIDY5E.SETTINGS.Option.ActionList.LimitToCantrips.name',
          hint: 'TIDY5E.SETTINGS.Option.ActionList.LimitToCantrips.hint',
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
          name: 'TIDY5E.SETTINGS.Option.ActionList.IncludeMinuteLongSpells.name',
          hint: 'TIDY5E.SETTINGS.Option.ActionList.IncludeMinuteLongSpells.hint',
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
          name: 'TIDY5E.SETTINGS.Option.ActionList.IncludeSpellsWithActiveEffects.name',
          hint: 'TIDY5E.SETTINGS.Option.ActionList.IncludeSpellsWithActiveEffects.hint',
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
          name: 'TIDY5E.SETTINGS.Option.ActionList.IncludeConsumables.name',
          hint: 'TIDY5E.SETTINGS.Option.ActionList.IncludeConsumables.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Item.IdentificationPermission.name',
          hint: 'TIDY5E.SETTINGS.Option.Item.IdentificationPermission.hint',
          scope: 'world',
          type: String,
          default: CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS,
          config: true,
          choices: {
            [CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS]:
              'TIDY5E.SETTINGS.Option.Item.IdentificationPermission.option.GmAndOwners',
            [CONSTANTS.SHEET_SETTINGS_OPTION_GM_ONLY]:
              'TIDY5E.SETTINGS.Option.Item.IdentificationPermission.option.GmOnly',
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
          name: 'TIDY5E.SETTINGS.Option.Spells.IncludeFlagsInScrollCreation.name',
          hint: 'TIDY5E.SETTINGS.Option.Spells.IncludeFlagsInScrollCreation.hint',
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
          name: 'TIDY5E.SETTINGS.Theme.Menu.buttonLabel',
          hint: 'TIDY5E.SETTINGS.Theme.Hint',
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
          name: 'TIDY5E.SETTINGS.Option.Section.GlobalCustom.name',
          hint: 'TIDY5E.SETTINGS.Option.Section.GlobalCustom.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.InlineActivitiesPosition.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.InlineActivitiesPosition.hint',
          scope: 'client',
          config: true,
          default: CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP,
          type: String,
          choices: {
            [CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP]:
              'TIDY5E.SETTINGS.Option.Sheet.InlineActivitiesPosition.option.top',
            [CONSTANTS.INLINE_ACTIVITIES_POSITION_BOTTOM]:
              'TIDY5E.SETTINGS.Option.Sheet.InlineActivitiesPosition.option.bottom',
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
          name: 'TIDY5E.SETTINGS.Option.Inspiration.Banked.Enable.name',
          hint: 'TIDY5E.SETTINGS.Option.Inspiration.Banked.Enable.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Inspiration.Banked.GmOnly.name',
          hint: 'TIDY5E.SETTINGS.Option.Inspiration.Banked.GmOnly.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Sheet.SwapAbilityScoreAndBonus.name',
          hint: 'TIDY5E.SETTINGS.Option.Sheet.SwapAbilityScoreAndBonus.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Section.CharacterTabOrganization.name',
          hint: 'TIDY5E.SETTINGS.Option.Section.CharacterTabOrganization.hint',
          scope: 'world',
          config: true,
          type: String,
          choices: {
            [CONSTANTS.SECTION_ORGANIZATION_ORIGIN]:
              'TIDY5E.SETTINGS.Option.Section.CharacterTabOrganization.option.origin',
            [CONSTANTS.SECTION_ORGANIZATION_ACTION]:
              'TIDY5E.SETTINGS.Option.Section.CharacterTabOrganization.option.action',
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
          name: 'TIDY5E.SETTINGS.Option.Section.CharacterTabIncludeUsableItems.name',
          hint: 'TIDY5E.SETTINGS.Option.Section.CharacterTabIncludeUsableItems.hint',
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
          name: 'TIDY5E.SETTINGS.Option.Tooltip.Condition.name',
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
          name: 'TIDY5E.SETTINGS.Option.Tooltip.CreatureType.name',
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
          name: 'TIDY5E.SETTINGS.Option.Tooltip.Skill.name',
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
          name: 'TIDY5E.SETTINGS.Option.Tooltip.Tool.name',
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
          name: 'TIDY5E.SETTINGS.Option.Tooltip.Mastery.name',
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
          name: `TIDY5E.SETTINGS.Option.Debug.name`,
          hint: `TIDY5E.SETTINGS.Option.Debug.hint`,
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

  // Register before init-time reads
  registerSetting('truesight', SettingsProvider.settings.truesight);

  const initRegisteredKeys = new Set(['truesight']);

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
