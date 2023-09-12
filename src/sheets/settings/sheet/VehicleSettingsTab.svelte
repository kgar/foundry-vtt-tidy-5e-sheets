<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import NumberInputSetting from 'src/sheets/settings/parts/NumberInputSetting.svelte';

  let store = getContext<Writable<CurrentSettings>>('store');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabVehicles.labelVehicles')}</h2>
  <CheckboxSetting
    bind:value={$store.hpBarDisabledVehicle}
    name={'T5EK.Settings.HpBar.name'}
    hint={'T5EK.Settings.HpBar.hint'}
    id="hpBarDisabledVehicle"
  />
  <CheckboxSetting
    bind:value={$store.hpOverlayDisabledVehicle}
    name={'T5EK.Settings.HpOverlay.name'}
    hint={'T5EK.Settings.HpOverlay.hint'}
    id="hpOverlayDisabledVehicle"
  />

  <NumberInputSetting
    bind:value={$store.vehicleSheetWidth}
    name={'T5EK.Settings.vehicleSheetWidth.name'}
    hint={'T5EK.Settings.vehicleSheetWidth.hint'}
    id="vehicleSheetWidth"
  />
{/if}
