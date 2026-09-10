import { warn } from 'src/utils/logging';

/**
 * API functionality related to Actor portraits.
 *
 * @category Configuration
 */
export class ActorPortraitApi {
  /**
   * This feature is no longer supported. The API for it will be removed in a future Tidy version.
   */
  registerMenuCommands(commands: never) {
    warn(
      'This feature is no longer supported. The API for it will be removed in a future Tidy version.',
    );
  }
}
