import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarItemSheet } from './sheets/Tidy5eItemSheet';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntime } from './runtime/runtime-init';

/**
 * A tally that represents the number of migrations that have been added to Tidy.
 * This field is used by the developer to control whether a migration notification appears for the GM.
 * When the GM indicates "Do Not Show Again," the migration tally is saved to world config,
 * to prevent the dialog from showing until the next round of migrations.
 * The number of times this tally advances is not as important as the fact that it advances at least once for any release that contains at least one new migration.
 */
const MigrationTally = 1;

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
});
