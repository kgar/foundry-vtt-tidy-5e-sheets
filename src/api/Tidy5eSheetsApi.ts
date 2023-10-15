import { CONSTANTS } from 'src/constants';
import { Tidy5eKgarSettingsSheet } from 'src/sheets/settings/sheet/Tidy5eKgarSettingsSheet';
import { Tidy5eKgarThemeSettingsSheet } from 'src/sheets/settings/theme/Tidy5eKgarThemeSettingsSheet';
import type {
  SheetTabRegistrationOptions,
  SheetTabState,
} from '../state/types';
import type {
  CharacterSheetContext,
  NpcSheetContext,
  VehicleSheetContext,
} from 'src/types/types';
import { registerCharacterTab } from '../state/character-sheet-state';
import { registerVehicleTab } from 'src/state/vehicle-sheet-state';
import { registerNpcTab } from 'src/state/npc-sheet-state';

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
    const rendered = this.#themeSettings.render(true);
    setTimeout(() => this.#themeSettings.bringToTop(), 150);
    return rendered;
  }

  openSheetSettings(initialTab?: string): Tidy5eKgarSettingsSheet {
    if (initialTab) {
      this.#sheetSettings.initialTabId = initialTab;
    }

    const rendered = this.#sheetSettings.render(true);
    setTimeout(() => this.#sheetSettings.bringToTop(), 150);
    return rendered;
  }

  registerCharacterTab(
    tab: SheetTabState<CharacterSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    return registerCharacterTab(tab, options);
  }

  registerNpcTab(
    tab: SheetTabState<NpcSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    return registerNpcTab(tab, options);
  }

  registerVehicleTab(
    tab: SheetTabState<VehicleSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    return registerVehicleTab(tab, options);
  }
}
