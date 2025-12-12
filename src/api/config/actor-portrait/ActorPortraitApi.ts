import { warn } from 'src/utils/logging';
import type { PortraitMenuCommand } from '../..';

let warned = false;

/**
 * API functionality related to Actor portraits.
 *
 * @category Configuration
 */
export class ActorPortraitApi {
  /**
   * Register actor portrait menu commands which Tidy 5e can render on the sheet when appropriate.
   * @param commands actor portrait menu commands for Tidy 5e to render
   *
   * @example Registering a command
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.config.actorPortrait.registerMenuCommands([
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
   * ```
   */
  registerMenuCommands(commands: PortraitMenuCommand[]) {
    warn(
      `The API ${ActorPortraitApi.name} is no longer supported and will be removed in Foundry version 15`,
      false,
      undefined,
      true
    );
  }
}
