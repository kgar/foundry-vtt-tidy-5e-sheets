import { HandlebarsTab } from './tab/HandlebarsTab';
import { HtmlTab } from './tab/HtmlTab';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import type { CustomTabBase } from './tab/CustomTabBase';
import { warn } from 'src/utils/logging';
import CharacterSheetClassicRuntime from 'src/runtime/actor/CharacterSheetClassicRuntime.svelte';
import { TabManager } from 'src/runtime/tab/TabManager';
import type { TabId } from './tab/CustomTabBase';
import { SvelteTab } from './tab/SvelteTab';
import type {
  SupportedTab,
  ActorTabRegistrationOptions,
  ContentRegistrationOptions,
  SupportedContent,
  ItemTabRegistrationOptions,
  HeaderControlRegistrationParams,
  TabIdDocumentItemTypesParams,
  TabIdDocumentItemTypesOptions,
  ExistingTabAssociationOptions,
} from './api.types';
import ApiConstants from './ApiConstants';
import { HtmlContent } from './content/HtmlContent';
import { HandlebarsContent } from './content/HandlebarsContent';
import { CONSTANTS } from 'src/constants';
import { CustomContentManager } from 'src/runtime/content/CustomContentManager';
import { ConfigApi } from './config/ConfigApi';
import { HeaderControlsRuntime } from 'src/runtime/header-controls/HeaderControlsRuntime';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import GroupSheetClassicRuntime from 'src/runtime/actor/GroupSheetClassicRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import VehicleSheetClassicRuntime from 'src/runtime/actor/VehicleSheetClassicRuntime.svelte';
import { TidySvelteApi } from './svelte/TidySvelteApi';
import { TabDocumentItemTypesRuntime } from 'src/runtime/item/TabDocumentItemTypesRuntime';
import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';
import EncounterSheetClassicRuntime from 'src/runtime/actor/EncounterSheetClassicRuntime.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';

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
 * @example Getting the API from the module
 * ```js
 * game.modules.get('tidy5e-sheet').api
 * ```
 *
 * @remarks
 * It is recommended to retrieve the API from the `tidy5e-sheet.ready` hook, since the hook guarantees that the API has been initialized.
 *
 * @category Main
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
  /** @deprecated api.actionList API has been moved to api.config.actionList */
  get actionList() {
    warn('api.actionList API has been moved to api.config.actionList');
    return this.config.actionList;
  }

  /** {@inheritDoc ActorItemApi} */
  /** @deprecated api.actorItem API has been moved to api.config.actorItem */
  get actorItem() {
    warn('api.actorItem API has been moved to api.config.actorItem');
    return this.config.actorItem;
  }

  /** {@inheritDoc ActorPortraitApi} */
  /** @deprecated api.actorPortrait API has been moved to api.config.actorPortrait */
  get actorPortrait() {
    warn('api.actorPortrait API has been moved to api.config.actorPortrait');
    return this.config.actorPortrait;
  }

  /** {@inheritDoc ConfigApi} */
  config = new ConfigApi();

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
  /** @deprecated api.exhaustion API has been moved to api.config.exhaustion */
  get exhaustion() {
    warn('api.exhaustion API has been moved to api.config.exhaustion');
    return this.config.exhaustion;
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Character sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Character sheet
   */
  isTidy5eCharacterSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet.character`
    );
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Container sheet.
   * @param app a container sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Container sheet
   */
  isTidy5eContainerSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet.container`
    );
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Group sheet.
   * @param app a group sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Group sheet
   */
  isTidy5eGroupSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet.group`
    );
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Item sheet.
   * @param app an item sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Item sheet
   */
  isTidy5eItemSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet.item`
    );
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e NPC sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is a Tidy 5e NPC sheet
   */
  isTidy5eNpcSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet.npc`
    );
  }

  /**
   * Determines whether the provided sheet is any Tidy 5e sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is any Tidy 5e sheet
   */
  isTidy5eSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet`
    );
  }

  /**
   * Determines whether the provided sheet is a Tidy 5e Vehicle sheet.
   * @param app an actor sheet
   * @returns boolean indicating if the sheet is a Tidy 5e Vehicle sheet
   */
  isTidy5eVehicleSheet(app: any) {
    return this.#maybeElementMatchesSelector(
      app.element,
      `.tidy5e-sheet.sheet.vehicle`
    );
  }

  #maybeElementMatchesSelector(element: any, selector: string) {
    return (
      element && element instanceof HTMLElement && !!element.matches(selector)
    );
  }

  /**{@inheritDoc ItemSummaryApi} */
  /** @deprecated api.itemSummary API has been moved to api.config.actorPortrait */
  get itemSummary() {
    warn('api.itemSummary API has been moved to api.config.actorPortrait');
    return this.config.itemSummary;
  }

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
   * @returns void
   */
  registerActorTab(tab: SupportedTab, options?: ActorTabRegistrationOptions) {
    this.registerCharacterTab(tab, options);
    this.registerEncounterTab(tab, options);
    this.registerGroupTab(tab, options);
    this.registerNpcTab(tab, options);
    this.registerVehicleTab(tab, options);
  }

  /**
   * Adds a tab to the available Character sheet sidebar tabs.
   * @param tab the information necessary to render a tab
   * @param options sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
   * @returns void
   *
   * @example Registering a handlebars-based character sheet tab
   * ```js
   * Hooks.on('tidy5e-sheet.ready', (api) => {
   *   api.registerCharacterSidebarTab(
   *     new api.models.HtmlTab({
   *       title: 'My Tab',
   *       iconClass: 'fa-solid fa-spaghetti-monster-flying',
   *       html: `
   *         <h1>Hello, world!</h1>
   *         <p>
   *           Behold my sidebar tab, forged in the fires of Mt. Doom and registered in the API via a script in a hook.
   *           The eldritch power of this JavaScript allows you to fire 4 beams which each deal 1d10 force damage.
   *         </p>
   *       `,
   *       tabId: 'my-module-id-registered-character-tab',
   *     })
   *   );
   * });
   * ```
   *
   */
  registerCharacterSidebarTab(
    tab: SupportedTab,
    options?: ActorTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTabs = TabManager.mapToRegisteredTabs(tab, options?.layout);

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetQuadroneSidebarRuntime.registerTab(
          registeredTab,
          options
        );
      }
    }
  }

  /**
   * Adds a tab to the available Character sheet tabs.
   * @param {SupportedTab} tab the information necessary to render a tab
   * @param {object} [options] sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
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
   *         return Promise.resolve(data);
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
   *         return Promise.resolve(data);
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

    const registeredTabs = TabManager.mapToRegisteredTabs(tab, options?.layout);

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetClassicRuntime.registerTab(registeredTab, options);
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetQuadroneRuntime.registerTab(registeredTab, options);
      }
    }
  }

  registerEncounterTab(
    tab: SupportedTab,
    options?: ActorTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTabs = TabManager.mapToRegisteredTabs(tab, options?.layout);

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        EncounterSheetClassicRuntime.registerTab(registeredTab, options);
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        EncounterSheetQuadroneRuntime.registerTab(registeredTab, options);
      }
    }
  }

  /**
   * Adds a tab to the available Group sheet tabs.
   * @param {SupportedTab} tab the information necessary to render a tab
   * @param {object} [options] sheet registration options
   * @param {string} [options.layout] an optional sheet layout or layouts (default: 'all')
   * @param {string} [options.overrideExisting] if a tab with this ID already exists, override it
   * @returns void
   *
   * @example Registering a handlebars-based group sheet tab
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerGroupTab(
   *     new api.models.HandlebarsTab({
   *       title: 'My Tab',
   *       path: '/modules/my-module-id/templates/my-handlebars-template.hbs',
   *       tabId: 'my-module-id-registered-group-tab',
   *       getData: async (data) => {
   *         data['my-message'] = 'Hello, world! 🌊🏄‍♂️';
   *         return Promise.resolve(data);
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
   *   api.registerGroupTab(
   *     new api.models.HandlebarsTab({
   *       title: 'The New Inventory Tab',
   *       path: '/modules/my-module-id/templates/my-handlebars-template.hbs',
   *       tabId: api.constants.TAB_ID_GROUP_INVENTORY,
   *       getData: async (data) => {
   *         data['my-message'] = 'Hello, world! 🌊🏄‍♂️';
   *         return Promise.resolve(data);
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
   * @remarks
   * A tab ID is always required (see {@link TabId}).
   */
  registerGroupTab(
    tab: SupportedTab,
    options?: ActorTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTabs = TabManager.mapToRegisteredTabs(tab, options?.layout);

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        GroupSheetClassicRuntime.registerTab(registeredTab, options);
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        GroupSheetQuadroneRuntime.registerTab(registeredTab, options);
      }
    }
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
   *         selector: `[data-tidy-sheet-part="${api.constants.SHEET_PARTS.NAME_CONTAINER}"]`
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
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetClassicRuntime.registerContent(registeredContent);
        EncounterSheetClassicRuntime.registerContent(registeredContent);
        GroupSheetClassicRuntime.registerContent(registeredContent);
        NpcSheetClassicRuntime.registerContent(registeredContent);
        VehicleSheetClassicRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetQuadroneRuntime.registerContent(registeredContent);
        EncounterSheetQuadroneRuntime.registerContent(registeredContent);
        GroupSheetQuadroneRuntime.registerContent(registeredContent);
        NpcSheetQuadroneRuntime.registerContent(registeredContent);
        VehicleSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
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
   *         selector: `[data-tidy-sheet-part="${api.constants.SHEET_PARTS.NAME_CONTAINER}"]`
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
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetClassicRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        CharacterSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
  }

  registerEncounterContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        EncounterSheetClassicRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        EncounterSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
  }

  /**
   * Adds custom content to group sheets at `position` relative to `selector`.
   *
   * @param content the information necessary to render custom content
   * @param options custom content registration options
   * @returns void
   *
   * @example registering an icon next to the group sheet name
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerGroupContent(
   *     new api.models.HtmlContent({
   *       html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
   *       injectParams: {
   *         selector: `[data-tidy-sheet-part="${api.constants.SHEET_PARTS.NAME_CONTAINER}"]`
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
  registerGroupContent(
    content: SupportedContent,
    options?: ContentRegistrationOptions
  ) {
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        GroupSheetClassicRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        GroupSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
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
   *         selector: `[data-tidy-sheet-part="${api.constants.SHEET_PARTS.NAME_CONTAINER}"]`
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
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        ItemSheetRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        ItemSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
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
   *         selector: `[data-tidy-sheet-part="${api.constants.SHEET_PARTS.NAME_CONTAINER}"]`
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
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        NpcSheetClassicRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        NpcSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
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
   *         selector: `[data-tidy-sheet-part="${api.constants.SHEET_PARTS.NAME_CONTAINER}"]`
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
    const registeredContents = CustomContentManager.mapToRegisteredContents(
      content,
      options?.layout
    );

    if (!registeredContents) {
      warn('Unable to register content. Content type not supported.');
      return;
    }

    for (let registeredContent of registeredContents) {
      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        VehicleSheetClassicRuntime.registerContent(registeredContent);
      }

      if (
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredContent.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        VehicleSheetQuadroneRuntime.registerContent(registeredContent);
      }
    }
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
   * @example Register an item tab with autoHeight, similar to how Details item tabs work.
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.registerItemTab(
   *     new api.models.HtmlTab({
   *       title: "My Item Tab",
   *       tabId: "my-module-id-my-item-tab",
   *       html: "<h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h1>LOREM! IPSUM! FIREBALLLLLL!!</h1><h2>🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥</h2>",
   *     }),
   *     { autoHeight: true } // 👈 With Auto Height set to `true`, the item window will stretch as tall as it can to match the content height when this tab is viewed.
   *   );
   * });
   * ```
   *
   * @example Register an item tab that can only be used on consumable and weapon sheets.
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api: Tidy5eSheetsApi) => {
   *   api.registerItemTab(
   *     new api.models.HtmlTab({
   *       title: 'My Item Tab',
   *       tabId: 'my-module-id-my-item-tab',
   *       html: '<h1>LO! AND BEHOLD!</h1>',
   *     }),
   *     {
   *       types: ['consumable', 'weapon'],
   *     }
   *   );
   * });
   * ```
   *
   * @example Register an item tab that can only be used on the subclass sheet.
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api: Tidy5eSheetsApi) => {
   *  api.registerItemTab(
   *    new api.models.HtmlTab({
   *      title: 'My Item Tab',
   *      tabId: 'my-module-id-my-item-tab',
   *      html: '<h1>BEHOLD THIS SUBLIME TAB</h1>',
   *    }),
   *    { types: 'subclass' }
   *  );
   * });
   * ```
   * @remarks
   * A tab ID is always required (see {@link TabId}).
   */
  registerItemTab(
    tab: SupportedTab,
    options?: ItemTabRegistrationOptions
  ): void {
    if (!TabManager.validateTab(tab)) {
      return;
    }

    const registeredTabs = TabManager.mapToRegisteredTabs(
      tab,
      options?.layout,
      options?.types
    );

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (options?.autoHeight) {
        registeredTab.autoHeight = options.autoHeight;
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        ItemSheetRuntime.registerTab(registeredTab);
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        ItemSheetQuadroneRuntime.registerTab(registeredTab, options);
      }
    }
  }

  /**
   * Associates an existing tab by Tab ID with an item subtype.
   * **Note that Details tabs (tab ID `details`) will not associate properly.**
   * @param itemSubtype the item subtype key (e.g., loot, equipment, weapon, spell)
   * @param tabId the tab ID for the target tab to update
   * @param options additional, optional aspects that can be configured
   */
  associateExistingItemTab(
    itemSubtype: string,
    tabId: string,
    options?: ExistingTabAssociationOptions
  ) {
    ItemSheetQuadroneRuntime.associateExistingTab(itemSubtype, tabId, options);
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
   *         return Promise.resolve(data);
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
    const registeredTabs = TabManager.mapToRegisteredTabs(tab, options?.layout);

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        NpcSheetClassicRuntime.registerTab(registeredTab, options);
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        NpcSheetQuadroneRuntime.registerTab(registeredTab, options);
      }
    }
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
   *         return Promise.resolve(data);
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
    const registeredTabs = TabManager.mapToRegisteredTabs(tab, options?.layout);

    if (!registeredTabs) {
      warn('Unable to register tab. Tab type not supported');
      return;
    }

    for (let registeredTab of registeredTabs) {
      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_CLASSIC ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        VehicleSheetClassicRuntime.registerTab(registeredTab, options);
      }

      if (
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_QUADRONE ||
        registeredTab.layout === CONSTANTS.SHEET_LAYOUT_ALL
      ) {
        VehicleSheetQuadroneRuntime.registerTab(registeredTab, options);
      }
    }
  }

  /**
   * Registers header controls for all Tidy Application V2 Actor sheets.
   *
   * @param params parameters for registering header controls
   *
   * @example Registering a header with an icon, a label, and a handler
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerActorHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-hand-sparkles',
   *         label: 'Say Hello',
   *         async onClickAction() {
   *           ui.notifications.info(`Hello, Foundry!`);
   *         },
   *       },
   *     ],
   *   });
   * });
   * ```
   *
   * @example Registering a header control with a lot of settings.
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerActorHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-broom',
   *         label: 'Debug Button',
   *         visible() {
   *           return !this.document.collection?.locked;
   *         },
   *         async onClickAction(event) {
   *           ui.notifications.info(
   *             `Logged document data for ${this.document.name} to console for review.`
   *           );
   *           console.log(this.document);
   *           console.log(await this.document.sheet._prepareContext());
   *         },
   *         ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *       },
   *     ],
   *   });
   * });
   * ```
   */
  registerActorHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Actor'],
      }))
    );
  }

  /**
   * Registers header controls for all Tidy Application V2 Character sheets.
   *
   * @param params parameters for registering header controls
   *
   * @example Registering a header control with a lot of settings.
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerCharacterHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-broom',
   *         label: 'Debug Button',
   *         visible() {
   *           return !this.document.collection?.locked;
   *         },
   *         async onClickAction(event) {
   *           ui.notifications.info(
   *             `Logged document data for ${this.document.name} to console for review.`
   *           );
   *           console.log(this.document);
   *           console.log(await this.document.sheet._prepareContext());
   *         },
   *         ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *       },
   *     ],
   *   });
   * });
   * ```
   */
  registerCharacterHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Actor'],
        documentTypes: [CONSTANTS.SHEET_TYPE_CHARACTER],
      }))
    );
  }

  registerEncounterHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Actor'],
        documentTypes: [CONSTANTS.SHEET_TYPE_ENCOUNTER],
      }))
    );
  }

  /**
   * Registers header controls for all Tidy Application V2 Group sheets.
   *
   * @param params parameters for registering header controls
   *
   * @example Registering a header control with a lot of settings.
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerGroupHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-broom',
   *         label: 'Debug Button',
   *         visible() {
   *           return !this.document.collection?.locked;
   *         },
   *         async onClickAction(event) {
   *           ui.notifications.info(
   *             `Logged document data for ${this.document.name} to console for review.`
   *           );
   *           console.log(this.document);
   *           console.log(await this.document.sheet._prepareContext());
   *         },
   *         ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *       },
   *     ],
   *   });
   * });
   * ```
   */
  registerGroupHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Actor'],
        documentTypes: [CONSTANTS.SHEET_TYPE_GROUP],
      }))
    );
  }

  /**
   * Registers header controls for all Tidy Application V2 Item sheets.
   *
   * @param params parameters for registering header controls
   *
   * @example Registering a header control for containers only and with fairly involved usage of the parameters.
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerItemHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-coins',
   *         label: 'Take all the coin!',
   *         visible() {
   *           return (
   *             this.document.type === 'container' &&
   *             this.document.actor &&
   *             this.document.isOwner
   *           );
   *         },
   *         async onClickAction(event) {
   *           ui.notifications.info(`Taking all the money out of the bag!`);
   *           const actorCurrency = this.actor.toObject().system.currency;
   *           const containerCurrency = this.document.toObject().system.currency;
   *           for (let [key, value] of Object.entries(containerCurrency)) {
   *             actorCurrency[key] += containerCurrency[key];
   *             containerCurrency[key] = 0;
   *           }
   *           this.actor.update({
   *             system: {
   *               currency: actorCurrency,
   *             },
   *           });
   *           this.document.update({
   *             system: {
   *               currency: containerCurrency,
   *             },
   *           });
   *         },
   *         ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *       },
   *     ],
   *   });
   * });
   * ```
   */
  registerItemHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Item'],
      }))
    );
  }

  /**
   * Registers header controls for all Tidy Application V2 NPC sheets.
   *
   * @param params parameters for registering header controls
   *
   * @example Registering a header control with a lot of settings.
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerNpcHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-broom',
   *         label: 'Debug Button',
   *         visible() {
   *           return !this.document.collection?.locked;
   *         },
   *         async onClickAction(event) {
   *           ui.notifications.info(
   *             `Logged document data for ${this.document.name} to console for review.`
   *           );
   *           console.log(this.document);
   *           console.log(await this.document.sheet._prepareContext());
   *         },
   *         ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *       },
   *     ],
   *   });
   * });
   * ```
   */
  registerNpcHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Actor'],
        documentTypes: [CONSTANTS.SHEET_TYPE_NPC],
      }))
    );
  }

  /**
   * Registers header controls for all Tidy Application V2 Vehicle sheets.
   *
   * @param params parameters for registering header controls
   *
   * @example Registering a header control with a lot of settings.
   *
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.registerVehicleHeaderControls({
   *     controls: [
   *       {
   *         icon: 'fas fa-broom',
   *         label: 'Debug Button',
   *         visible() {
   *           return !this.document.collection?.locked;
   *         },
   *         async onClickAction(event) {
   *           ui.notifications.info(
   *             `Logged document data for ${this.document.name} to console for review.`
   *           );
   *           console.log(this.document);
   *           console.log(await this.document.sheet._prepareContext());
   *         },
   *         ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
   *       },
   *     ],
   *   });
   * });
   * ```
   */
  registerVehicleHeaderControls(params: HeaderControlRegistrationParams) {
    HeaderControlsRuntime.registerHeaderControls(
      params.controls.map((c) => ({
        ...c,
        supportedDocuments: ['Actor'],
        documentTypes: [CONSTANTS.SHEET_TYPE_VEHICLE],
      }))
    );
  }

  /**
   * Svelte-specific integration content. This content is currently experimental
   * and may be subject to change based on integration efforts of other
   * svelte-based modules.
   */
  svelte = TidySvelteApi;

  /**
   * Wraps the provided HTML so that Tidy will remove the content when handling document changes.
   * @param html any HTML string that needs to be re-rendered in the style of Foundry Handlebars (usually, this is any time the target document or its embedded documents change).
   * @returns the original HTML with a transparent element wrapped around which indicates to Tidy that this should be removed and re-rendered.
   *
   * @remarks
   * The intended use of this function is to accompany the use of the `tidy5e-sheet.renderActorSheet` hook in App V1 (PCs, NPCs, Vehicles)
   * or the standard sheet render hooks in App V2 (Items, Containers, Groups).
   * Any content injected through those hooks needs to be wrapped in this way so that the old version
   * of the HTML can be removed before adding it back in.
   * Handlebars refreshes content in this way, but for Tidy purposes, the module needs to know when an arbitrary
   * segment of HTML is meant to be removed. This function provides that information to Tidy for your HTML.
   *
   * @example Injecting dynamic HTML through Tidy actor sheet render hook
   * ```js
   * Hooks.on('tidy5e-sheet.renderActorSheet', (app, element, data) => {
   *   const api = game.modules.get('tidy5e-sheet').api;
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

  /**
   * Registers additional mappings of tab ID to item types, controlling available options when clicking a "create"
   * button for a given tab.
   *
   * @param params  params for registration (`tabId` and an array of `documentItemTypes`)
   * @param options options for registration (currently `mode`: 'merge' or 'override')
   *
   * @example Allowing creation of Spells on some newly-registered tab with ID `'my-new-tab'`
   * ```js
   * Hooks.on('tidy5e-sheet.ready', (api) => {
   *   api.registerTabIdDocumentItemTypes({ tabId: 'my-new-tab', documentItemTypes: ['spell'] });
   * });
   * ```
   */
  registerTabIdDocumentItemTypes(
    params: TabIdDocumentItemTypesParams,
    options?: TabIdDocumentItemTypesOptions
  ) {
    TabDocumentItemTypesRuntime.registerTypes(params, options);
  }
}
