import type { Tidy5eSheetsApi } from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { ContextMenuPositionInfo } from 'src/context-menu/context-menu.types';
import type {
  ActiveEffect5e,
  Actor5e,
  ActorSheetContext,
  CharacterSheetContext,
  NpcSheetContext,
  TidyResource,
  VehicleSheetContext,
} from 'src/types/types';
import type { ContextMenuEntry } from './foundry.types';
import type {
  ContainerSheetContext,
  Item5e,
  ItemSheetContext,
} from 'src/types/item.types';
import type { RollConfig, Roll, RestConfiguration } from './dnd5e.types';
import type { Readable } from 'svelte/store';

/** Manages all Hook usage in Tidy 5e Sheets */
export class TidyHooks {
  /**
   * The portrait picker is about to open.
   * @param context the actor sheet data from `getData()`
   * @param event the triggering event
   * @param hookName this hook's registered name
   * @returns
   */
  static tidy5eSheetsPreOpenActorPortraitFilePicker(
    context: ActorSheetContext,
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_OPEN_ACTOR_PORTRAIT_FILE_PICKER = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_OPEN_ACTOR_PORTRAIT_FILE_PICKER
  ): boolean {
    return Hooks.call(hookName, context, event);
  }

  /**
   * A short rest is about to start.
   * @function dnd5e.preShortRest
   * @memberof hookEvents
   * @param {Actor5e} actor             The actor that is being rested.
   * @param {RestConfiguration} config  Configuration options for the rest.
   * @param hookName this hook's registered name
   * @returns {boolean}                 Explicitly return `false` to prevent the rest from being started.
   */
  static dnd5ePreShortRest(
    actor: any,
    config: RestConfiguration,
    hookName: typeof CONSTANTS.HOOK_DND5E_PRE_SHORT_REST = CONSTANTS.HOOK_DND5E_PRE_SHORT_REST
  ): boolean {
    return Hooks.call(hookName, actor, config);
  }

  /**
   * The context menu for the advancements list has been constructed.
   * @memberof hookEvents
   * @param {jQuery} html                      The HTML element to which the context options are attached.
   * @param {ContextMenuEntry[]} entryOptions  The context menu entries.
   * @param hookName this hook's registered name
   */
  static dnd5eGetItemAdvancementContext(
    html: any,
    contextOptions: ContextMenuEntry[],
    hookName: typeof CONSTANTS.HOOK_DND5E_GET_ITEM_ADVANCEMENT_CONTEXT = CONSTANTS.HOOK_DND5E_GET_ITEM_ADVANCEMENT_CONTEXT
  ) {
    return Hooks.call(hookName, html, contextOptions);
  }

  /**
   * The item sheet has rendered all content and registered custom content. Is called on partial and full renders.
   * @param app the target item sheet application class instance
   * @param element the item sheet's HTML element
   * @param data the data context from `getData()`
   * @param forced `true` when performing a full re-render; `false` when performing a partial re-render
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsRenderItemSheet(
    app: any,
    element: HTMLElement,
    data: ContainerSheetContext | ItemSheetContext,
    forced: boolean,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ITEM_SHEET = CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ITEM_SHEET
  ) {
    Hooks.callAll(hookName, app, element, data, forced);
  }

  /**
   *
   * @param app the sheet application instance
   * @param element the sheet HTML element
   * @param data the data context from `getData()`
   * @param forced `true` when performing a full re-render; `false` when performing a partial re-render
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsRenderActorSheet(
    app: any,
    element: HTMLElement,
    data: CharacterSheetContext | NpcSheetContext | VehicleSheetContext,
    forced: boolean,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ACTOR_SHEET = CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ACTOR_SHEET
  ) {
    Hooks.callAll(hookName, app, element, data, forced);
  }

  /**
   * Sheet item/effect sections are about to be configured. Use this hook to inject additional items, sections, etc., or to adjust context data.
   * @param app the sheet application instance
   * @param element the sheet HTML element
   * @param data the data context from `getData()`
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsPreConfigureSections(
    app: any,
    element: HTMLElement,
    data: CharacterSheetContext | NpcSheetContext | ContainerSheetContext,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CONFIGURE_SECTIONS = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CONFIGURE_SECTIONS
  ) {
    Hooks.callAll(hookName, app, element, data);
  }

  /**
   * Resources have been prepared. Use this hook to adjust them and/or add new resources.
   * @param tidyResources the resources that have been prepared for the sheet
   * @param actor the affected actor
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsPrepareResources(
    tidyResources: TidyResource[],
    actor: Actor5e,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_RESOURCES = CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_RESOURCES
  ) {
    Hooks.callAll(hookName, tidyResources, actor);
  }

  /**
   * A tab has been selected on the sheet.
   * @param app the sheet application instances
   * @param element the sheet's HTML element
   * @param newTabId the selected tab ID
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsSelectTab(
    app: any,
    element: HTMLElement,
    newTabId: string,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_SELECT_TAB = CONSTANTS.HOOK_TIDY5E_SHEETS_SELECT_TAB
  ) {
    Hooks.callAll(hookName, app, element, newTabId);
  }

  /**
   * A tab is about to be selected.
   * @param app the sheet application instances
   * @param element the sheet's HTML element
   * @param data the current tab ID before selecting the new tab, and the new tab ID to be selected
   * @param hookName this hook's registered name
   * @returns `false` to cancel tabbing
   */
  static tidy5eSheetsPreSelectTab(
    app: any,
    element: HTMLElement,
    data: { currentTab: any; newTab: string },
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_SELECT_TAB = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_SELECT_TAB
  ): boolean {
    return Hooks.call(hookName, app, element, data);
  }

  /**
   * The context menu is about to show for a given item on a sheet.
   * @param item the item document instance
   * @param options the mouse event which triggered the context menu
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsActorItemUseContextMenu(
    item: Item5e,
    options: { event: Event },
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_ITEM_USE_CONTEXT_MENU = CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_ITEM_USE_CONTEXT_MENU
  ) {
    Hooks.callAll(hookName, item, options);
  }

  /**
   * Tidy 5e Sheets is ready to be used and customized.
   * @param api The Tidy 5e Sheets API, used for customizing and registering content with Tidy 5e Sheets.
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsReady(
    api: Tidy5eSheetsApi,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_READY = CONSTANTS.HOOK_TIDY5E_SHEETS_READY
  ): void {
    Hooks.callAll(hookName, api);
  }

  /**
   * A user has hovered over an item, typically on an item table row.
   * @param event The triggering mouse event.
   * @param item The hovered-over item.
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsItemHoverOn(
    event: Event,
    item: any,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON = CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON
  ) {
    Hooks.callAll(hookName, event, item);
  }

  /**
   * A user has hovered off an item, typically from an item table row.
   * @param event The triggering mouse event.
   * @param item The item which is no longer hovered.
   * @param hookName this hook's registered name
   */
  static tidy5eSheetsItemHoverOff(
    event: Event,
    item: any,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF = CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF
  ): void {
    Hooks.callAll(hookName, event, item);
  }

  /**
   * The floating context menu's positioning is being determined.
   * @param positionInfo context menu positioning info, used for determining where to put the context menu
   * @param hookName this hook's registered name
   * @returns `true` to allow the menu to show, `false` to prevent the default menu from showing
   */
  static tidy5eSheetsPrepareFloatingContextMenuPosition(
    positionInfo: ContextMenuPositionInfo,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_FLOATING_CONTEXT_MENU_POSITION = CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_FLOATING_CONTEXT_MENU_POSITION
  ): boolean {
    return Hooks.call(hookName, positionInfo);
  }

  /**
   * The active effect context menu has established its options and is about to show.
   * @param effect the active effect document instance
   * @param menuItems the menu items for this active effect
   * @param hookName this hook's registered name
   * @returns `true` to allow the menu to show, `false` to prevent the default menu from showing
   */
  static dnd5eGetActiveEffectContextOptions(
    effect: ActiveEffect5e,
    menuItems: ContextMenuEntry[],
    hookName: typeof CONSTANTS.HOOK_DND5E_GET_ACTIVE_EFFECT_CONTEXT_OPTIONS = CONSTANTS.HOOK_DND5E_GET_ACTIVE_EFFECT_CONTEXT_OPTIONS
  ): boolean {
    return Hooks.call(hookName, effect, menuItems);
  }

  /**
   * The item context menu has established its options and is about to show.
   * @param item
   * @param menuItems
   * @param hookName this hook's registered name
   * @returns `true` to allow the menu to show, `false` to prevent the default menu from showing
   */
  static dnd5eGetItemContextOptions(
    item: Item5e,
    menuItems: ContextMenuEntry[],
    hookName: typeof CONSTANTS.HOOK_DND5E_GET_ITEM_CONTEXT_OPTIONS = CONSTANTS.HOOK_DND5E_GET_ITEM_CONTEXT_OPTIONS
  ): boolean {
    return Hooks.call(hookName, item, menuItems);
  }

  /**
   * A hit die roll is about to occur.
   * @param actor the affected actor
   * @param rollConfig the configuration for the roll
   * @param denomination the roll denomination
   * @param hookName this hook's registered name
   * @returns `true` to allow the roll, `false` to prevent it
   */
  static dnd5ePreRollHitDie(
    actor: Actor5e,
    rollConfig: RollConfig,
    denomination: string,
    hookName: typeof CONSTANTS.HOOK_DND5E_PRE_ROLL_HIT_DIE = CONSTANTS.HOOK_DND5E_PRE_ROLL_HIT_DIE
  ): boolean {
    return Hooks.call(hookName, actor, rollConfig, denomination);
  }

  /**
   * A hook event that fires after a hit die has been rolled for an Actor, but before updates have been performed.
   * @function dnd5eRollHitDie
   * @memberof hookEvents
   * @param {Actor5e} actor         Actor for which the hit die has been rolled.
   * @param {Roll} roll             The resulting roll.
   * @param {object} updates
   * @param {object} updates.actor  Updates that will be applied to the actor.
   * @param {object} updates.class  Updates that will be applied to the class.
   * @param hookName this hook's registered name
   * @returns `true` to allow the roll, `false` to prevent it
   */
  static dnd5eRollHitDie(
    actor: Actor5e,
    roll: Roll,
    updates: object,
    hookName: typeof CONSTANTS.HOOK_DND5E_ROLL_HIT_DIE = CONSTANTS.HOOK_DND5E_ROLL_HIT_DIE
  ): boolean {
    return Hooks.call(hookName, actor, roll, updates);
  }

  /**
   * An item is about to be used by an actor.
   * @param item the affected item document instance
   * @param config any configuration for the item use
   * @param options any options for the item use
   * @param hookName this hook's registered name
   * @returns `true` to allow the item use, `false` to prevent it
   */
  static tidy5eSheetsActorPreUseItem(
    item: Item5e,
    config: any,
    options: any,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_PRE_USE_ITEM = CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_PRE_USE_ITEM
  ): boolean {
    return Hooks.call(hookName, item, config, options);
  }

  /**
   * An item is about to be created for an owning document.
   * This was initiated specifically through Tidy 5e Sheets,
   * whether directly by the user, or indirectly through some user interaction.
   * @param owner the owning document instance which will receive the created item
   * @param createData the data used to create it
   * @param userId the user who initiated the creation
   * @param hookName this hook's registered name
   * @returns `true` to allow the item creation, `false` to prevent it
   */
  static tidy5eSheetsPreCreateItem(
    owner: any,
    createData: object,
    userId: string,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CREATE_ITEM = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CREATE_ITEM
  ): boolean {
    return Hooks.call(hookName, owner, createData, userId);
  }

  /**
   * An active effect is about to be created for an owning document.
   * This was initiated specifically through Tidy 5e Sheets,
   * whether directly by the user, or indirectly through some user interaction.
   * @param owner the owning document instance which will receive the created effect
   * @param createData the data used to create it
   * @param userId the user who initiated the creation
   * @param hookName this hook's registered name
   * @returns `true` to allow the effect creation, `false` to prevent it
   */
  static tidy5eSheetsPreCreateActiveEffect(
    owner: any,
    createData: object,
    userId: string,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CREATE_ACTIVE_EFFECT = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CREATE_ACTIVE_EFFECT
  ): boolean {
    return Hooks.call(hookName, owner, createData, userId);
  }
}
