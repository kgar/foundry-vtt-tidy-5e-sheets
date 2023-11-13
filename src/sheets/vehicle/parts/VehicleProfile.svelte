<script lang="ts">
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';
  import Exhaustion from 'src/sheets/actor/Exhaustion.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import VehicleMovement from './VehicleMovement.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($context.actor, 'exhaustion', event.detail.level);
  }
</script>

<ActorProfile useHpOverlay={$settingStore.useHpOverlayVehicle}>
  {#if $settingStore.useExhaustion}
    <Exhaustion
      level={FoundryAdapter.tryGetFlag($context.actor, 'exhaustion') ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionLocalizationPrefix="T5EK.VehicleExhaustion"
    />
  {/if}
  {#if $settingStore.useVehicleMotion}
    <VehicleMovement
      motion={FoundryAdapter.tryGetFlag($context.actor, 'motion') === true}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      animate={false}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
