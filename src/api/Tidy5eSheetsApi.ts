import { CONSTANTS } from 'src/constants';
import { SheetSettingsFormApplication } from 'src/applications/sheet-settings/SheetSettingsFormApplication';
import ThemeSettingsFormApplication from 'src/applications/theme/ThemeSettingsFormApplication';
import { HandlebarsTab } from './tab/HandlebarsTab';
import { HtmlTab } from './tab/HtmlTab';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import type { CustomTabBase } from './tab/TabBase';

/**
 * The Tidy 5e Sheets API. The API becomes available after the hook `tidy5e-sheet.read` is called.
 * When the hook fires, it provides an instance of the API.
 * @example Getting the API for extending Tidy 5e Sheets
 * ```js
 * Hooks.once("tidy5e-sheet.ready", (api) => {
 *   // Do something awesome!
 * });
 * ```
 */
export class Tidy5eSheetsApi {
  private static _instance: Tidy5eSheetsApi;

  private constructor() {}

  /**
   * Gets an instance of the Tidy 5e Sheets API
   * @returns instance of the Tidy 5e Sheets API
   */
  static getApi() {
    Tidy5eSheetsApi._instance ??= new Tidy5eSheetsApi();
    return this._instance;
  }

  /**
   * Adds a tab to all relevant item sheets.
   * @see {@link CustomTabBase} for options related to all tabs.
   * @param tab the custom tab settings to use when incorporating this tab.
   */
  registerItemTab(tab: HandlebarsTab | HtmlTab) {
    ItemSheetRuntime.registerTab(tab);
  }

  // TODO: add relevant class models in the style of dnd5e <3, but to the API
  models = {
    HandlebarsTab: HandlebarsTab,
    HtmlTab: HtmlTab,
  };
}
