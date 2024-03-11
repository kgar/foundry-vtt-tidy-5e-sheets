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
import MigrationNotificationFormApplication from './applications/migrations/notification/MigrationNotificationFormApplication';
import { MigrationTally } from './applications/migrations/MigrationTally';
import { Tidy5eKgarContainerSheet } from './sheets/Tidy5eContainerSheet';
import { setupModuleIntegrations } from './integration/integration';

FoundryAdapter.registerActorSheet(
  Tidy5eCharacterSheet,
  [CONSTANTS.SHEET_TYPE_CHARACTER],
  'TIDY5E.Tidy5eSheet'
);

FoundryAdapter.registerActorSheet(
  Tidy5eNpcSheet,
  [CONSTANTS.SHEET_TYPE_NPC],
  'TIDY5E.Tidy5eNPC'
);

FoundryAdapter.registerActorSheet(
  Tidy5eVehicleSheet,
  [CONSTANTS.SHEET_TYPE_VEHICLE],
  'TIDY5E.Tidy5eVehicle'
);

FoundryAdapter.registerItemSheet(Tidy5eKgarItemSheet, 'TIDY5E.Tidy5eItemSheet');

DocumentSheetConfig.unregisterSheet(Item, 'dnd5e', Tidy5eKgarItemSheet, {
  types: ['container'],
});

DocumentSheetConfig.registerSheet(Item, 'dnd5e', Tidy5eKgarContainerSheet, {
  makeDefault: true,
  types: [CONSTANTS.SHEET_TYPE_CONTAINER],
  label: 'TIDY5E.Tidy5eContainerSheet',
});

DocumentSheetConfig.unregisterSheet(Item, 'dnd5e', Tidy5eKgarItemSheet, {
  types: ['container'],
});

DocumentSheetConfig.registerSheet(Item, 'dnd5e', Tidy5eKgarContainerSheet, {
  makeDefault: true,
  types: [CONSTANTS.SHEET_TYPE_CONTAINER],
  label: 'TIDY5E.Tidy5eContainerSheet',
});

Hooks.once('init', () => {
  initSettings();
  initRuntime();
});

Hooks.once('ready', async () => {
  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi._getApi();
  tidy5eModule.api = api;

  // TODO: Remove after taking over the live module ID
  const prodTidy5eModule = FoundryAdapter.getModule('tidy5e-sheet');
  if (prodTidy5eModule) {
    prodTidy5eModule.api = tidy5eModule.api;
  }

  Hooks.callAll(CONSTANTS.HOOK_TIDY5E_SHEETS_READY, api);

  setupModuleIntegrations(api);

  if (
    FoundryAdapter.userIsGm() &&
    SettingsProvider.settings.migrationsConfirmationTally.get() < MigrationTally
  ) {
    new MigrationNotificationFormApplication().render(true);
  }
});
