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
  static tidy5eSheetsPreOpenActorPortraitFilePicker(
    context: Readable<ActorSheetContext>,
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_OPEN_ACTOR_PORTRAIT_FILE_PICKER = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_OPEN_ACTOR_PORTRAIT_FILE_PICKER
  ): boolean {
    return Hooks.call(hookName, context, event);
  }

  /**
   * A hook event that fires before a short rest is started.
   * @function dnd5e.preShortRest
   * @memberof hookEvents
   * @param {Actor5e} actor             The actor that is being rested.
   * @param {RestConfiguration} config  Configuration options for the rest.
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
   * A hook event that fires when the context menu for the advancements list is constructed.
   * @memberof hookEvents
   * @param {jQuery} html                      The HTML element to which the context options are attached.
   * @param {ContextMenuEntry[]} entryOptions  The context menu entries.
   */
  static dnd5eGetItemAdvancementContext(
    html: any,
    contextOptions: ContextMenuEntry[],
    hookName: typeof CONSTANTS.HOOK_DND5E_GET_ITEM_ADVANCEMENT_CONTEXT = CONSTANTS.HOOK_DND5E_GET_ITEM_ADVANCEMENT_CONTEXT
  ) {
    return Hooks.call(hookName, html, contextOptions);
  }

  static tidy5eSheetsRenderItemSheet(
    app: any,
    element: HTMLElement,
    data: ContainerSheetContext | ItemSheetContext,
    forced: boolean,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ITEM_SHEET = CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ITEM_SHEET
  ) {
    Hooks.callAll(hookName, app, element, data, forced);
  }

  static tidy5eSheetsRenderActorSheet(
    app: any,
    element: HTMLElement,
    data: CharacterSheetContext | NpcSheetContext | VehicleSheetContext,
    forced: boolean,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ACTOR_SHEET = CONSTANTS.HOOK_TIDY5E_SHEETS_RENDER_ACTOR_SHEET
  ) {
    Hooks.callAll(hookName, app, element, data, forced);
  }

  static tidy5eSheetsPreConfigureSections(
    app: any,
    context: CharacterSheetContext | NpcSheetContext | ContainerSheetContext,
    element: HTMLElement,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CONFIGURE_SECTIONS = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_CONFIGURE_SECTIONS
  ) {
    Hooks.callAll(hookName, app, context, element);
  }

  static tidy5eSheetsPrepareResources(
    tidyResources: TidyResource[],
    actor: Actor5e,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_RESOURCES = CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_RESOURCES
  ) {
    Hooks.callAll(hookName, tidyResources, actor);
  }

  static tidy5eSheetsSelectTab(
    app: any,
    element: HTMLElement,
    newTabId: string,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_SELECT_TAB = CONSTANTS.HOOK_TIDY5E_SHEETS_SELECT_TAB
  ) {
    Hooks.callAll(hookName, app, element, newTabId);
  }

  static tidy5eSheetsPreSelectTab(
    app: any,
    element: HTMLElement,
    data: { currentTab: any; newTab: string },
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_SELECT_TAB = CONSTANTS.HOOK_TIDY5E_SHEETS_PRE_SELECT_TAB
  ): boolean {
    return Hooks.call(hookName, app, element, data);
  }

  static tidy5eSheetsActorItemUseContextMenu(
    item: Item5e,
    options: { event: Event },
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_ITEM_USE_CONTEXT_MENU = CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_ITEM_USE_CONTEXT_MENU
  ) {
    Hooks.callAll(hookName, item, options);
  }

  /**
   * Declares when Tidy 5e Sheets is ready to be used and customized.
   * @param api The Tidy 5e Sheets API, used for customizing and registering content with Tidy 5e Sheets.
   * @param hookName The name of the hook which is invoked.
   */
  static tidy5eSheetsReady(
    api: Tidy5eSheetsApi,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_READY = CONSTANTS.HOOK_TIDY5E_SHEETS_READY
  ): void {
    Hooks.callAll(hookName, api);
  }

  /**
   * Declares when a user has hovered over an item, typically on an item table row.
   * @param event The triggering mouse event.
   * @param item The hovered-over item.
   * @param hookName The name of the hook which is invoked.
   */
  static tidy5eSheetsItemHoverOn(
    event: Event,
    item: any,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON = CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON
  ) {
    Hooks.callAll(hookName, event, item);
  }

  /**
   * Declares when a user has hovered off an item, typically from an item table row.
   * @param event The triggering mouse event.
   * @param item The item which is no longer hovered.
   * @param hookName The name of the hook which is invoked.
   */
  static tidy5eSheetsItemHoverOff(
    event: Event,
    item: any,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF = CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF
  ): void {
    Hooks.callAll(hookName, event, item);
  }

  /**
   * Declares when the floating context menu's positioning is being determined.
   * @param positionInfo context menu positioning info, used for determining where to put the context menu
   * @param hookName The name of the hook which is invoked.
   * @returns `true` to allow the menu to show, `false` to prevent the default menu from showing
   */
  static tidy5eSheetsPrepareFloatingContextMenuPosition(
    positionInfo: ContextMenuPositionInfo,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_FLOATING_CONTEXT_MENU_POSITION = CONSTANTS.HOOK_TIDY5E_SHEETS_PREPARE_FLOATING_CONTEXT_MENU_POSITION
  ): boolean {
    return Hooks.call(hookName, positionInfo);
  }

  static dnd5eGetActiveEffectContextOptions(
    effect: ActiveEffect5e,
    menuItems: ContextMenuEntry[],
    hookName: typeof CONSTANTS.HOOK_DND5E_GET_ACTIVE_EFFECT_CONTEXT_OPTIONS = CONSTANTS.HOOK_DND5E_GET_ACTIVE_EFFECT_CONTEXT_OPTIONS
  ): boolean {
    return Hooks.call(hookName, effect, menuItems);
  }

  static dnd5eGetItemContextOptions(
    item: Item5e,
    menuItems: ContextMenuEntry[],
    hookName: typeof CONSTANTS.HOOK_DND5E_GET_ITEM_CONTEXT_OPTIONS = CONSTANTS.HOOK_DND5E_GET_ITEM_CONTEXT_OPTIONS
  ): boolean {
    return Hooks.call(hookName, item, menuItems);
  }

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
   * @returns {boolean}             Explicitly return `false` to prevent updates from being performed.
   */
  static dnd5eRollHitDie(
    actor: Actor5e,
    roll: Roll,
    updates: object,
    hookName: typeof CONSTANTS.HOOK_DND5E_ROLL_HIT_DIE = CONSTANTS.HOOK_DND5E_ROLL_HIT_DIE
  ): boolean {
    return Hooks.call(hookName, actor, roll, updates);
  }

  static tidy5eSheetsActorPreUseItem(
    item: Item5e,
    config: any,
    options: any,
    hookName: typeof CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_PRE_USE_ITEM = CONSTANTS.HOOK_TIDY5E_SHEETS_ACTOR_PRE_USE_ITEM
  ): boolean {
    return Hooks.call(hookName, item, config, options);
  }
}
