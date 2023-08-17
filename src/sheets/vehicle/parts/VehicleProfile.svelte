<script lang="ts">
  import { SettingsProvider } from 'src/settings/settings';
  import HpOverlay from 'src/sheets/HpOverlay.svelte';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'vehicle'].includes(portraitStyle);
</script>

<ActorProfile {useRoundedPortraitStyle}>
  {#if !SettingsProvider.settings.hpOverlayDisabledVehicle.get()}
    <HpOverlay {useRoundedPortraitStyle} actor={$store.actor} />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
