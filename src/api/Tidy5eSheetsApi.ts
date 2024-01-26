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
import type {
  SupportedTab,
  ActorTabRegistrationOptions,
  ContentRegistrationOptions,
  SupportedContent,
} from './api.types';
import ApiConstants from './ApiConstants';
import { ItemSummaryApi } from './item-summary/ItemSummaryApi';
import { ExhaustionApi } from './exhaustion/ExhaustionApi';
import { HtmlContent } from './content/HtmlContent';
import { HandlebarsContent } from './content/HandlebarsContent';
import { CONSTANTS } from 'src/constants';
import { CustomContentManager } from 'src/runtime/content/CustomContentManager';
import { ActorItemApi } from './actor-item/ActorItemApi';
import { ActorPortraitApi } from './actor-portrait/ActorPortraitApi';

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

  /** {@inheritDoc ActorPortraitApi} */
  actorPortrait = new ActorPortraitApi();

  /**
   * Constants for a variety of uses.
   *
   * @remarks
   * When APIs call for specific IDs or selectors related to Tidy 5e Sheets,
   * using the related constant when available will insulate against breakage
   * when Tidy has internal changes.
   */
  constants = ApiConstants;

  /**
   * Creates a selector which allows for locating a part of a given sheet.
   * @param sheetPart a part of the sheet as found in `api.constants.SHEET_PARTS`
   * @returns an HTML selector valid for use with JavaScript query selectors
   */
  getSheetPartSelector(sheetPart: string) {
    return `[${CONSTANTS.SHEET_PART_ATTRIBUTE}="${sheetPart}"]`;
  }

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
    HandlebarsContent: HandlebarsContent,
    HtmlContent: HtmlContent,
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
   * Adds custom content to all actor sheets at `position` relative to `selector`.
   *
   * @param content the information necessary to render custom content
   * @param options custom content registration options
   * @returns void
   *
   * @example registering an icon next to the actor sheet name
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerActorContent(
   *     new api.models.HtmlContent({
   *       html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
   *       injectParams: {
   *         selector: api.getSheetPartSelector(
   *           api.constants.SHEET_PARTS.NAME_CONTAINER
   *         ),
   *         position: "beforebegin",
   *       },
   *       onContentReady: (params) => {
   *         console.log("content ready to render", params);
   *         console.log("my content", params.content);
   *       },
   *       onRender: (params) => {
   *         params.element
   *           .querySelector(".my-custom-icon")
   *           .addEventListener("click", () => alert("Clicked custom actor icon"));
   *       },
   *     })
   *   );
   * });
   * ```
   */
  registerActorContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContent = CustomContentManager.mapToRegisteredContent(
      content,
      options?.layout
    );

    if (!registeredContent) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    CharacterSheetRuntime.registerContent(registeredContent);
    NpcSheetRuntime.registerContent(registeredContent);
    VehicleSheetRuntime.registerContent(registeredContent);
  }

  /**
   * Adds custom content to player character sheets at `position` relative to `selector`.
   *
   * @param content the information necessary to render custom content
   * @param options custom content registration options
   * @returns void
   *
   * @example registering an icon next to the character sheet name
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerCharacterContent(
   *     new api.models.HtmlContent({
   *       html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
   *       injectParams: {
   *         selector: api.getSheetPartSelector(
   *           api.constants.SHEET_PARTS.NAME_CONTAINER
   *         ),
   *         position: "beforebegin",
   *       },
   *       onContentReady: (params) => {
   *         console.log("content ready to render", params);
   *         console.log("my content", params.content);
   *       },
   *       onRender: (params) => {
   *         params.element
   *           .querySelector(".my-custom-icon")
   *           .addEventListener("click", () => alert("Clicked custom PC icon"));
   *       },
   *     })
   *   );
   * });
   * ```
   */
  registerCharacterContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContent = CustomContentManager.mapToRegisteredContent(
      content,
      options?.layout
    );

    if (!registeredContent) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    CharacterSheetRuntime.registerContent(registeredContent);
  }

  /**
   * Adds custom content to item sheets at `position` relative to `selector`.
   *
   * @param content the information necessary to render custom content
   * @param options custom content registration options
   * @returns void
   *
   * @example registering an icon next to the item sheet name
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerItemContent(
   *     new api.models.HtmlContent({
   *       html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-flask"></i></a>`,
   *       injectParams: {
   *         selector: api.getSheetPartSelector(
   *           api.constants.SHEET_PARTS.NAME_CONTAINER
   *         ),
   *         position: "beforebegin",
   *       },
   *       onContentReady: (params) => {
   *         console.log("content ready to render", params);
   *         console.log("my content", params.content);
   *       },
   *       onRender: (params) => {
   *         params.element
   *           .querySelector(".my-custom-icon")
   *           .addEventListener("click", () => alert("Clicked custom item icon"));
   *       },
   *     })
   *   );
   * });
   * ```
   */
  registerItemContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContent = CustomContentManager.mapToRegisteredContent(
      content,
      options?.layout
    );

    if (!registeredContent) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    ItemSheetRuntime.registerContent(registeredContent);
  }

  /**
   * Adds custom content to NPC sheets at `position` relative to `selector`.
   *
   * @param content the information necessary to render custom content
   * @param options custom content registration options
   * @returns void
   *
   * @example registering an icon next to the NPC sheet name
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerNpcContent(
   *     new api.models.HtmlContent({
   *       html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
   *       injectParams: {
   *         selector: api.getSheetPartSelector(
   *           api.constants.SHEET_PARTS.NAME_CONTAINER
   *         ),
   *         position: "beforebegin",
   *       },
   *       onContentReady: (params) => {
   *         console.log("content ready to render", params);
   *         console.log("my content", params.content);
   *       },
   *       onRender: (params) => {
   *         params.element
   *           .querySelector(".my-custom-icon")
   *           .addEventListener("click", () => alert("Clicked custom NPC icon"));
   *       },
   *     })
   *   );
   * });
   * ```
   */
  registerNpcContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContent = CustomContentManager.mapToRegisteredContent(
      content,
      options?.layout
    );

    if (!registeredContent) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    NpcSheetRuntime.registerContent(registeredContent);
  }

  /**
   * Adds custom content to vehicle sheets at `position` relative to `selector`.
   *
   * @param content the information necessary to render custom content
   * @param options custom content registration options
   * @returns void
   *
   * @example registering an icon next to the vehicle sheet name
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerVehicleContent(
   *     new api.models.HtmlContent({
   *       html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
   *       injectParams: {
   *         selector: api.getSheetPartSelector(
   *           api.constants.SHEET_PARTS.NAME_CONTAINER
   *         ),
   *         position: "beforebegin",
   *       },
   *       onContentReady: (params) => {
   *         console.log("content ready to render", params);
   *         console.log("my content", params.content);
   *       },
   *       onRender: (params) => {
   *         params.element
   *           .querySelector(".my-custom-icon")
   *           .addEventListener("click", () => alert("Clicked Vehicle custom icon"));
   *       },
   *     })
   *   );
   * });
   * ```
   */
  registerVehicleContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContent = CustomContentManager.mapToRegisteredContent(
      content,
      options?.layout
    );

    if (!registeredContent) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    VehicleSheetRuntime.registerContent(registeredContent);
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

  /**
   * Wraps the provided HTML so that Tidy will remove the content when handling document changes.
   * @param html any HTML string that needs to be re-rendered in the style of Foundry Handlebars (usually, this is any time the target document or its embedded documents change).
   * @returns the original HTML with a transparent element wrapped around which indicates to Tidy that this should be removed and re-rendered.
   *
   * @remarks
   * The intended use of this function is to accompany the use of the `tidy5e-sheet.renderActorSheet` or `tidy5e-sheet.renderItemSheet` hook.
   * Any content injected through those hooks needs to be wrapped in this way so that the old version
   * of the HTML can be removed before adding it back in.
   * Handlebars refreshes content in this way, but for Tidy purposes, the module needs to know when an arbitrary
   * segment of HTML is meant to be removed. This function provides that information to Tidy for your HTML.
   *
   * @example Injecting dynamic HTML through Tidy actor sheet render hook
   * ```js
   * Hooks.on('tidy5e-sheet.renderActorSheet', (app, element, data) => {
   *   const api = game.modules.get('tidy5e-sheet-kgar').api;
   *   const actorEmoji = data.actor.system.currency.pp > 0 ? '💹' : '📉';
   *   let iconHtml = api.useHandlebarsRendering(`<h1>${actorEmoji}</h1>`);
   *   // 👆 This HTML looks like `<div style="display: contents;" data-tidy-render-scheme="handlebars"><h1>📉</h1></div>` 
   *   // if the actor doesn't have at least 1 platinum.
   *   // Tidy will remove this each time the sheet would normally re-render, and it will add it back.
   *   // When the actor have more than 0 platinum, stonks will rise.
   *
   *   let actorNameElement = element.querySelector(`[data-tidy-field="name"]`);
   *   actorNameElement?.insertAdjacentHTML('afterend', iconHtml);
   * });
   * ```
   */
  useHandlebarsRendering(html: string): string {
    return `<div style="display: contents;" ${CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE}>${html}</div>`;
  }
}
