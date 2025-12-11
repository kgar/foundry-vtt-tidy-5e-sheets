import type { UseSpecificLevelExhaustionParams } from '../../api.types';
import { warn } from 'src/utils/logging';

/**
 * API functionality related to the Exhaustion feature.
 *
 * @category Configuration
 */
export class ExhaustionApi {
  /**
   * Configures exhaustion to use an open number field,
   * rather than a constrained set of levels.
   *
   * @example
   * ```js
   * Hooks.once('tidy5e-sheet.ready', async (api) => {
   *   await api.config.exhaustion.useOpenNumberExhaustion();
   * });
   * ```
   */
  async useOpenNumberExhaustion(): Promise<void> {
    warn(
      `The API ${ExhaustionApi.name} is no longer supported and will be removed in Foundry version 15`
    );
  }

  /**
   * Configures exhaustion to use a constrained set of levels
   * with optional hints (usually rendered as tooltips).
   * @param params information needed to configure specific-level exhaustion
   *
   * @example Setting 3-level exhaustion
   * ```js
   * Hooks.once('tidy5e-sheet.ready', async (api) => {
   *   await api.config.exhaustion.useSpecificLevelExhaustion({
   *     totalLevels: 3,
   *     hints: [
   *       'No exhaustion',
   *       'You are kind of tired',
   *       'You look unwell',
   *       'Dead 💀',
   *     ],
   *   });
   * });
   * ```
   */
  async useSpecificLevelExhaustion(
    params?: UseSpecificLevelExhaustionParams
  ): Promise<void> {
    warn(
      `The API ${ExhaustionApi.name} is no longer supported and will be removed in Foundry version 15`
    );
  }

  /**
   * Configures vehicle exhaustion to use an open number field,
   * rather than a constrained set of levels.
   *
   * @example
   * ```js
   * Hooks.once('tidy5e-sheet.ready', async (api) => {
   *   await api.config.exhaustion.useOpenNumberVehicleExhaustion();
   * });
   * ```
   */
  async useOpenNumberVehicleExhaustion(): Promise<void> {
    warn(
      `The API ${ExhaustionApi.name} is no longer supported and will be removed in Foundry version 15`
    );
  }

  /**
   * Configures vehicle exhaustion to use a constrained set of levels
   * with optional hints (usually rendered as tooltips).
   * @param params information needed to configure specific-level vehicle exhaustion
   *
   * @example Setting 3-level vehicle exhaustion
   * ```js
   * Hooks.once('tidy5e-sheet.ready', async (api) => {
   *   await api.config.exhaustion.useSpecificLevelVehicleExhaustion({
   *     totalLevels: 3,
   *     hints: ['Ship shape', 'A shape', "Uh oh, it's falling apart", 'Borked'],
   *   });
   * });
   * ```
   */
  async useSpecificLevelVehicleExhaustion(
    params?: UseSpecificLevelExhaustionParams
  ): Promise<void> {
    warn(
      `The API ${ExhaustionApi.name} is no longer supported and will be removed in Foundry version 15`
    );
  }
}
