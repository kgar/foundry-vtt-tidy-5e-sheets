import type { Tidy5eSheetsApi } from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { ContextMenuPositionInfo } from 'src/context-menu/context-menu.types';

/** Manages all Hook usage in Tidy 5e Sheets */
export class TidyHooks {
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
}
