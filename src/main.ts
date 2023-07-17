import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eSheetKgar } from './sheets/character';
import './scss/core.scss';
import { SettingsProvider, initSettings } from './settings/settings';
import { Tidy5eKgarUserSettings } from './settings/user-settings-form';

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

Hooks.on('renderAbilityUseDialog', (app: any, html: any, options: any) => {
  if (!SettingsProvider.settings.enableSpellLevelButtons.get()) {
    return;
  }

  if (app?.item?.type != 'spell') {
    return;
  }

  if (html.find('[name="consumeSpellSlot"]').length == 0) {
    return;
  }

  const dropdown = html.find('select[name="consumeSpellLevel"]');

  if (!dropdown) {
    return;
  }

  const originalDialogHeight = parseInt(html.css('height'));
  const heightOffset = 42;
  html.height(originalDialogHeight + heightOffset);

  const selectedLevel = dropdown.val();

  const allLevels = dropdown
    .find('option')
    .map(function () {
      const level = $(this).val();
      return {
        level,
        availableSlots: -1, // TODO: Return the spell level and available slots; there's regex for this
        selected: level === selectedLevel,
        text: $(this).text(),
      };
    })
    .toArray();

  function createOption(
    value: number,
    availableSlots: number,
    selected: boolean,
    text: string
  ) {
    let i = 'todo-implement-weird-i-thing';
    let iThingy = `<div class="spell-lvl-btn__btn">${i}</div>`;

    let selectedAttribute = selected ? ' selected="selected"' : '';

    let radioButton = `
      <input 
        type="radio" 
        id="${app.appId}lvl-btn-${i}" 
        name="consumeSpellLevel" 
        value="${value}" 
        ${selectedAttribute} />`;

    let availableSlotsBadge =
      availableSlots > 0 ? 'todo-implement-available-slots' : '';

    return `
      <label 
        title="${text}" 
        class="spell-lvl-btn__label" 
        for="${app.appId}lvl-btn-${i}">
        ${radioButton}
        <!--${iThingy}-->
        <!--${availableSlotsBadge}-->
      </label>`;
  }

  const availableOptions = allLevels.map((level) =>
    createOption(level.level, level.availableSlots, level.selected, level.text)
  );

  const newFormGroup = `
    <div class="form-group spell-lvl-btn">
        <label>${game.i18n.localize(`DND5E.SpellCastUpcast`)}</label>
        <div class="form-fields">${availableOptions}</div>
    </div>
  `;

  debugger;
  html.find('.form-group').first().replaceWith(newFormGroup);
});

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
