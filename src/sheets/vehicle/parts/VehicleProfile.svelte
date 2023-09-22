<script lang="ts">
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';
  import Exhaustion from 'src/sheets/Exhaustion.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import VehicleMovement from './VehicleMovement.svelte';
  import { currentSettings } from 'src/settings/settings';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($store.actor, 'exhaustion', event.detail.level);
  }

  const useRoundedPortraitStyle = ['all', 'vehicle'].includes(
    $currentSettings.portraitStyle
  );
</script>

<ActorProfile
  {useRoundedPortraitStyle}
  useHpOverlay={!$currentSettings.hpOverlayDisabledVehicle}
>
  {#if !$currentSettings.exhaustionDisabled && !incapacitated}
    <Exhaustion
      level={FoundryAdapter.tryGetFlag($store.actor, 'exhaustion') ?? 0}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionLocalizationPrefix="T5EK.VehicleExhaustion"
    />
  {/if}
  {#if !$currentSettings.vehicleMotionDisabled}
    <VehicleMovement
      motion={FoundryAdapter.tryGetFlag($store.actor, 'motion') === true}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      disableAnimation={false}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
