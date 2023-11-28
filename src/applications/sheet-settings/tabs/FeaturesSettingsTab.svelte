<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import CheckboxSetting from '../parts/CheckboxSetting.svelte';
  import type { SettingsSheetContext } from '../SheetSettings.types';
  import ExhaustionSetting from '../parts/ExhaustionSetting.svelte';
  import {
    getOneDnDExhaustionConfig,
    getStandardExhaustionConfig,
    getStandardVehicleExhaustionConfig,
  } from 'src/features/exhaustion/exhaustion';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  let userIsGm = FoundryAdapter.userIsGm();

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.ActionsList.Header')}</h2>

<CheckboxSetting
  bind:value={$context.settings.actionListLimitActionsToCantrips}
  name={SettingsProvider.settings.actionListLimitActionsToCantrips.options.name}
  hint={SettingsProvider.settings.actionListLimitActionsToCantrips.options.hint}
  id="actionListLimitActionsToCantrips"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeMinuteLongSpellsAsActions}
  name={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.hint}
  id="actionListIncludeMinuteLongSpellsAsActions"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeSpellsWithActiveEffects}
  name={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.hint}
  id="actionListIncludeSpellsWithActiveEffects"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeConsumables}
  name={SettingsProvider.settings.actionListIncludeConsumables.options.name}
  hint={SettingsProvider.settings.actionListIncludeConsumables.options.hint}
  id="actionListIncludeConsumables"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListScaleCantripDamage}
  name={SettingsProvider.settings.actionListScaleCantripDamage.options.name}
  hint={SettingsProvider.settings.actionListScaleCantripDamage.options.hint}
  id="actionListScaleCantripDamage"
/>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.Exhaustion.Header')}</h2>

  <article class="setting flex-row extra-small-gap" style="padding: 0.5rem">
    <button
      type="button"
      on:click={() =>
        ($context.exhaustionConfig = getStandardExhaustionConfig())}
    >
      {localize('T5EK.Settings.Exhaustion.useStandardExhaustion')}
    </button>
    <button
      type="button"
      on:click={() => ($context.exhaustionConfig = getOneDnDExhaustionConfig())}
    >
      {localize('T5EK.Settings.Exhaustion.useOneDnDExhaustion')}
    </button>
  </article>

  <ExhaustionSetting
    name="T5EK.Settings.Exhaustion.name"
    hint="T5EK.Settings.Exhaustion.hint"
    bind:config={$context.exhaustionConfig}
  />

  <h2>{localize('T5EK.Settings.VehicleExhaustion.Header')}</h2>

  <article class="setting flex-row extra-small-gap" style="padding: 0.5rem">
    <button
      type="button"
      on:click={() =>
        ($context.vehicleExhaustionConfig =
          getStandardVehicleExhaustionConfig())}
    >
      {localize('T5EK.Settings.Exhaustion.useStandardExhaustion')}
    </button>
  </article>

  <ExhaustionSetting
    name="T5EK.Settings.VehicleExhaustion.name"
    hint="T5EK.Settings.VehicleExhaustion.hint"
    bind:config={$context.vehicleExhaustionConfig}
  />
{/if}
