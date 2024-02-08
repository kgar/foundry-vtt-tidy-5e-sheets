import { SheetSettingsFormApplication } from './settings/client-settings/ClientSettingsFormApplication';
import ThemeSettingsFormApplication from './theme/ThemeSettingsFormApplication';
import { CONSTANTS } from 'src/constants';

export class ApplicationsManager {
  private static _themeSettings: ThemeSettingsFormApplication;
  private static _sheetSettings: SheetSettingsFormApplication;

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
  static openSheetSettings(initialTab?: string): SheetSettingsFormApplication {
    ApplicationsManager._sheetSettings ??= new SheetSettingsFormApplication(
      CONSTANTS.TAB_SETTINGS_PLAYERS
    );

    if (initialTab) {
      ApplicationsManager._sheetSettings.initialTabId = initialTab;
    }

    const rendered = ApplicationsManager._sheetSettings.render(true);
    setTimeout(() => ApplicationsManager._sheetSettings.bringToTop(), 150);
    return rendered;
  }
}
