import { HandlebarsTab } from './tab/HandlebarsTab';
import { HtmlTab } from './tab/HtmlTab';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import type { CustomTabBase } from './tab/CustomTabBase';
import { warn } from 'src/utils/logging';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import type { TabId } from './tab/CustomTabBase';
import { ActionListApi } from './action-list/ActionListApi';
import { Tidy5eCharacterSheet } from 'src/sheets/Tidy5eCharacterSheet';
import { Tidy5eNpcSheet } from 'src/sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from 'src/sheets/Tidy5eKgarVehicleSheet';
import { Tidy5eKgarItemSheet } from 'src/sheets/Tidy5eItemSheet';
import { SvelteTab } from './tab/SvelteTab';
import type { SupportedTab, ActorTabRegistrationOptions } from './api.types';
import ApiConstants from './ApiConstants';
import { ItemSummaryApi } from './item-summary/ItemSummaryApi';
import { ExhaustionApi } from './exhaustion/ExhaustionApi';
import { ActorItemApi } from './actor-item/ActorItemApi';

/**
 * The Tidy 5e Sheets API. The API becomes available after the hook `tidy5e-sheet.ready` is called.
 * When the hook fires, it provides an instance of the API.
 * @example Getting the API for extending Tidy 5e Sheets
 * ```js
 * Hooks.once('tidy5e-sheet.ready', (api) => {
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

  /** {@inheritDoc ActionListApi} */
  actionList = new ActionListApi();

  /** {@inheritDoc ActorItemApi} */
  actorItem = new ActorItemApi();

  /**
   * Constants for a variety of uses.
   *
   * @remarks
   * When APIs call for specific IDs or selectors related to Tidy 5e Sheets,
   * using the related constant when available will insulate against breakage
   * when Tidy has internal changes.
   */
  constants = ApiConstants;

  /** {@inheritDoc ExhaustionApi} */
  exhaustion = new ExhaustionApi();

  /**
   * Determines whether the provided sheet is a Tidy 5e Character sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Character sheet
   */
  isTidy5eCharacterSheet(app: any) {
    return Tidy5eCharacterSheet.name === app?.constructor?.name;
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Item sheet.
   * @param app an item sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Item sheet
   */
  isTidy5eItemSheet(app: any) {
    return Tidy5eKgarItemSheet.name === app?.constructor?.name;
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e NPC sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is a Tidy 5e NPC sheet
   */
  isTidy5eNpcSheet(app: any) {
    return Tidy5eNpcSheet.name === app?.constructor?.name;
  }

  /**
   * Determines whether the provided sheet is any Tidy 5e sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is any Tidy 5e sheet
   */
  isTidy5eSheet(app: any) {
    return [
      Tidy5eCharacterSheet.name,
      Tidy5eNpcSheet.name,
      Tidy5eVehicleSheet.name,
      Tidy5eKgarItemSheet.name,
    ].includes(app?.constructor?.name);
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Vehicle sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Vehicle sheet
   */
  isTidy5eVehicleSheet(app: any) {
    return Tidy5eVehicleSheet.name === app.constructor.name;
  }

  /**{@inheritDoc ItemSummaryApi} */
  itemSummary = new ItemSummaryApi();

  /**
   * Various models can be used for API calls.
   */
  models = {
    HandlebarsTab: HandlebarsTab,
    HtmlTab: HtmlTab,
    SvelteTab: SvelteTab,
  };

  /**
   * Adds a tab to the available sheet tabs for all actor types that Tidy 5e supports.
   * @param {SupportedTab} tab the information necessary to render a tab
   * @param {object} [options] sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
   * @param layout an optional sheet layout or layouts (default: 'all')
   * @returns void
   */
  registerActorTab(tab: SupportedTab, options?: ActorTabRegistrationOptions) {
    this.registerCharacterTab(tab, options);
    this.registerNpcTab(tab, options);
    this.registerVehicleTab(tab, options);
  }

  /**
   * Adds a tab to the available Character sheet tabs.
   * @param {SupportedTab} tab the information necessary to render a tab
   * @param {object} [options] sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
   * @param layout an optional sheet layout or layouts (default: 'all')
   * @returns void
   *
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
   *       onRender(params) {
   *         const myTab = $(params.tabContentsElement);
   *         myTab.find('.my-control').click(_myHandler.bind(params.app));
   *       },
   *     })
   *   );
   * });
   * ```
   *
   * @example Overriding an existing sheet tab
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerCharacterTab(
   *     new api.models.HandlebarsTab({
   *       title: 'The New Inventory Tab',
   *       path: '/modules/my-module-id/templates/my-handlebars-template.hbs',
   *       tabId: api.constants.TAB_ID_CHARACTER_INVENTORY,
   *       getData: async (data) => {
   *         data['my-message'] = 'Hello, world! 🌊🏄‍♂️';
   *         return new Promise((resolve) => {
   *           resolve(data);
   *         });
   *       },
   *       onRender(params) {
   *         const myTab = $(params.tabContentsElement);
   *         myTab.find('.my-control').click(_myHandler.bind(params.app));
   *       },
   *     }),
   *     {
   *       overrideExisting: true,
   *     }
   *   );
   * });
   * ```
   *
   *
   * @remarks
   * A tab ID is always required (see {@link TabId}).
   */
  registerCharacterTab(
    tab: SupportedTab,
    options?: ActorTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTab = TabManager.mapCustomTabToRegisteredTab(
      tab,
      options?.layout
    );

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    CharacterSheetRuntime.registerTab(registeredTab, options);
  }

  /**
   * Adds a tab to all relevant item sheets.
   * @see {@link CustomTabBase} for options related to all tabs.
   * @param tab the custom tab settings to use when incorporating this tab.
   * @example Register an item tab for spell items only, adding some custom data to the Item Sheet Context object before rendering my handlebars template
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerItemTab(
   *     new api.models.HandlebarsTab({
   *       title: 'My Item Tab',
   *       tabId: 'my-module-id-my-item-tab',
   *       path: '/modules/my-module-id/my-item-tab.hbs',
   *       enabled: (data) => data.item.type === 'spell',
   *       getData: (data) => {
   *         data['my-extra-data'] = 'Hello, world! 👋';
   *         return data;
   *       },
   *       onRender(params) {
   *         const myTab = $(params.tabContentsElement);
   *         myTab.find('.my-control').click(_myHandler.bind(params.app));
   *       },
   *     }));
   * });
   * ```
   *
   * @remarks
   * A tab ID is always required (see {@link TabId}).
   */
  registerItemTab(tab: SupportedTab): void {
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
   * Adds a tab to the available NPC sheet tabs.
   * @param {SupportedTab} tab the information necessary to render a tab
   * @param {object} [options] sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
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
   *       onRender(params) {
   *         const myTab = $(params.tabContentsElement);
   *         myTab.find('.my-control').click(_myHandler.bind(params.app));
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
    tab: SupportedTab,
    options?: ActorTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }
    const registeredTab = TabManager.mapCustomTabToRegisteredTab(
      tab,
      options?.layout
    );

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    NpcSheetRuntime.registerTab(registeredTab);
  }

  /**
   * Adds a tab to the available Vehicle sheet tabs.
   * @param {SupportedTab} tab the information necessary to render a tab
   * @param {object} [options] sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
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
   *       onRender(params) {
   *         const myTab = $(params.tabContentsElement);
   *         myTab.find('.my-control').click(_myHandler.bind(params.app));
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
    tab: SupportedTab,
    options?: ActorTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }
    const registeredTab = TabManager.mapCustomTabToRegisteredTab(
      tab,
      options?.layout
    );

    if (!registeredTab) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    VehicleSheetRuntime.registerTab(registeredTab);
  }
}
