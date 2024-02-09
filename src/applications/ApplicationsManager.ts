import { UserSettingsFormApplication } from './settings/user-settings/UserSettingsFormApplication';
import { ThemeSettingsFormApplication } from './theme/ThemeSettingsFormApplication';
import { CONSTANTS } from 'src/constants';

export class ApplicationsManager {
  private static _themeSettings: ThemeSettingsFormApplication;
  private static _userSettings: UserSettingsFormApplication;

  /**
   * Opens the Theme Settings window as a singleton.
   * @returns the form application for theme settings.
   */
  static openThemeSettings(): ThemeSettingsFormApplication {
    ApplicationsManager._themeSettings ??= new ThemeSettingsFormApplication();
    const rendered = ApplicationsManager._themeSettings.render(true);
    setTimeout(() => ApplicationsManager._themeSettings.bringToTop(), 150);
    return rendered;
  }

  /**
   * Opens the Sheet Settings window as a singleton.
   * @param initialTab the initial tab to show
   * @returns the form application for sheet settings
   */
  static openUserSettings(initialTab?: string): UserSettingsFormApplication {
    ApplicationsManager._userSettings ??= new UserSettingsFormApplication(
      CONSTANTS.TAB_USER_SETTINGS_PLAYERS
    );

    if (initialTab) {
      ApplicationsManager._userSettings.initialTabId = initialTab;
    }

    const rendered = ApplicationsManager._userSettings.render(true);
    setTimeout(() => ApplicationsManager._userSettings.bringToTop(), 150);
    return rendered;
  }
}
