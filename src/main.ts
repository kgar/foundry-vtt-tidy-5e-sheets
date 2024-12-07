import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/classic/Tidy5eCharacterSheet';
import './scss/tidy5e.scss';
import { SettingsProvider, initSettings } from './settings/settings';
import { Tidy5eItemSheetClassic } from './sheets/classic/Tidy5eItemSheetClassic';
import { Tidy5eNpcSheet } from './sheets/classic/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/classic/Tidy5eKgarVehicleSheet';
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
import { Tidy5eContainerSheetClassic } from './sheets/classic/Tidy5eContainerSheetClassic';
import { Tidy5eContainerSheetHightouch } from './sheets/hightouch/Tidy5eContainerSheetHightouch';
import { Tidy5eItemDebugSheetHightouch } from './sheets/hightouch/Tidy5eItemDebugSheetHightouch';
import { initReadyHooks } from './features/ready-hooks';
import '@melloware/coloris/dist/coloris.css';
import Coloris from '@melloware/coloris';

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

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eItemSheetClassic,
    {
      types: supportedItemTypes,
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

  const thisIsKGarsVisualOverhaulBranch = false; // When the first draft of the container overhaul sheet is done, remove this extra layer and let it depend on the debug setting alone.

  if (
    SettingsProvider.settings.debug.get() &&
    thisIsKGarsVisualOverhaulBranch
  ) {
    DocumentSheetConfig.registerSheet(
      Item,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eContainerSheetHightouch,
      {
        types: [CONSTANTS.SHEET_TYPE_CONTAINER],
        label: 'Tidy 5e Container Sheet - Under Development',
      }
    );

    DocumentSheetConfig.registerSheet(
      Item,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eItemDebugSheetHightouch,
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

// Coloris Color Picker setup
Coloris.init();
Coloris.coloris({
  el: '.coloris',
  formatToggle: true,
  swatches: [
    'rgba(58, 116, 126, 1)',
    'rgba(60, 179, 113, 0.3)',
    'rgba(60, 179, 113, 0.3)',
    'rgba(25, 94, 59, 1)',
    'rgba(144, 238, 144, 1)',
    'rgba(60, 179, 113, 0.3)',
    'rgba(25, 94, 59, 1)',
    'rgba(144, 238, 144, 1)',
    'rgba(255, 99, 71, 0.3)',
    'rgba(139, 0, 0, 1)',
    'rgba(255, 160, 122, 1)',
    'rgba(102, 205, 170, 0.3)',
    'rgba(0, 100, 0, 1)',
    'rgba(152, 251, 152, 1)',
    'rgba(221, 160, 221, 0.3)',
    'rgba(138, 43, 226, 1)',
    'rgba(255, 182, 193, 1)',
    'rgba(255, 165, 0, 0.3)',
    'rgba(184, 134, 11, 1)',
    'rgba(255, 215, 0, 1)',
  ],
});
