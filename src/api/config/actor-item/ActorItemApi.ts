import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
import type { ActorItemSectionFooterCommand } from '../../api.types';

/**
 * API functionality related to Actor-owned items.
 * 
 * @category Configuration
 */
export class ActorItemApi {
  /**
   * Registers actor item section commands which Tidy 5e can render at select locations on the sheet.
   * @param commands actor item section commands for Tidy 5e to render
   *
   * @example Registering a command that sorts items
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.actorItem.registerSectionFooterCommands([
   *     {
   *       enabled: (params) =>
   *         params.section.items?.length > 1 || params.section.spells?.length > 1,
   *       iconClass: 'fa-solid fa-arrow-up-a-z',
   *       tooltip: 'Sort by Name Ascending',
   *       execute: async (params) => {
   *         const actor = params.actor;
   *         const itemsToSort = params.section.items ?? params.section.spells;
   *         await actor.updateEmbeddedDocuments(
   *           'Item',
   *           [...itemsToSort]
   *             .sort((a, b) => {
   *               return a.name.localeCompare(b.name);
   *             })
   *             .map((item, idx) => {
   *               return { _id: item.id, sort: idx };
   *             })
   *         );
   *       },
   *     },
   *   ]);
   * });
   * ```
   */
  registerSectionFooterCommands(commands: ActorItemSectionFooterCommand[]) {
    ActorItemRuntime.registerActorItemSectionCommands(commands);
  }
}
