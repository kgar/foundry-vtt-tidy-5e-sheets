import { CONSTANTS } from 'src/constants';
import { Tidy5eKgarSettingsSheet } from 'src/sheets/settings/sheet/Tidy5eKgarSettingsSheet';
import { Tidy5eKgarThemeSettingsSheet } from 'src/sheets/settings/theme/Tidy5eKgarThemeSettingsSheet';

/**
 * Tidy 5e Sheets API
 *
 * More info later
 */
export class Tidy5eSheetsApi {
  #themeSettings = new Tidy5eKgarThemeSettingsSheet();
  #sheetSettings = new Tidy5eKgarSettingsSheet(CONSTANTS.TAB_SETTINGS_PLAYERS);

  /**
   * Opens the Theme Settings dialog.
   */
  openThemeSettings(): Tidy5eKgarThemeSettingsSheet {
    return this.#themeSettings.render(true);
  }

  openSheetSettings(initialTab?: string): Tidy5eKgarSettingsSheet {
    if (initialTab) {
      this.#sheetSettings.initialTabId = initialTab;
    }

    return this.#sheetSettings.render(true);
  }
}
