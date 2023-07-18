import { SettingsProvider } from 'src/settings/settings';
import { warn } from 'src/utils/logging';

export const SPELL_LEVEL_RADIO_BUTTON_CLASS = 'spell-level-button-radio';

export function useTidy5eSpellLevelButtons(app: any, html: any, options: any) {
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

  const selectedLevel = dropdown.val();

  const allLevels = dropdown
    .find('option')
    .map(function () {
      const level = $(this).val();
      const text = $(this).text();

      let availableSlots = tryGetAvailableSlots(text);

      return {
        level,
        availableSlots: availableSlots,
        selected: level === selectedLevel,
        text: text,
      };
    })
    .toArray();

  const availableOptions = allLevels
    .map((level) =>
      createOption(
        level.level,
        level.availableSlots,
        level.selected,
        level.text,
        app.appId
      )
    )
    .join('\n');

  const newFormGroup = `
      <div class="form-group spell-level-buttons">
          <label>${game.i18n.localize(`DND5E.SpellCastUpcast`)}</label>
          <div class="form-fields">${availableOptions}</div>
      </div>
    `;

  const dropdownFormGroup = dropdown.closest('.form-group');
  dropdownFormGroup.after(newFormGroup);

  $(html)
    .find('.spell-level-button-label')
    .on('click', function () {
      dropdown.val($(this).find('input').val());
    });

  dropdownFormGroup.hide();

  const theButtonToClick = html.find(
    `#${getDivButtonId(selectedLevel, app.appId)}`
  );

  theButtonToClick.trigger('click');

  app.setPosition({ height: 'auto' });
}

function tryGetAvailableSlots(text: string): number {
  let matches: RegExpMatchArray | string | null = text.match(/\(\d+\s\w+\)/);

  if (!matches) {
    matches = text.match(/\d+/g);
    const lastMatch = matches?.[matches.length - 1];
    if (lastMatch) {
      matches = [lastMatch];
    }
  }

  if (!matches) {
    warn(
      `tidy5e-spell-level-buttons | tidy5eSpellLevelButtons | Cannot find the spell slots on text '${text}' with ${/\(\d+\s\w+\)/}`
    );
  }

  let availableSlotsFounded = matches ? matches[0].match(/\d+/) : undefined;

  if (!availableSlotsFounded) {
    warn(
      `tidy5e-spell-level-buttons | tidy5eSpellLevelButtons | Cannot find the spell slots on text '${text}' with ${/\d+/}`
    );
  }

  let availableSlots = Number(
    availableSlotsFounded ? availableSlotsFounded[0] : 0
  );

  if (isNaN(availableSlots)) {
    availableSlots = 0;
  }

  return availableSlots;
}

function createOption(
  value: number,
  availableSlots: number,
  selected: boolean,
  text: string,
  appId: unknown
) {
  let buttonText = getButtonText(text, value.toString());
  let divButton = `
    <div 
        role="button" 
        tabindex="0"
        class="spell-level-button"
        id="${getDivButtonId(value, appId)}">
        ${buttonText}
    </div>`;

  let radioButton = `
        <input 
          type="radio" 
          class="${SPELL_LEVEL_RADIO_BUTTON_CLASS}"
          id="${appId}lvl-btn-${buttonText}" 
          name="spell-level-button" 
          value="${value}" />`;

  let availableSlotsBadge =
    availableSlots > 0
      ? `<span class="available-slots">${availableSlots}</span>`
      : '';

  return `
        <label 
          title="${text}" 
          class="spell-level-button-label" 
          for="${appId}lvl-btn-${buttonText}">
          ${radioButton}
          ${divButton}
          ${availableSlotsBadge}
        </label>`;
}

function getButtonText(text: string, value: string) {
  if (value !== 'pact') {
    return value;
  }

  let matches = text.match(/\d/);

  if (!matches) {
    warn(
      `tidy5e-spell-level-buttons | tidy5eSpellLevelButtons | Cannot find the pact slots on text '${text}' with ${/\d/}`
    );
  }

  return matches ? `p${matches[0]}` : 'p0';
}

function getDivButtonId(value: string, appId: string) {
  return `spell-level-button-${appId}-${value}`;
}
