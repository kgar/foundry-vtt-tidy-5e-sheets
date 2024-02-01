import { ActionListRuntime } from 'src/runtime/action-list/ActionListRuntime';

/**
 * API functionality related to the Actions List feature.
 * 
 * @category Configuration
 */
export class ActionListApi {
  /**
   * Remap how activation types are treated when the Action List organizes items into sections.
   * @param mappings an object with `key`s and `value`s representing a mapping from source activation type to intended target activation type.
   * @example Treating Midi-QoL reaction sub-types like a reaction
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.actionList.mapActivationTypesToSections({
   *     reactionpreattack: 'reaction',
   *     reactiondamage: 'reaction',
   *     reactionmanual: 'reaction',
   *   });
   * });
   * ```
   * @remarks
   * In terms of UI, the `key` and `value` fields are the `value` attribute on the Activation Type dropdown, or the database value.
   * 
   * Multiple calls to this API function merge the latest results in, resulting in last-come, last-server.
   * If multiple modules remap the same activation type, the last caller's remapping will be the winner.
   */
  mapActivationTypesToSections(mappings: Record<string, string>) {
    ActionListRuntime.addActivationTypeMappings(mappings);
  }
}
