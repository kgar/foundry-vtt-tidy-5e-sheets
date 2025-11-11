<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import ExhaustionSetting from '../../parts/ExhaustionSetting.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getDefaultExhaustionConfig } from 'src/features/exhaustion/exhaustion';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <CheckboxSetting
    bind:value={context.settings.useExhaustion}
    name={'TIDY5E.Settings.UseExhaustion.name'}
    hint={'TIDY5E.Settings.UseExhaustion.hint'}
    id="useExhaustion"
  />

  <h2>{localize('TIDY5E.WorldSettings.Exhaustion.Header')}</h2>

  <article class="setting buttons">
    <button
      type="button"
      onclick={() => (context.exhaustionConfig = getDefaultExhaustionConfig())}
    >
      {localize('TIDY5E.UseDefault')}
    </button>
  </article>

  <ExhaustionSetting
    name="TIDY5E.WorldSettings.Exhaustion.name"
    hint="TIDY5E.WorldSettings.Exhaustion.hint"
    bind:config={context.exhaustionConfig}
  />

  <h2>{localize('TIDY5E.WorldSettings.VehicleExhaustion.Header')}</h2>

  <article class="setting buttons">
    <button
      type="button"
      onclick={() =>
        (context.vehicleExhaustionConfig = getDefaultExhaustionConfig())}
    >
      {localize('TIDY5E.UseDefault')}
    </button>
  </article>

  <ExhaustionSetting
    name="TIDY5E.WorldSettings.VehicleExhaustion.name"
    hint="TIDY5E.WorldSettings.VehicleExhaustion.hint"
    bind:config={context.vehicleExhaustionConfig}
  />
</div>

<style lang="less">
</style>
