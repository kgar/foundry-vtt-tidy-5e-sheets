import { CONSTANTS } from 'src/constants';
import { SheetSettingsFormApplication } from 'src/applications/sheet-settings/SheetSettingsFormApplication';
import type {
  SheetTabRegistrationOptions,
  SheetTabState,
} from '../runtime/types';
import type {
  CharacterSheetContext,
  NpcSheetContext,
  VehicleSheetContext,
} from 'src/types/types';
import {
  registerCharacterSheetTab,
  unregisterCharacterSheetTab,
} from '../runtime/character-sheet-state';
import {
  registerVehicleSheetTab,
  unregisterVehicleSheetTab,
} from 'src/runtime/vehicle-sheet-state';
import {
  registerNpcSheetTab,
  unregisterNpcSheetTab,
} from 'src/runtime/npc-sheet-state';
import ThemeSettingsFormApplication from 'src/applications/theme/ThemeSettingsFormApplication';
import type { RegisterItemDetailsSectionOptions } from './api.types';
import { registerItemDetailSection } from 'src/runtime/item-sheet-runtime';

/**
 * A sinlgeton APITidy 5e Sheets API
 *
 * More info later
 */
export class Tidy5eSheetsApi {
  private static _instance: Tidy5eSheetsApi;

  private constructor() {}

  static getApi() {
    Tidy5eSheetsApi._instance ??= new Tidy5eSheetsApi();
    return this._instance;
  }

  private static _themeSettings: ThemeSettingsFormApplication;
  private static _sheetSettings: SheetSettingsFormApplication;

  /**
   * Opens the Theme Settings dialog.
   */
  openThemeSettings(): ThemeSettingsFormApplication {
    Tidy5eSheetsApi._themeSettings ??= new ThemeSettingsFormApplication();
    const rendered = Tidy5eSheetsApi._themeSettings.render(true);
    setTimeout(() => Tidy5eSheetsApi._themeSettings.bringToTop(), 150);
    return rendered;
  }

  openSheetSettings(initialTab?: string): SheetSettingsFormApplication {
    Tidy5eSheetsApi._sheetSettings ??= new SheetSettingsFormApplication(
      CONSTANTS.TAB_SETTINGS_PLAYERS
    );

    if (initialTab) {
      Tidy5eSheetsApi._sheetSettings.initialTabId = initialTab;
    }

    const rendered = Tidy5eSheetsApi._sheetSettings.render(true);
    setTimeout(() => Tidy5eSheetsApi._sheetSettings.bringToTop(), 150);
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

  registerItemDetailSection(options?: RegisterItemDetailsSectionOptions) {
    if (!options) {
      // error? log / notify?
      return;
    }
    registerItemDetailSection(options);
  }

  // TODO: add relevant class models in the style of dnd5e <3, but to the API
}
