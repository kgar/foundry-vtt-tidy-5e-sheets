import { HandlebarsTab } from './tab/HandlebarsTab';
import { HtmlTab } from './tab/HtmlTab';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import type { CustomTabBase } from './tab/CustomTabBase';
import { warn } from 'src/utils/logging';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import type { SheetLayout } from 'src/runtime/types';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';

/**
 * The Tidy 5e Sheets API. The API becomes available after the hook `tidy5e-sheet.ready` is called.
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
   * Adds a tab to the available Character sheet tabs.
   * @param tab the information necessary to render a tab
   * @param layout an optional sheet layout or layouts (default: 'all')
   * @returns void
   */
  registerCharacterTab(
    tab: HandlebarsTab | HtmlTab,
    layout?: SheetLayout | SheetLayout[]
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTab = TabManager.mapCustomTabToRegisteredTab(tab, layout);

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    CharacterSheetRuntime.registerTab(registeredTab);
  }

  /**
   * Adds a tab to the available NPC sheet tabs.
   * @param tab the information necessary to render a tab
   * @param layout an optional sheet layout or layouts (default: 'all')
   * @returns void
   */
  registerNpcTab(
    tab: HandlebarsTab | HtmlTab,
    layout?: SheetLayout | SheetLayout[]
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }
    const registeredTab = TabManager.mapCustomTabToRegisteredTab(tab, layout);

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    NpcSheetRuntime.registerTab(registeredTab);
  }

  /**
   * Adds a tab to the available Vehicle sheet tabs.
   * @param tab the information necessary to render a tab
   * @param layout an optional sheet layout or layouts (default: 'all')
   * @returns void
   */
  registerVehicleTab(
    tab: HandlebarsTab | HtmlTab,
    layout?: SheetLayout | SheetLayout[]
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }
    const registeredTab = TabManager.mapCustomTabToRegisteredTab(tab, layout);

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    VehicleSheetRuntime.registerTab(registeredTab);
  }

  /**
   * Adds a tab to all relevant item sheets.
   * @see {@link CustomTabBase} for options related to all tabs.
   * @param tab the custom tab settings to use when incorporating this tab.
   * @example Register an item tab for spell items only, adding some custom data to the Item Sheet Context object before rendering my handlebars template
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerItemTab(
   *     new api.models.HandlebarsTab({
   *       title: "My Item Tab",
   *       path: "/modules/my-module/my-item-tab.hbs",
   *       enabled: (data) => data.item.type === 'spell',
   *       getData: (data) => {
   *         data['my-extra-data'] = "Hello, world! 👋";
   *         return data;
   *       }
   *     }));
   * });
   * ```
   */
  registerItemTab(tab: HandlebarsTab | HtmlTab): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTab = TabManager.mapCustomTabToRegisteredTab(tab);

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    ItemSheetRuntime.registerTab(registeredTab);
  }

  /**
   * Various models can be used for API calls.
   */
  models = {
    HandlebarsTab: HandlebarsTab,
    HtmlTab: HtmlTab,
  };
}
