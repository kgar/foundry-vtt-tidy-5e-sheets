import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
import type { ItemSummaryCommand } from '../api.types';

/**
 * API functionality related to the Item Summary.
 *
 * @remarks
 * The item summary makes multiple appearances in the Tidy 5e Sheets.
 * Particularly, it shows up when expanding a item table row or when
 * flying out an item info card.
 */
export class ItemSummaryApi {
  /**
   * Registers item summary commands which Tidy 5e can render at select locations on the sheet.
   * @param commands item summary commands for Tidy 5e to render
   */
  registerCommands(commands: ItemSummaryCommand[] = []) {
    ItemSummaryRuntime.registerItemSummaryCommands(commands);
  }
}
