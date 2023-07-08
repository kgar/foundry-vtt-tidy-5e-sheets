import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eSheetKgar } from './sheets/character';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarUserSettings } from './settings/user-settings-form';
import { warn } from './utils/logging';

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
