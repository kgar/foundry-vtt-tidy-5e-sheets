import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eSheetKgar } from './sheets/character';
import './scss/core.scss';
import { SettingsProvider, initSettings } from './settings/settings';
import { Tidy5eKgarUserSettings } from './settings/user-settings-form';
import { warn } from './utils/logging';
import { useTidy5eSpellLevelButtons } from './dialogs/spell-level-buttons';

FoundryAdapter.registerCharacterSheet(Tidy5eSheetKgar);

FoundryAdapter.onReady(() => {
  initSettings();
});

Hooks.on('getActorSheetHeaderButtons', (sheet, buttons) => {
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

Hooks.on('renderAbilityUseDialog', useTidy5eSpellLevelButtons);

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
