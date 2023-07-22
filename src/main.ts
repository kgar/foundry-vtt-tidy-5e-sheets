import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eSheetKgar } from './sheets/character';
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

declare global {
  var Dialog: typeof ClientDialog;
  var ui: globalThisUI;
  var dnd5e: globalThisDnd5e;
}

FoundryAdapter.registerCharacterSheet(Tidy5eSheetKgar);

FoundryAdapter.onReady(async () => {
  initSettings();

  // TODO: Remove after debugging:
  debugCompareSheets('hUKk6rVxXIqCFr3Y', 'Yxj44COmG1avxj94');
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

  return justTheClass === Tidy5eSheetKgar.name;
  // TODO: Check for more supported KGar sheets in this way.
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function debugCompareSheets(tidySheetId: string, kgarSheetId: string) {
  const tidySheet = game.actors.get(tidySheetId)?.sheet;

  if (!tidySheet) {
    ui.notifications.warn(
      'KGAR TIDY 5E DEBUG | Tidy 5e sheet not found; update the ID'
    );
  }

  tidySheet.render(true);
  await delay(500);
  tidySheet.setPosition({
    width: 740,
    height: 840,
    left: 69,
    top: 56.5,
    scale: 1,
    zIndex: 108,
  });
  await delay(150);

  const kgarSheet = game.actors.get(kgarSheetId)?.sheet;

  if (!kgarSheet) {
    ui.notifications.warn(
      'KGAR TIDY 5E DEBUG | Kgar sheet not found; update the ID'
    );
  }

  kgarSheet.render(true);
  await delay(500);
  kgarSheet.setPosition({
    width: 720,
    height: 840,
    left: 814,
    top: 53.5,
    scale: 1,
    zIndex: 109,
  });
}
