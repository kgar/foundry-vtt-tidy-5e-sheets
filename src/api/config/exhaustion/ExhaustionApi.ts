import { SettingsProvider } from 'src/settings/settings.svelte';
import type { UseSpecificLevelExhaustionParams } from '../../api.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  OpenExhaustionConfig,
  SpecificExhaustionConfig,
} from 'src/features/exhaustion/exhaustion.types';

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
    const config: OpenExhaustionConfig = {
      type: 'open',
    };
    await FoundryAdapter.setTidySetting('exhaustionConfig', config);
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
    const exhaustion = SettingsProvider.settings.exhaustionConfig.get();

    const fallbackHints =
      exhaustion.type === 'specific' ? exhaustion.hints : [];

    const config: SpecificExhaustionConfig = {
      type: 'specific',
      hints: params?.hints ?? fallbackHints,
      levels: Math.max(params?.totalLevels ?? 1, 1),
    };

    await FoundryAdapter.setTidySetting('exhaustionConfig', config);
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
    const config: OpenExhaustionConfig = {
      type: 'open',
    };
    await FoundryAdapter.setTidySetting('vehicleExhaustionConfig', config);
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
    const exhaustion = SettingsProvider.settings.vehicleExhaustionConfig.get();

    const fallbackHints =
      exhaustion.type === 'specific' ? exhaustion.hints : [];

    const config: SpecificExhaustionConfig = {
      type: 'specific',
      hints: params?.hints ?? fallbackHints,
      levels: Math.max(params?.totalLevels ?? 1, 1),
    };
    await FoundryAdapter.setTidySetting('vehicleExhaustionConfig', config);
  }
}
