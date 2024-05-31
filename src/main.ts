import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { SettingsProvider, initSettings } from './settings/settings';
import { Tidy5eKgarItemSheet } from './sheets/Tidy5eItemSheet';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntime } from './runtime/runtime-init';
import MigrationNotificationFormApplication from 'src/migrations/notification/MigrationNotificationFormApplication';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { Tidy5eKgarContainerSheet } from './sheets/Tidy5eContainerSheet';
import { setupModuleIntegrations } from './integration/integration';

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eCharacterSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_CHARACTER],
      label: 'TIDY5E.Tidy5eSheet',
    }
  );

  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eNpcSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_NPC],
      label: 'TIDY5E.Tidy5eNPC',
    }
  );

  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eVehicleSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_VEHICLE],
      label: 'TIDY5E.Tidy5eVehicle',
    }
  );

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eKgarItemSheet,
    {
      types: [
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_CONSUMABLE,
        CONSTANTS.ITEM_TYPE_EQUIPMENT,
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_LOOT,
        CONSTANTS.ITEM_TYPE_RACE,
        CONSTANTS.ITEM_TYPE_SPELL,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
        CONSTANTS.ITEM_TYPE_TOOL,
        CONSTANTS.ITEM_TYPE_WEAPON,
      ],
      label: 'TIDY5E.Tidy5eItemSheet',
    }
  );

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eKgarContainerSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_CONTAINER],
      label: 'TIDY5E.Tidy5eContainerSheet',
    }
  );

  initSettings();
  initRuntime();
});

Hooks.once('ready', async () => {
  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi._getApi();
  tidy5eModule.api = api;

  Hooks.callAll(CONSTANTS.HOOK_TIDY5E_SHEETS_READY, api);

  setupModuleIntegrations(api);

  if (
    FoundryAdapter.userIsGm() &&
    SettingsProvider.settings.migrationsConfirmationTally.get() < MigrationTally
  ) {
    new MigrationNotificationFormApplication().render(true);
  }
});
