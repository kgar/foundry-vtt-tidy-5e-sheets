import { CONSTANTS } from 'src/constants';
import { SheetSettingsFormApplication } from 'src/sheets/settings/sheet/SettingsSheetFunctions';
import type {
  SheetTabRegistrationOptions,
  SheetTabState,
} from '../state/types';
import type {
  CharacterSheetContext,
  NpcSheetContext,
  VehicleSheetContext,
} from 'src/types/types';
import {
  registerCharacterSheetTab,
  unregisterCharacterSheetTab,
} from '../state/character-sheet-state';
import {
  registerVehicleSheetTab,
  unregisterVehicleSheetTab,
} from 'src/state/vehicle-sheet-state';
import {
  registerNpcSheetTab,
  unregisterNpcSheetTab,
} from 'src/state/npc-sheet-state';
import ThemeSettingsFormApplication from 'src/applications/theme/ThemeSettingsFormApplication';

/**
 * Tidy 5e Sheets API
 *
 * More info later
 */
export class Tidy5eSheetsApi {
  #themeSettings = new ThemeSettingsFormApplication();
  #sheetSettings = new SheetSettingsFormApplication(CONSTANTS.TAB_SETTINGS_PLAYERS);

  /**
   * Opens the Theme Settings dialog.
   */
  openThemeSettings(): ThemeSettingsFormApplication {
    const rendered = this.#themeSettings.render(true);
    setTimeout(() => this.#themeSettings.bringToTop(), 150);
    return rendered;
  }

  openSheetSettings(initialTab?: string): SheetSettingsFormApplication {
    if (initialTab) {
      this.#sheetSettings.initialTabId = initialTab;
    }

    const rendered = this.#sheetSettings.render(true);
    setTimeout(() => this.#sheetSettings.bringToTop(), 150);
    return rendered;
  }

  registerCharacterSheetTab(
    tab: SheetTabState<CharacterSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    return registerCharacterSheetTab(tab, options);
  }

  unregisterCharacterSheetTab(tabId: string) {
    return unregisterCharacterSheetTab(tabId);
  }

  registerNpcSheetTab(
    tab: SheetTabState<NpcSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    return registerNpcSheetTab(tab, options);
  }

  unregisterNpcSheetTab(tabId: string) {
    return unregisterNpcSheetTab(tabId);
  }

  registerVehicleSheetTab(
    tab: SheetTabState<VehicleSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    return registerVehicleSheetTab(tab, options);
  }

  unregisterVehicleSheetTab(tabId: string) {
    return unregisterVehicleSheetTab(tabId);
  }
}
