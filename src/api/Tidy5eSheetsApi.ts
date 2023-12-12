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
import type { TabId } from './tab/CustomTabBase';

/**
 * The Tidy 5e Sheets API. The API becomes available after the hook `tidy5e-sheet.ready` is called.
 * When the hook fires, it provides an instance of the API.
 * @example Getting the API for extending Tidy 5e Sheets
 * ```js
 * Hooks.once("tidy5e-sheet.ready", (api) => {
 *   // Do something awesome!
 * });
 * ```
 *
 * @example Getting the API from the alpha module
 * ```js
 * game.modules.get('tidy5e-sheet-kgar').api
 * ```
 *
 * @example Getting the API from the official Tidy 5e Sheets module
 * ```js
 * game.modules.get('tidy5e-sheet').api
 * ```
 *
 * @remarks
 * It is recommended to retrieve the API from the `tidy5e-sheet.ready` hook.
 *
 * The `game.modules.get('tidy5e-sheet').api` approach only works when the original module AND the alpha module are active.
 * This requirement will last until the alpha sheets become the official replacement and assume the module ID "tidy5e-sheet".
 */
export class Tidy5eSheetsApi {
  private static _instance: Tidy5eSheetsApi;

  private constructor() {}

  /**
   * Gets an instance of the Tidy 5e Sheets API
   * @returns instance of the Tidy 5e Sheets API
   * @internal
   */
  static _getApi() {
    Tidy5eSheetsApi._instance ??= new Tidy5eSheetsApi();
    return this._instance;
  }

  /**
   * Adds a tab to the available Character sheet tabs.
   * @param tab the information necessary to render a tab
   * @param layout an optional sheet layout or layouts (default: 'all')
   * @returns void
   * @example Registering a handlebars-based character sheet tab
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerCharacterTab(
   *     new api.models.HandlebarsTab({
   *       title: 'My Tab',
   *       path: '/modules/my-module-id/templates/my-handlebars-template.hbs',
   *       tabId: 'my-module-id-registered-character-tab',
   *       getData: async (data) => {
   *         data['my-message'] = 'Hello, world! 🌊🏄‍♂️';
   *         return new Promise((resolve) => {
   *           resolve(data);
   *         });
   *       },
   *     })
   *   );
   * });
   * ```
   *
   * @remarks
   * A tab ID is always required (see {@link TabId}).
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
   * @example Registering a handlebars-based NPC sheet tab
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerNpcTab(
   *     new api.models.HandlebarsTab({
   *       title: 'My Tab',
   *       path: '/modules/my-module-id/templates/my-handlebars-template.hbs',
   *       tabId: 'my-module-id-registered-npc-tab',
   *       getData: async (data) => {
   *         data['my-message'] = 'Hello, world! 🌊🏄‍♂️';
   *         return new Promise((resolve) => {
   *           resolve(data);
   *         });
   *       },
   *     })
   *   );
   * });
   * ```
   *
   * @remarks
   * A tab ID is always required (see {@link TabId}).
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
   * @example Registering a handlebars-based vehicle sheet tab
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerVehicleTab(
   *     new api.models.HandlebarsTab({
   *       title: 'My Tab',
   *       path: '/modules/my-module-id/templates/my-handlebars-template.hbs',
   *       tabId: 'my-module-id-registered-vehicle-tab',
   *       getData: async (data) => {
   *         data['my-message'] = 'Hello, world! 🌊🏄‍♂️';
   *         return new Promise((resolve) => {
   *           resolve(data);
   *         });
   *       },
   *     })
   *   );
   * });
   * ```
   *
   * @remarks
   * A tab ID is always required (see {@link TabId}).
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
   *       tabId: "my-module-id-my-item-tab",
   *       path: "/modules/my-module-id/my-item-tab.hbs",
   *       enabled: (data) => data.item.type === 'spell',
   *       getData: (data) => {
   *         data['my-extra-data'] = "Hello, world! 👋";
   *         return data;
   *       }
   *     }));
   * });
   * ```
   *
   * @remarks
   * A tab ID is always required (see {@link TabId}).
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
