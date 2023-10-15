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
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  $: incapacitated =
    ($context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $context.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($context.actor, 'exhaustion', event.detail.level);
  }

</script>

<ActorProfile
  useHpOverlay={!$settingStore.hpOverlayDisabledVehicle}
>
  {#if !$settingStore.exhaustionDisabled && !incapacitated}
    <Exhaustion
      level={FoundryAdapter.tryGetFlag($context.actor, 'exhaustion') ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionLocalizationPrefix="T5EK.VehicleExhaustion"
    />
  {/if}
  {#if !$settingStore.vehicleMotionDisabled}
    <VehicleMovement
      motion={FoundryAdapter.tryGetFlag($context.actor, 'motion') === true}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      disableAnimation={false}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
