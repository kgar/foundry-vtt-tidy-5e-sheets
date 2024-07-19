<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { WorldSettingsContextStore } from '../WorldSettings.types';
  import ExhaustionSetting from '../../parts/ExhaustionSetting.svelte';
  import {
    getOneDnDExhaustionConfig,
    getStandardExhaustionConfig,
    getStandardVehicleExhaustionConfig,
  } from 'src/features/exhaustion/exhaustion';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContextStore>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <CheckboxSetting
    bind:value={$context.settings.useExhaustion}
    name={'TIDY5E.Settings.UseExhaustion.name'}
    hint={'TIDY5E.Settings.UseExhaustion.hint'}
    id="useExhaustion"
  />

  <h2>{localize('TIDY5E.WorldSettings.Exhaustion.Header')}</h2>

  <article class="setting buttons">
    <button
      type="button"
      on:click={() =>
        ($context.exhaustionConfig = getStandardExhaustionConfig())}
    >
      {localize('TIDY5E.WorldSettings.Exhaustion.useStandardExhaustion')}
    </button>
    <button
      type="button"
      on:click={() => ($context.exhaustionConfig = getOneDnDExhaustionConfig())}
    >
      {localize('TIDY5E.WorldSettings.Exhaustion.useOneDnDExhaustion')}
    </button>
  </article>

  <ExhaustionSetting
    name="TIDY5E.WorldSettings.Exhaustion.name"
    hint="TIDY5E.WorldSettings.Exhaustion.hint"
    bind:config={$context.exhaustionConfig}
  />

  <h2>{localize('TIDY5E.WorldSettings.VehicleExhaustion.Header')}</h2>

  <article class="setting buttons">
    <button
      type="button"
      on:click={() =>
        ($context.vehicleExhaustionConfig =
          getStandardVehicleExhaustionConfig())}
    >
      {localize('TIDY5E.WorldSettings.Exhaustion.useStandardExhaustion')}
    </button>
  </article>

  <ExhaustionSetting
    name="TIDY5E.WorldSettings.VehicleExhaustion.name"
    hint="TIDY5E.WorldSettings.VehicleExhaustion.hint"
    bind:config={$context.vehicleExhaustionConfig}
  />
</div>

<style lang="scss">
</style>
