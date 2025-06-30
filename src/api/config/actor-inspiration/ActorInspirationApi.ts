import { ActorInspirationRuntime } from 'src/runtime/actor/ActorInspirationRuntime.svelte';
import type { BankedInspirationConfiguration } from 'src/runtime/types';

/**
 * API functionality related to Actor Inspiration.
 *
 * @category Configuration
 */
export class ActorInspirationApi {
  /**
   * Enable banked inspiration for all actors. Inspiration value and max 
   * can be determined arbitrarily, and change requests from the sheet 
   * should be handled in the `change` callback.
   * 
   * @param config the configuration to use when managing banked actor inspiration
   */
  configureBankedInspiration(config: BankedInspirationConfiguration) {
    ActorInspirationRuntime.configureBankedInpsiration(config);
  }
}
