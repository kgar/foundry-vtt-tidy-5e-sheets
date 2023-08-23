<script lang="ts">
  import { SettingsProvider } from 'src/settings/settings';
  import HpOverlay from 'src/sheets/HpOverlay.svelte';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';
  import Exhaustion from 'src/sheets/Exhaustion.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import VehicleMovement from './VehicleMovement.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($store.actor, 'exhaustion', event.detail.level);
  }

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'vehicle'].includes(portraitStyle);
</script>

<ActorProfile {useRoundedPortraitStyle}>
  {#if !SettingsProvider.settings.hpOverlayDisabledVehicle.get()}
    <HpOverlay {useRoundedPortraitStyle} actor={$store.actor} />
  {/if}

  {#if !SettingsProvider.settings.exhaustionDisabled.get() && !incapacitated}
    <Exhaustion
      level={FoundryAdapter.tryGetFlag($store.actor, 'exhaustion') ?? 0}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionLocalizationPrefix="T5EK.VehicleExhaustion"
    />
  {/if}
  {#if !SettingsProvider.settings.vehicleMotionDisabled.get()}
    <VehicleMovement
      motion={FoundryAdapter.tryGetFlag($store.actor, 'motion') === true}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      disableAnimation={false}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
