import { CONSTANTS } from "./constants";

export function initSettings() {
  // add menu button for sheet settings
  // register color theme setting

  // FIXME: Add stub types needed for this operation.
  game.settings.register(CONSTANTS.MODULE_ID, 'colorScheme', {
    name: `${game.i18n.localize('TIDY5E.Settings.SheetTheme.name')}`,
    hint: game.i18n.localize('TIDY5E.Settings.SheetTheme.hint'),
    scope: 'client',
    config: true,
    type: String,
    choices: {
      default: game.i18n.localize('TIDY5E.Settings.SheetTheme.default'),
      dark: game.i18n.localize('TIDY5E.Settings.SheetTheme.dark'),
    },
    default: 'default',
    onChange: (data) => {
      data === 'dark'
        ? document.querySelector('html').classList.add('tidy5eKGarDark')
        : document.querySelector('html').classList.remove('tidy5eKGarDark');
    },
  });

  const colorScheme = game.settings.get(CONSTANTS.MODULE_ID, 'colorScheme');
  if (colorScheme === 'dark') {
    document.querySelector('html').classList.add('tidy5eKgarDark');
  }
}
