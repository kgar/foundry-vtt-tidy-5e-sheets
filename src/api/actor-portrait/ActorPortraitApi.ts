import type { PortraitContextMenuCommand as PortraitMenuCommand } from '..';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';

/**
 * API functionality related to Actor portraits.
 */
export class ActorPortraitApi {
  /**
   * Register actor portrait menu commands which Tidy 5e can render on the sheet when appropriate.
   * @param commands actor portrait menu commands for Tidy 5e to render
   *
   * @example Registering a command
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.actorPortrait.registerMenuCommands([
   *     {
   *       label: "Test",
   *       iconClass: "fa-solid fa-flask",
   *       tooltip: "Click for test result",
   *       enabled: (params) => params.actor.type !== "vehicle",
   *       execute: (params) => {
   *         console.log(params);
   *         ui.notifications.info(
   *           "Hello, Test Portrait Menu Command for " + params.actor.name
   *         );
   *       },
   *     },
   *   ]);
   * });
   *
   */
  registerMenuCommands(commands: PortraitMenuCommand[]) {
    ActorPortraitRuntime.registerMenuCommands([...commands]);
  }
}
