import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
import type { ItemSummaryCommand } from '../api.types';

/**
 * API functionality related to the Item Summary.
 *
 * @remarks
 * The item summary makes multiple appearances in Tidy 5e Sheets.
 * Particularly, it shows up when expanding a item table row or when
 * flying out an item info card.
 */
export class ItemSummaryApi {
  /**
   * Registers item summary commands which Tidy 5e can render at select locations on the sheet.
   * @param commands item summary commands for Tidy 5e to render
   *
   * @example Registering commands that show for specific actor types
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.itemSummary.registerCommands([
   *     {
   *       label: 'Character Button',
   *       enabled: (params) => params.item.actor?.type === 'character',
   *       iconClass: 'fas fa-dice-d20',
   *       execute: (params) => {
   *         console.log('Clicked Character button', params.item);
   *       },
   *     },
   *     {
   *       label: 'NPC Button',
   *       enabled: (params) => params.item.actor?.type === 'npc',
   *       execute: (params) => {
   *         console.log('Clicked NPC button', params.item);
   *       },
   *     },
   *     {
   *       label: 'Vehicle Button',
   *       enabled: (params) => params.item.actor?.type === 'vehicle',
   *       execute: (params) => {
   *         console.log('Clicked Vehicle button', params.item);
   *       },
   *     },
   *   ]);
   * });
   * ```
   *
   * @example Displaying a button for versatile weapons only
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.itemSummary.registerCommands([
   *     {
   *       label: 'Versatile Weapon Button',
   *       enabled: (params) =>
   *         params.item.type === 'weapon' &&
   *         params.item.system?.properties?.ver &&
   *         params.item.system?.damage?.versatile,
   *       iconClass: 'fa-solid fa-hands-praying',
   *       execute: (params) => {
   *         console.log('Do something versatile', params.item);
   *       },
   *     },
   *   ]);
   * });
   * ```
   */
  registerCommands(commands: ItemSummaryCommand[] = []) {
    ItemSummaryRuntime.registerItemSummaryCommands(commands);
  }
}
