import { UserSettingsFormApplication } from './settings/user-settings/UserSettingsFormApplication.svelte';
import { ThemeSettingsFormApplication } from './theme/ThemeSettingsFormApplication.svelte';
import { CONSTANTS } from 'src/constants';

export class ApplicationsManager {
  private static _themeSettings: ThemeSettingsFormApplication;
  private static _userSettings: UserSettingsFormApplication;

  /**
   * Opens the Theme Settings window as a singleton.
   * @returns the form application for theme settings.
   */
  static async openThemeSettings(): Promise<ThemeSettingsFormApplication> {
    ApplicationsManager._themeSettings ??= new ThemeSettingsFormApplication();
    const rendered = await ApplicationsManager._themeSettings.render(true);
    setTimeout(() => ApplicationsManager._themeSettings.bringToFront(), 150);
    return rendered;
  }

  /**
   * Opens the Sheet Settings window as a singleton.
   * @param initialTab the initial tab to show
   * @returns the form application for sheet settings
   */
  static async openUserSettings(
    initialTab?: string
  ): Promise<UserSettingsFormApplication> {
    ApplicationsManager._userSettings ??= new UserSettingsFormApplication(
      CONSTANTS.TAB_USER_SETTINGS_PLAYERS
    );

    if (initialTab) {
      ApplicationsManager._userSettings.initialTabId = initialTab;
    }

    const rendered = await ApplicationsManager._userSettings.render(true);
    setTimeout(() => ApplicationsManager._userSettings.bringToFront(), 150);
    return rendered;
  }
}
