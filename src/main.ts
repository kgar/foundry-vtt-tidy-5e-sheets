import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarUserSettings } from './settings/user-settings-form';
import { useTidy5eSpellLevelButtons } from './dialogs/spell-level-buttons';
import {
  applyHombrewEnableUpcastFreeSpellToPreItemConsumption,
  useHombrewEnableUpcastFreeSpell,
} from './dialogs/homebrew-free-upcast';
import type { Dialog as ClientDialog } from './types/dialog';
import type { globalThisUI } from './types/types';
import type { globalThisDnd5e } from './types/dnd5e';
import { Tidy5eKgarItemSheet } from './sheets/item/Tidy5eKgarItemSheet';

declare global {
  var Dialog: typeof ClientDialog;
  var ui: globalThisUI;
  var dnd5e: globalThisDnd5e;
}

Actors.registerSheet('dnd5e', Tidy5eCharacterSheet, {
  types: ['character'],
  makeDefault: true,
  label: 'T5EK.Tidy5eSheet',
});

Items.registerSheet('dnd5e', Tidy5eKgarItemSheet, {
  makeDefault: true,
  label: 'T5EK.Tidy5eItemSheet',
});

FoundryAdapter.onReady(async () => {
  initSettings();

  // TODO: Remove after debugging:
  const compareActorSamples = import.meta.env.VITE_COMPARE_SAMPLE_ACTORS;
  if (compareActorSamples === 'true') {
    debugCompareActorSheets(
      import.meta.env.VITE_TIDY5E_ACTOR_SAMPLE_ID,
      import.meta.env.VITE_KGAR_ACTOR_SAMPLE_ID
    );
  }

  const compareItemSamples = import.meta.env.VITE_COMPARE_SAMPLE_ITEMS;
  if (compareItemSamples === 'true') {
    debugCompareItemSheets(
      import.meta.env.VITE_TIDY5E_ITEM_SAMPLE_ID,
      import.meta.env.VITE_KGAR_ITEM_SAMPLE_ID
    );
  }
});

Hooks.on('getActorSheetHeaderButtons', (sheet: any, buttons: any) => {
  // TODO: Limit this to a setting showSheetOptionsOnWindowHeader
  if (!isTidy5eKgarSheet(sheet.actor?.flags?.core?.sheetClass)) {
    return;
  }

  buttons.unshift({
    class: 'configure-tidy5e',
    icon: 'far fa-newspaper',
    label: 'Tidy5e',
    onclick: () => {
      return new Tidy5eKgarUserSettings({}, undefined).render(true);
    },
  });
});

Hooks.on('renderAbilityUseDialog', (app: any, html: any, options: any) => {
  useTidy5eSpellLevelButtons(app, html, options);
  useHombrewEnableUpcastFreeSpell(app, html, options);
});

Hooks.on(
  'dnd5e.preItemUsageConsumption',
  (item: any, config: any, options: any) => {
    applyHombrewEnableUpcastFreeSpellToPreItemConsumption(
      item,
      config,
      options
    );
  }
);

function isTidy5eKgarSheet(sheetClass: string | undefined) {
  if (sheetClass === undefined) {
    return false;
  }

  const justTheClass = sheetClass.replace('dnd5e.', '');

  if (sheetClass === '') {
    sheetClass = Object.values(CONFIG.Actor.sheetClasses.character)
      .find((x) => x.default)
      .id?.replace('dnd5e.', '');
  }

  return justTheClass === Tidy5eCharacterSheet.name;
  // TODO: Check for more supported KGar sheets in this way.
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function debugCompareActorSheets(
  tidySheetId: string,
  kgarSheetId: string
) {
  const tidySheet = game.actors.get(tidySheetId)?.sheet;

  if (!tidySheet) {
    ui.notifications.warn(
      'KGAR TIDY 5E DEBUG | Tidy 5e sheet not found; update the ID'
    );
  }

  tidySheet.render(true);
  delay(1000).then(() => {
    tidySheet.setPosition({
      width: 740,
      height: 840,
      left: 69,
      top: 56.5,
      scale: 1,
      zIndex: 108,
    });
  });

  const kgarSheet = game.actors.get(kgarSheetId)?.sheet;

  if (!kgarSheet) {
    ui.notifications.warn(
      'KGAR TIDY 5E DEBUG | Kgar sheet not found; update the ID'
    );
  }

  kgarSheet.render(true);
  delay(1000).then(() => {
    kgarSheet.setPosition({
      width: 720,
      height: 840,
      left: 814,
      top: 53.5,
      scale: 1,
      zIndex: 109,
    });
  });
}

async function debugCompareItemSheets(
  tidySheetId: string,
  kgarSheetId: string
) {
  const tidySheet = game.items.get(tidySheetId)?.sheet;

  if (!tidySheet) {
    ui.notifications.warn(
      'KGAR TIDY 5E DEBUG | Tidy 5e sheet not found; update the ID'
    );
  }

  tidySheet.render(true);
  delay(500).then(() => {
    document.querySelector('.tidy5e.item .tabs [data-tab=details]')?.click();
    tidySheet.setPosition({
      left: 69,
      top: 140,
      scale: 1,
      zIndex: 108,
    });
  });

  const kgarSheet = game.items.get(kgarSheetId)?.sheet;

  if (!kgarSheet) {
    ui.notifications.warn(
      'KGAR TIDY 5E DEBUG | Kgar sheet not found; update the ID'
    );
  }

  kgarSheet.render(true);
  delay(500).then(() => {
    kgarSheet.setPosition({
      left: 814,
      top: 140,
      scale: 1,
      zIndex: 109,
    });
  });
}
