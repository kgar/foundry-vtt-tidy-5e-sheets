<script lang="ts">
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';
  import ExhaustionTracker from 'src/sheets/actor/ExhaustionTracker.svelte';
  import VehicleMovement from './VehicleMovement.svelte';
  import ExhaustionInput from 'src/sheets/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';

  let context = getContext<Readable<VehicleSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    TidyFlags.setFlag($context.actor, 'exhaustion', event.detail.level);
  }

  $: exhaustionConfig = SettingsProvider.settings.exhaustionConfig.get();
  $: specificExhaustionConfig =
    exhaustionConfig?.type === 'specific' ? exhaustionConfig : null;
</script>

<ActorProfile
  useHpOverlay={SettingsProvider.settings.useHpOverlayVehicle.get()}
>
  {#if SettingsProvider.settings.useExhaustion.get() && specificExhaustionConfig}
    <ExhaustionTracker
      level={TidyFlags.exhaustion.get($context.actor) ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionConfig={specificExhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        TidyFlags.exhaustion.prop,
      )}
    />
  {:else if SettingsProvider.settings.useExhaustion.get() && SettingsProvider.settings.vehicleExhaustionConfig.get().type === 'open'}
    <ExhaustionInput
      level={TidyFlags.exhaustion.get($context.actor) ?? 0}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        TidyFlags.exhaustion.prop,
      )}
    />
  {/if}
  {#if SettingsProvider.settings.useVehicleMotion.get()}
    <VehicleMovement
      motion={TidyFlags.motion.get($context.actor) === true}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      animate={true}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
