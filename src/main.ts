import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { SettingsProvider, initSettings } from './settings/settings';
import { Tidy5eItemSheetClassic } from './sheets/Tidy5eItemSheetClassic';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntime } from './runtime/runtime-init';
import MigrationNotificationFormApplication from 'src/migrations/notification/MigrationNotificationFormApplication';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { setupIntegrations } from './integration/integration';
import { TidyHooks } from './foundry/TidyHooks';
import { initKeybindings } from './keybindings/keybind-init';
import { Tidy5eGroupSheetClassic } from './sheets/classic/Tidy5eGroupSheetClassic';
import { DebugTools } from './utils/DebugTools';
import { Tidy5eContainerSheetClassic } from './sheets/Tidy5eContainerSheetClassic';
import { initReadyHooks } from './features/ready-hooks';

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eCharacterSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_CHARACTER],
      label: 'TIDY5E.Tidy5eCharacterSheetClassic',
    }
  );

  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eNpcSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_NPC],
      label: 'TIDY5E.Tidy5eNpcSheetClassic',
    }
  );

  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eVehicleSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_VEHICLE],
      label: 'TIDY5E.Tidy5eVehicleSheetClassic',
    }
  );

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eItemSheetClassic,
    {
      types: [
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
      ],
      label: 'TIDY5E.Tidy5eItemSheetClassic',
    }
  );

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eContainerSheetClassic,
    {
      types: [CONSTANTS.SHEET_TYPE_CONTAINER],
      label: 'TIDY5E.Tidy5eContainerSheetClassic',
    }
  );

  DocumentSheetConfig.registerSheet(
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
});

Hooks.once('ready', async () => {
  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi._getApi();
  tidy5eModule.api = api;

  TidyHooks.tidy5eSheetsReady(api);

  setupIntegrations(api);

  if (
    FoundryAdapter.userIsGm() &&
    SettingsProvider.settings.migrationsConfirmationTally.get() < MigrationTally
  ) {
    new MigrationNotificationFormApplication().render(true);
  }

  initReadyHooks();

  DebugTools.onReady(api);
});
