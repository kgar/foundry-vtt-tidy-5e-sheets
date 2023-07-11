import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eSheetKgar } from './sheets/character';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarUserSettings } from './settings/user-settings-form';
import { warn } from './utils/logging';
import { CONSTANTS } from './constants';

FoundryAdapter.registerCharacterSheet(Tidy5eSheetKgar);

FoundryAdapter.onReady(() => {
  initSettings();
});

// TODO: Organize better
FoundryAdapter.onActor5eSheetRender((args) => {
  // TODO: Put behind a setting

  const window = args[1]?.get(0);
  const windowHeader = window?.querySelector('h4.window-title');

  if (windowHeader && window.classList.contains('tidy5e-kgar')) {
    const settingsButton = document.createElement('a');
    settingsButton.classList.add('config-button');
    settingsButton.setAttribute(
      'data-tooltip',
      FoundryAdapter.localize('T5EK.WindowHeaderSheetSettingsTooltip')
    );
    settingsButton.addEventListener('click', (event) => {
      new Tidy5eKgarUserSettings({}, undefined).render(true);
    });

    const icon = document.createElement('i');
    icon.classList.add('far');
    icon.classList.add('fa-newspaper');
    icon.style.opacity = '0.5';

    settingsButton.appendChild(icon);

    windowHeader.appendChild(settingsButton);
  } else {
    warn(
      'Unable to add Sheet Settings button to window content header. Window header not found.'
    );
  }
});

FoundryAdapter.onGetActiveEffectContextOptions((effect, contextOptions) => {
  const actor = effect.actor ? effect.actor : effect.parent;
  if (!actor?.isOwner || !isTidy5eKgarSheet(actor?.flags?.core?.sheetClass)) {
    return;
  }

  contextOptions = contextOptions.filter((obj: any) => {
    return !obj?.name.toLowerCase().startsWith('dnd5e');
  });

  if (FoundryAdapter.getGameSetting('rightClickDisabled')) {
    contextOptions = [];
  } else {
    let tidy5eKgarContextOptions = [
      {
        name: effect.disabled
          ? 'DND5E.ContextMenuActionEnable'
          : 'DND5E.ContextMenuActionDisable',
        icon: effect.disabled
          ? "<i class='fas fa-check fa-fw'></i>"
          : "<i class='fas fa-times fa-fw'></i>",
        callback: () => effect.update({ disabled: !effect.disabled }),
      },
      {
        name: 'DND5E.ContextMenuActionEdit',
        icon: "<i class='fas fas fa-pencil-alt fa-fw'></i>",
        callback: () => effect.sheet.render(true),
      },
    ];

    if (FoundryAdapter.tryGetFlag(actor, 'allow-edit')) {
      tidy5eKgarContextOptions = tidy5eKgarContextOptions.concat([
        {
          name: 'DND5E.ContextMenuActionDuplicate',
          icon: "<i class='fas fa-copy fa-fw'></i>",
          callback: () =>
            effect.clone(
              {
                label: game.i18n.format('DOCUMENT.CopyOf', {
                  name: effect.label,
                }),
              },
              { save: true }
            ),
        },
        {
          name: 'DND5E.ContextMenuActionDelete',
          icon: `<i class="fas fa-trash fa-fw t5ek-warning-color"></i>`,
          callback: () => effect.deleteDialog(),
        },
      ]);
    }

    contextOptions = tidy5eKgarContextOptions.concat(contextOptions);
  }
  ui.context.menuItems = contextOptions;
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
