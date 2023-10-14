import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/character/Tidy5eCharacterSheet';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import type { Dialog as ClientDialog } from './types/dialog';
import type { globalThisUI } from './types/types';
import type { globalThisDnd5e } from './types/dnd5e';
import { Tidy5eKgarItemSheet } from './sheets/item/Tidy5eKgarItemSheet';
import { Tidy5eNpcSheet } from './sheets/npc/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/vehicle/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { getApi } from './api/api';

declare global {
  var Dialog: typeof ClientDialog;
  var ui: globalThisUI;
  var dnd5e: globalThisDnd5e;
}

Actors.registerSheet('dnd5e', Tidy5eCharacterSheet, {
  types: [CONSTANTS.SHEET_TYPE_CHARACTER],
  makeDefault: true,
  label: 'T5EK.Tidy5eSheet',
});

Actors.registerSheet('dnd5e', Tidy5eNpcSheet, {
  types: [CONSTANTS.SHEET_TYPE_NPC],
  makeDefault: true,
  label: 'T5EK.Tidy5eNPC',
});

Actors.registerSheet('dnd5e', Tidy5eVehicleSheet, {
  types: [CONSTANTS.SHEET_TYPE_VEHICLE],
  makeDefault: true,
  label: 'T5EK.Tidy5eVehicle',
});

Items.registerSheet('dnd5e', Tidy5eKgarItemSheet, {
  makeDefault: true,
  label: 'T5EK.Tidy5eItemSheet',
});

FoundryAdapter.onReady(async () => {
  initSettings();

  game.modules.get(CONSTANTS.MODULE_ID).api = getApi();

  // TODO: Remove after debugging:
  const compareActorSamples = import.meta.env.VITE_COMPARE_SAMPLE_ACTORS;
  if (compareActorSamples === 'true') {
    debugCompareActorSheets(
      import.meta.env.VITE_ACTOR_LEFT_ID,
      import.meta.env.VITE_ACTOR_RIGHT_ID
    );
  }

  const compareItemSamples = import.meta.env.VITE_COMPARE_SAMPLE_ITEMS;
  if (compareItemSamples === 'true') {
    debugCompareItemSheets(
      import.meta.env.VITE_ITEM_LEFT_ID,
      import.meta.env.VITE_ITEM_RIGHT_ID
    );
  }

  if (import.meta.env.VITE_OPEN_THEME_SETTINGS_ON_START === 'true') {
    getApi().openThemeSettings();
  }
});

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function debugCompareActorSheets(
  leftSheetId: string,
  rightSheetId: string
) {
  if (!!leftSheetId) {
    const leftSheet = game.actors.get(leftSheetId)?.sheet;

    if (!leftSheet) {
      ui.notifications.warn(
        'KGAR TIDY 5E DEBUG | Tidy 5e sheet not found; update the ID'
      );
    }

    leftSheet?.render(true);
    delay(1000).then(() => {
      leftSheet?.setPosition({
        width: 740,
        height: 840,
        left: 69,
        top: 56.5,
        scale: 1,
        zIndex: 108,
      });
    });
  }

  if (!!rightSheetId) {
    const rightSheet = game.actors.get(rightSheetId)?.sheet;

    if (!rightSheet) {
      ui.notifications.warn(
        'KGAR TIDY 5E DEBUG | Kgar sheet not found; update the ID'
      );
    }

    rightSheet?.render(true);
    delay(1000).then(() => {
      rightSheet?.setPosition({
        width: 720,
        height: 840,
        left: 814,
        top: 53.5,
        scale: 1,
        zIndex: 109,
      });
    });
  }
}

async function debugCompareItemSheets(
  leftSheetId: string,
  rightSheetId: string
) {
  if (!!leftSheetId) {
    const leftSheet = game.items.get(leftSheetId)?.sheet;

    if (!leftSheet) {
      ui.notifications.warn(
        'KGAR TIDY 5E DEBUG | Left Item Sheet not found; update the ID'
      );
    }

    leftSheet.render(true);
    delay(500).then(() => {
      leftSheet.setPosition({
        left: 69,
        top: 140,
        scale: 1,
        zIndex: 108,
      });
    });
  }

  if (!!rightSheetId) {
    const rightSheet = game.items.get(rightSheetId)?.sheet;

    if (!rightSheet) {
      ui.notifications.warn(
        'KGAR TIDY 5E DEBUG | Left Item Sheet not found; update the ID'
      );
    }

    rightSheet.render(true);
    delay(500).then(() => {
      rightSheet.setPosition({
        left: 814,
        top: 140,
        scale: 1,
        zIndex: 109,
      });
    });
  }
}
