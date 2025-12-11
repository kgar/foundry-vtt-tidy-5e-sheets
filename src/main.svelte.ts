import { FoundryAdapter } from './foundry/foundry-adapter';
import './less/tidy5e.less';
import {
  SettingsProvider,
  initSettings,
  settings,
} from './settings/settings.svelte';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntimeOnReady, initRuntime } from './runtime/runtime-init';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { setupIntegrations } from './integration/integration';
import { TidyHooks } from './foundry/TidyHooks';
import { initKeybindings } from './keybindings/keybind-init';
import { DebugTools } from './utils/DebugTools';
import { Tidy5eContainerSheetQuadrone } from './sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import { Tidy5eItemDebugSheetQuadrone } from './sheets/quadrone/Tidy5eItemDebugSheetQuadrone.svelte';
import { initReadyHooks } from './features/ready-hooks';
import '@melloware/coloris/dist/coloris.css';
import { debug } from './utils/logging';
import { Tidy5eItemSheetQuadrone } from './sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import { Tidy5eVehicleSheetQuadrone } from './sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';
import { Tidy5eCharacterSheetQuadrone } from './sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import { Tidy5eNpcSheetQuadrone } from './sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import { ThemeQuadrone } from './theme/theme-quadrone.svelte';
import { TidyNotificationsManager } from './features/notifications/TidyNotificationsManager';
import { Tidy5eGroupSheetQuadrone } from './sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';
import { Tidy5eEncounterSheetQuadrone } from './sheets/quadrone/Tidy5eEncounterSheetQuadrone.svelte';
import { formatResourcePathForCss } from './utils/path';
import './theme/theme-quadrone-detached';

Hooks.once('init', () => {
  const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

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
    Tidy5eVehicleSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_VEHICLE],
      label: 'TIDY5E.Tidy5eVehicleSheetQuadrone',
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
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eGroupSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_GROUP],
      label: 'TIDY5E.Tidy5eGroupSheetQuadrone',
    }
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eEncounterSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_ENCOUNTER],
      label: 'TIDY5E.Tidy5eEncounterSheetQuadrone',
    }
  );

  /* FOR THOSE WITH TRUE SIGHT */
  if (settings.value.truesight) {
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

  TidyNotificationsManager.onReady();
});

Hooks.once('setup', async () => {
  const style = document.createElement('style');
  style.id = 'tidy5e-sheet-generated-styles';
  document.head.append(style);

  // Note: When popout is added to core, this may need to be changed to use .sheet.insertRule
  style.textContent = Object.entries(CONFIG.DND5E.currencies)
    .map(
      ([key, val]) =>
        `.tidy5e-sheet .currency.${key} { --currency-icon-url: url("${formatResourcePathForCss(
          val.icon
        )}"); }`
    )
    .join('\n\n');
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
