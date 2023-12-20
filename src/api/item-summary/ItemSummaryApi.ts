import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
import type { ItemSummaryCommand } from '../api.types';

/**
 * API functionality related to the Item Summary.
 *
 * @example Registering commands that show for specific actor types
 * ```js
 * Hooks.once('tidy5e-sheet.ready', (api) => {
 *   api.itemSummary.registerCommands([
 *     {
 *       label: 'Character Button',
 *       enabled: (item) => item?.actor?.type === 'character',
 *       iconClass: 'fas fa-dice-d20',
 *       execute: (args) => {
 *         console.log('Clicked Character button', args.item);
 *       },
 *     },
 *     {
 *       label: 'NPC Button',
 *       enabled: (item) => item?.actor?.type === 'npc',
 *       execute: (args) => {
 *         console.log('Clicked NPC button', args.item);
 *       },
 *     },
 *     {
 *       label: 'Item Type',
 *       enabled: (item) => item?.actor?.type === 'character',
 *       execute: (args) => {
 *         console.log('Clicked Vehicle button', args.item);
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
 *       enabled: (item) =>
 *         item?.type === 'weapon' &&
 *         item?.system?.properties?.ver &&
 *         item?.system?.damage?.versatile,
 *       iconClass: 'fa-solid fa-hands-praying',
 *       execute: (args) => {
 *         console.log('Do something versatile', args.item);
 *       },
 *     },
 *   ]);
 * });
 * ```
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
