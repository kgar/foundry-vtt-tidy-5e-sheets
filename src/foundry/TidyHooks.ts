import type { Tidy5eSheetsApi } from 'src/api';
import type { ContextMenuPositionInfo } from 'src/context-menu/context-menu.types';
import type {
  ActiveEffect5e,
  Actor5e,
  ActorSheetContextV1,
  ActorSheetContextV2,
  CharacterSheetContext,
  NpcSheetContext,
  TidyResource,
  VehicleSheetContext,
} from 'src/types/types';
import type { ContextMenuEntry } from './foundry.types';
import type {
  ContainerSheetClassicContext,
  ContainerSheetHightouchContext,
  Item5e,
  ItemSheetContext,
} from 'src/types/item.types';
import type { Group5e } from 'src/types/group.types';

/** Manages all Hook usage in Tidy 5e Sheets */
export class TidyHooks {
  /**
   * The active effect context menu has established its options and is about to show.
   * @param {ActiveEffect5e} effect The active effect document instance.
   * @param {ContextMenuEntry[]} menuItems The menu items for this active effect.
   * @returns {boolean} `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('dnd5e.getActiveEffectContextOptions', (effect, menuItems) => {
   *   return true;
   * });
   * ```
   */
  static dnd5eGetActiveEffectContextOptions(
    effect: ActiveEffect5e,
    menuItems: ContextMenuEntry[]
  ): boolean {
    return Hooks.call('dnd5e.getActiveEffectContextOptions', effect, menuItems);
  }

  /**
   * Something has been dropped on an item or container sheet. Return `false` to prevent default behavior.
   * @param item the target item
   * @param app the target item sheet
   * @param data the drop data
   * @returns `false` to prevent default behavior, else the result is discarded
   */
  static dnd5eDropItemSheetData(item: Item5e, app: any, data: any): boolean {
    return Hooks.call('dnd5e.dropItemSheetData', item, app, data);
  }

  /**
   * The context menu for the advancements list has been constructed.
   * @param {jQuery} html The HTML element to which the context options are attached.
   * @param {ContextMenuEntry[]} contextOptions The context menu entries.
   * @returns {boolean} `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('dnd5e.getItemAdvancementContext', (html, contextOptions) => {
   *   return true;
   * });
   * ```
   */
  static dnd5eGetItemAdvancementContext(
    html: any,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call('dnd5e.getItemAdvancementContext', html, contextOptions);
  }

  /**
   * The item context menu has established its options and is about to show.
   * @param {Item5e} item The item document instance.
   * @param {ContextMenuEntry[]} menuItems The menu items for this item.
   * @returns {boolean} `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('dnd5e.getItemContextOptions', (item, menuItems) => {
   *   return true;
   * });
   * ```
   */
  static dnd5eGetItemContextOptions(
    item: Item5e,
    menuItems: ContextMenuEntry[]
  ): boolean {
    return Hooks.call('dnd5e.getItemContextOptions', item, menuItems);
  }

  /**
   * The context menu is about to show for a given item on a sheet.
   * @param {Item5e} item The item document instance.
   * @param {object} options The mouse event which triggered the context menu.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.actorItemUseContextMenu', (item, options) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsActorItemUseContextMenu(
    item: Item5e,
    options: { event: Event }
  ) {
    Hooks.callAll('tidy5e-sheet.actorItemUseContextMenu', item, options);
  }

  /**
   * An item is about to be used by an actor.
   * @param {Item5e} item The affected item document instance.
   * @param {any} config Any configuration for the item use.
   * @param {any} options Any options for the item use.
   * @returns {boolean} `true` to allow the item use, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.actorPreUseItem', (item, config, options) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsActorPreUseItem(item: Item5e, options: any): boolean {
    return Hooks.call('tidy5e-sheet.actorPreUseItem', item, options);
  }

  /**
   * The facility add button has been clicked for the specified facility type. Normally, this prompts the Compendium Browser.
   * @param event     The inciting event.
   * @param actor     The affected actor who will own the facility.
   * @param type      The type of facility that is intended to be added.
   * @returns         `true` to allow the default behavior, `false` to prevent it.
   */
  static tidy5eSheetsAddFacilityClicked(
    event: Event,
    actor: Actor5e,
    type: string
  ): boolean {
    return Hooks.call('tidy5e-sheet.addFacilityClicked', event, actor, type);
  }

  /**
   * An empty slot on a facility was clicked. Normally, this opens the Compendium Browser, scoped to actors of any type.
   * @param event The inciting click event
   * @param item The affected facility
   * @param occupantType The intended occupant type
   * @param prop The property path on the target facility to which changes would be applied
   * @returns `true` to allow the default behavior, `false` to prevent it.
   */
  static tidy5eSheetsFacilityEmptyOccupantSlotClicked(
    event: Event,
    item: Item5e,
    occupantType: string,
    prop: string
  ) {
    return Hooks.call(
      'tidy5e-sheet.facilityEmptyOccupantSlotClicked',
      event,
      item,
      occupantType,
      prop
    );
  }

  /**
   * The facility occupant context menu has established its options and is about to show.
   * @param actor           The affected actor.
   * @param facility        The affected facility.
   * @param occupantUuid    The occupant UUID.
   * @param prop            The property for saving changes to the target occupant.
   * @param index           The index of the occupant.
   * @param contextOptions  The menu items for this occupant.
   * @returns               `true` to allow the menu to show, `false` to prevent the default menu from showing.
   */
  static dnd5eGetFacilityOccupantContextOptions(
    actor: Actor5e,
    facility: Item5e,
    occupantUuid: string | null,
    prop: string | null,
    index: number | null,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.getFacilityOccupantContextOptions',
      actor,
      facility,
      occupantUuid,
      prop,
      index,
      contextOptions
    );
  }

  /**
   * The group member context menu has established its options and is about to show.
   * @param group             The affected group document instance.
   * @param member            The actor which is a member of the group.
   * @param contextOptions    The menu items for this group member.
   * @returns {boolean}       `true` to allow the menu to show, `false` to prevent the default menu from showing.
   */
  static tidy5eSheetsGetGroupMemberContextOptions(
    group: Group5e,
    member: Actor5e,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.getGroupMemberContextOptions',
      group,
      member,
      contextOptions
    );
  }

  /**
   * A user has hovered off an item, typically from an item table row.
   * @param {Event} event The triggering mouse event.
   * @param {any} item The item which is no longer hovered.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.itemHoverOff', (event, item) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsItemHoverOff(event: Event, item: any) {
    Hooks.callAll('tidy5e-sheet.itemHoverOff', event, item);
  }

  /**
   * A user has hovered over an item, typically on an item table row.
   * @param {Event} event The triggering mouse event.
   * @param {any} item The hovered-over item.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.itemHoverOn', (event, item) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsItemHoverOn(event: Event, item: any) {
    Hooks.callAll('tidy5e-sheet.itemHoverOn', event, item);
  }

  /**
   * Sheet item/effect sections are about to be configured. Use this hook to inject additional items, sections, etc., or to adjust context data.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet HTML element.
   * @param {CharacterSheetContext | NpcSheetContext | ContainerSheetClassicContext} data The data context from `getData()`.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preConfigureSections', (app, element, data) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsPreConfigureSections(
    app: any,
    element: HTMLElement,
    data:
      | CharacterSheetContext
      | NpcSheetContext
      | ContainerSheetClassicContext
      | ContainerSheetHightouchContext
  ) {
    Hooks.callAll('tidy5e-sheet.preConfigureSections', app, element, data);
  }

  /**
   * An active effect is about to be created for an owning document.
   * This was initiated specifically through Tidy 5e Sheets,
   * whether directly by the user, or indirectly through some user interaction.
   * @param {any} owner The owning document instance which will receive the created effect.
   * @param {object} createData The data used to create it.
   * @param {string} userId The user who initiated the creation.
   * @returns {boolean} `true` to allow the effect creation, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preCreateActiveEffect', (owner, createData, userId) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreCreateActiveEffect(
    owner: any,
    createData: object,
    userId: string
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.preCreateActiveEffect',
      owner,
      createData,
      userId
    );
  }

  /**
   * An item is about to be created for an owning document.
   * This was initiated specifically through Tidy 5e Sheets,
   * whether directly by the user, or indirectly through some user interaction.
   * @param {any} owner The owning document instance which will receive the created item.
   * @param {object} createData The data used to create it.
   * @param {string} userId The user who initiated the creation.
   * @returns {boolean} `true` to allow the item creation, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preCreateItem', (owner, createData, userId) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreCreateItem(
    owner: any,
    createData: object,
    userId: string
  ): boolean {
    return Hooks.call('tidy5e-sheet.preCreateItem', owner, createData, userId);
  }

  /**
   * The portrait picker is about to open.
   * @param {ActorSheetContextV1 | ActorSheetContextV2} context The actor sheet data from `getData()`.
   * @param {MouseEvent & { currentTarget: EventTarget & HTMLElement }} event The triggering event.
   * @returns {boolean} `true` to allow the picker to open, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preOpenActorPortraitFilePicker', (context, event) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreOpenActorPortraitFilePicker(
    context: ActorSheetContextV1 | ActorSheetContextV2,
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement }
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.preOpenActorPortraitFilePicker',
      context,
      event
    );
  }

  /**
   * The floating context menu's positioning is being determined.
   * @param {ContextMenuPositionInfo} positionInfo Context menu positioning info, used for determining where to put the context menu.
   * @returns {boolean} `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.prepareFloatingContextMenuPosition', (positionInfo) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPrepareFloatingContextMenuPosition(
    positionInfo: ContextMenuPositionInfo
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.prepareFloatingContextMenuPosition',
      positionInfo
    );
  }

  /**
   * Resources have been prepared. Use this hook to adjust them and/or add new resources.
   * @param {TidyResource[]} tidyResources The resources that have been prepared for the sheet.
   * @param {Actor5e} actor The affected actor.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.prepareResources', (tidyResources, actor) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsPrepareResources(
    tidyResources: TidyResource[],
    actor: Actor5e
  ) {
    Hooks.callAll('tidy5e-sheet.prepareResources', tidyResources, actor);
  }

  /**
   * A tab is about to be selected.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet's HTML element.
   * @param {object} data The current tab ID before selecting the new tab, and the new tab ID to be selected.
   * @returns {boolean} `false` to cancel tabbing.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preSelectTab', (app, element, data) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreSelectTab(
    app: any,
    element: HTMLElement,
    data: { currentTab: any; newTab: string }
  ): boolean {
    return Hooks.call('tidy5e-sheet.preSelectTab', app, element, data);
  }

  /**
   * Tidy 5e Sheets is ready to be used and customized.
   * @param {Tidy5eSheetsApi} api The Tidy 5e Sheets API, used for customizing and registering content with Tidy 5e Sheets.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.ready', (api) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsReady(api: Tidy5eSheetsApi): void {
    Hooks.callAll('tidy5e-sheet.ready', api);
  }

  /**
   * The actor sheet has rendered all content and registered custom content. Is called on partial and full renders.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet's HTML element.
   * @param {CharacterSheetContext | NpcSheetContext | VehicleSheetContext} data The data context from `getData()`.
   * @param {boolean} forced `true` when performing a full re-render; `false` when performing a partial re-render.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.renderActorSheet', (app, element, data, forced) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsRenderActorSheet(
    app: any,
    element: HTMLElement,
    data: CharacterSheetContext | NpcSheetContext | VehicleSheetContext,
    forced: boolean
  ) {
    Hooks.callAll('tidy5e-sheet.renderActorSheet', app, element, data, forced);
  }

  /**
   * The item sheet has rendered all content and registered custom content. Is called on partial and full renders.
   * @param {any} app The target item sheet application class instance.
   * @param {HTMLElement} element The item sheet's HTML element.
   * @param {ContainerSheetClassicContext | ItemSheetContext} data The data context from `getData()`.
   * @param {boolean} forced `true` when performing a full re-render; `false` when performing a partial re-render.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.renderItemSheet', (app, element, data, forced) => {
   *   // Your code here
   * });
   * ```
   *
   * @deprecated This hook is now redundant for App V2 item and container sheets. It will be removed as of Tidy V8.
   */
  static tidy5eSheetsRenderItemSheet(
    app: any,
    element: HTMLElement,
    data:
      | ContainerSheetClassicContext
      | ItemSheetContext
      | ContainerSheetHightouchContext,
    forced: boolean
  ) {
    Hooks.callAll('tidy5e-sheet.renderItemSheet', app, element, data, forced);
  }

  /**
   * A tab has been selected on the sheet.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet's HTML element.
   * @param {string} newTabId The selected tab ID.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.selectTab', (app, element, newTabId) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsSelectTab(
    app: any,
    element: HTMLElement,
    newTabId: string
  ) {
    Hooks.callAll('tidy5e-sheet.selectTab', app, element, newTabId);
  }
}
