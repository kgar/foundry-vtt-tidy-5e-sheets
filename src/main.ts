import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarItemSheet } from './sheets/Tidy5eItemSheet';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { getApi } from './api/api';

FoundryAdapter.registerActorSheet(
  Tidy5eCharacterSheet,
  [CONSTANTS.SHEET_TYPE_CHARACTER],
  'T5EK.Tidy5eSheet'
);

FoundryAdapter.registerActorSheet(
  Tidy5eNpcSheet,
  [CONSTANTS.SHEET_TYPE_NPC],
  'T5EK.Tidy5eNPC'
);

FoundryAdapter.registerActorSheet(
  Tidy5eVehicleSheet,
  [CONSTANTS.SHEET_TYPE_VEHICLE],
  'T5EK.Tidy5eVehicle'
);

FoundryAdapter.registerItemSheet(Tidy5eKgarItemSheet, 'T5EK.Tidy5eItemSheet');

FoundryAdapter.hooksOnce('ready', async () => {
  initSettings();

  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  tidy5eModule.api = getApi();

  // TODO: Remove after taking over the live module ID
  const prodTidy5eModule = FoundryAdapter.getModule('tidy5e-sheet');
  if (prodTidy5eModule) {
    prodTidy5eModule.api = tidy5eModule.api;
  }

  FoundryAdapter.hooksCall(CONSTANTS.HOOK_TIDY5E_SHEETS_READY);
});
