<script lang="ts">
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';
  import ExhaustionTracker from 'src/sheets/actor/ExhaustionTracker.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import VehicleMovement from './VehicleMovement.svelte';
  import { settingStore } from 'src/settings/settings';
  import ExhaustionInput from 'src/sheets/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($context.actor, 'exhaustion', event.detail.level);
  }
</script>

<ActorProfile useHpOverlay={$settingStore.useHpOverlayVehicle}>
  {#if $settingStore.useExhaustion && $settingStore.vehicleExhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={FoundryAdapter.tryGetFlag($context.actor, 'exhaustion') ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionConfig={$settingStore.vehicleExhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'flags.tidy5e-sheet.exhaustion',
      )}
    />
  {:else if $settingStore.useExhaustion && $settingStore.vehicleExhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={FoundryAdapter.tryGetFlag($context.actor, 'exhaustion') ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'flags.tidy5e-sheet.exhaustion',
      )}
    />
  {/if}
  {#if $settingStore.useVehicleMotion}
    <VehicleMovement
      motion={FoundryAdapter.tryGetFlag($context.actor, 'motion') === true}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      animate={true}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
