import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/classic/Tidy5eCharacterSheet.svelte';
import './scss/tidy5e.scss';
import {
  SettingsProvider,
  initSettings,
  settings,
} from './settings/settings.svelte';
import { Tidy5eItemSheetClassic } from './sheets/classic/Tidy5eItemSheetClassic.svelte';
import { Tidy5eNpcSheet } from './sheets/classic/Tidy5eNpcSheet.svelte';
import { Tidy5eVehicleSheet } from './sheets/classic/Tidy5eKgarVehicleSheet.svelte';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntimeOnReady, initRuntime } from './runtime/runtime-init';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { setupIntegrations } from './integration/integration';
import { TidyHooks } from './foundry/TidyHooks';
import { initKeybindings } from './keybindings/keybind-init';
import { Tidy5eGroupSheetClassic } from './sheets/classic/Tidy5eGroupSheetClassic.svelte';
import { DebugTools } from './utils/DebugTools';
import { Tidy5eContainerSheetClassic } from './sheets/classic/Tidy5eContainerSheetClassic.svelte';
import { Tidy5eContainerSheetQuadrone } from './sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import { Tidy5eItemDebugSheetQuadrone } from './sheets/quadrone/Tidy5eItemDebugSheetQuadrone.svelte';
import { initReadyHooks } from './features/ready-hooks';
import '@melloware/coloris/dist/coloris.css';
import { debug } from './utils/logging';
import { Tidy5eItemSheetQuadrone } from './sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import { Tidy5eCharacterSheetQuadrone } from './sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import { Tidy5eNpcSheetQuadrone } from './sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import { ThemeQuadrone } from './theme/theme-quadrone.svelte';
import { TidyNotificationsManager } from './features/notifications/TidyNotificationsManager';

Hooks.once('init', () => {
  const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eCharacterSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_CHARACTER],
      label: 'TIDY5E.Tidy5eCharacterSheetClassic',
    }
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eNpcSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_NPC],
      label: 'TIDY5E.Tidy5eNpcSheetClassic',
    }
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eVehicleSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_VEHICLE],
      label: 'TIDY5E.Tidy5eVehicleSheetClassic',
    }
  );

  const supportedItemTypes = [
    CONSTANTS.ITEM_TYPE_BACKGROUND,
    CONSTANTS.ITEM_TYPE_CLASS,
    CONSTANTS.ITEM_TYPE_CONSUMABLE,
    CONSTANTS.ITEM_TYPE_EQUIPMENT,
    CONSTANTS.ITEM_TYPE_FACILITY,
    CONSTANTS.ITEM_TYPE_FEAT,
    CONSTANTS.ITEM_TYPE_LOOT,
    CONSTANTS.ITEM_TYPE_RACE,
    CONSTANTS.ITEM_TYPE_SPELL,
    CONSTANTS.ITEM_TYPE_SUBCLASS,
    CONSTANTS.ITEM_TYPE_TOOL,
    CONSTANTS.ITEM_TYPE_WEAPON,
  ];

  documentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eItemSheetClassic,
    {
      types: supportedItemTypes,
      label: 'TIDY5E.Tidy5eItemSheetClassic',
    }
  );

  documentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eContainerSheetClassic,
    {
      types: [CONSTANTS.SHEET_TYPE_CONTAINER],
      label: 'TIDY5E.Tidy5eContainerSheetClassic',
    }
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eGroupSheetClassic,
    {
      types: [CONSTANTS.SHEET_TYPE_GROUP],
      label: 'TIDY5E.Tidy5eGroupSheetClassic',
    }
  );

  initSettings();
  initRuntime();
  initKeybindings();

  const betaQuadroneItemTypes = [
    CONSTANTS.ITEM_TYPE_BACKGROUND,
    CONSTANTS.ITEM_TYPE_CLASS,
    CONSTANTS.ITEM_TYPE_CONSUMABLE,
    CONSTANTS.ITEM_TYPE_EQUIPMENT,
    CONSTANTS.ITEM_TYPE_FACILITY,
    CONSTANTS.ITEM_TYPE_FEAT,
    CONSTANTS.ITEM_TYPE_LOOT,
    CONSTANTS.ITEM_TYPE_RACE,
    CONSTANTS.ITEM_TYPE_SPELL,
    CONSTANTS.ITEM_TYPE_SUBCLASS,
    CONSTANTS.ITEM_TYPE_TOOL,
    CONSTANTS.ITEM_TYPE_WEAPON,
  ];

  documentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eItemSheetQuadrone,
    {
      types: betaQuadroneItemTypes,
      label: 'TIDY5E.Tidy5eItemSheetQuadrone',
    }
  );

  documentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eContainerSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_CONTAINER],
      label: 'TIDY5E.Tidy5eContainerSheetQuadrone',
    }
  );

  /* FOR THOSE WITH TRUE SIGHT */
  if (settings.value.truesight) {
    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eCharacterSheetQuadrone,
      {
        types: [CONSTANTS.SHEET_TYPE_CHARACTER],
        label: 'TIDY5E.Tidy5eCharacterSheetQuadrone',
      }
    );

    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eNpcSheetQuadrone,
      {
        types: [CONSTANTS.SHEET_TYPE_NPC],
        label: 'TIDY5E.Tidy5eNpcSheetQuadrone',
      }
    );

    documentSheetConfig.registerSheet(
      Item,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eItemDebugSheetQuadrone,
      {
        types: supportedItemTypes,
        label: 'Tidy 5e Debug Item Sheet (Visual Overhaul)',
      }
    );
  }
});

Hooks.once('ready', async () => {
  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi._getApi();
  tidy5eModule.api = api;

  initRuntimeOnReady();

  TidyHooks.tidy5eSheetsReady(api);

  setupIntegrations(api);

  handleMigrationNotification();

  initReadyHooks();

  DebugTools.onReady(api);

  ThemeQuadrone.onReady();

  if (settings.value.truesight) {
    TidyNotificationsManager.onReady();
  }
});

function handleMigrationNotification() {
  let tally = SettingsProvider.settings.migrationsConfirmationTally.get();

  if (FoundryAdapter.userIsGm() && tally === 0) {
    debug(
      'Skipping migration notification because this appears to be a new Tidy installation.'
    );
    tally = MigrationTally;
  }

  if (FoundryAdapter.userIsGm() && tally < MigrationTally) {
    let migrationNotification = {
      user: game.user._id,
      whisper: game.users.filter((u: any) => u.isGM).map((u: any) => u._id),
      content: `
      <h2>${game.i18n.localize('TIDY5E.ModuleName')}</h2>
      <p>
        ${game.i18n.localize('TIDY5E.Settings.Migrations.chatNotification')}
      </p>
      `,
    };

    ChatMessage.create(migrationNotification, {});

    FoundryAdapter.setTidySetting(
      'migrationsConfirmationTally',
      MigrationTally
    );
  }
}

// Add a new Skill
Hooks.once('init', () => {
  CONFIG.DND5E.skills.backflip = {
    label: 'Backflip',
    ability: 'dex',
    fullKey: 'backflip', // Full key used in enrichers
    reference: 'Compendium.my-Zmodule…', // UUID of journal entry page for rich tooltips
    icon: '…', // Icon used in favorites on new character sheet
  };
});

// Add a new Ability
Hooks.once("init", () => {
  CONFIG.DND5E.abilities.grt = {
    label: "Grit",
    abbreviation: "grt",
    fullKey: "grit", // Full key used in enrichers
    reference: "Compendium.my-module…", // UUID of journal entry page for rich tooltips
    type: "mental", // mental or physical
    improvement: false // Explicitly set this to 'false' to prevent it showing up for ASIs.
  };
});

// Adds a new "plasma" damage type that will be selectable as a new type of damage for weapons and a new type of resistance for actors.
Hooks.once("init", () => {
  CONFIG.DND5E.damageTypes.plasma = {
    label: "Plasma",      // The displayed name of the damage type
    isPhysical: true,     // Whether this is negated by adamantine/magical/silvered
    icon: "",             // An svg icon.
    color: new Color(0),  // The color of the damage type (currently unused).
    reference: ""         // A uuid of a journal entry rules page.
  };
});

// Adds a new "Laser" Weapon Property and Physical Property for resistance bypass
Hooks.once("init", () => {
  CONFIG.DND5E.itemProperties.laser = {
    label: "Laser",
    isPhysical: true
  };
  CONFIG.DND5E.validProperties.weapon.add("laser");
});

// Add a new Spell School that can be selected in Spell Items
Hooks.once("init", () => {
  CONFIG.DND5E.spellSchools.psionics = {
    label: "Psionics",
    icon: "…",
    fullKey: "psionics", // Full key used in enrichers
    reference: "" // UUID of journal entry page for rich tooltips
  };
});

// Adds a new "Blood Curse" class feature type
Hooks.once("init", () => {
  CONFIG.DND5E.featureTypes.class.subtypes.bloodCurse = "Blood Curse";
});

// Adds in a new feature type, similar to "Class Feature" called "Martial Exploit", with 3 different subtypes for it.
Hooks.once("init", () => {
  CONFIG.DND5E.featureTypes.marexploit = {
    label: "Martial Exploit",
    subtypes: {
      first: "1st-Degree",
      second: "2nd-Degree",
      third: "3rd-Degree"
    }
  };
});

// Add a new AC Calculation
Hooks.once("init", () => {
  CONFIG.DND5E.armorClasses.fortitude = {
    label: "Fortitude",
    formula: "13 + @abilities.con.mod"
  };
});

// Adds in options to display in the Activation Cost dropdown
Hooks.once("init", () => {
  CONFIG.DND5E.activityActivationTypes.crithit = {
    label: "Critical Hit",
    group: "DND5E.ACTIVATION.Category.Combat"
  };
  CONFIG.DND5E.activityActivationTypes.moon = {
    label: "Moons",
    group: "DND5E.ACTIVATION.Category.Time",
    scalar: true // Takes an associated number
  };
});

// Adds new Weapon types of Hand Cannon and Magnum
Hooks.once("init", () => {
  CONFIG.DND5E.weaponIds.handCannon = "uuid";
  CONFIG.DND5E.weaponIds.magnum = "uuid";
  // etc etc
});


// Adds new Tool Proficiency for Hacking Tools
Hooks.once("init", () => {
  CONFIG.DND5E.tools.hacking = {
    ability: "int",
    id: "uuid"
  };
});

