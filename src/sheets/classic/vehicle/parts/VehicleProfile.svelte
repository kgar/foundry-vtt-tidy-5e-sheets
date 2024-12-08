<script lang="ts">
  import ActorProfile from 'src/sheets/classic/actor/ActorProfile.svelte';
  import VehicleHitPoints from './VehicleHitPoints.svelte';
  import VehicleDamageAndMishapThresholds from './VehicleDamageAndMishapThresholds.svelte';
  import ExhaustionTracker from 'src/sheets/classic/actor/ExhaustionTracker.svelte';
  import VehicleMovement from './VehicleMovement.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import ExhaustionInput from 'src/sheets/classic/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getVehicleSheetContext();

  function onLevelSelected(level: number) {
    TidyFlags.setFlag(context.actor, 'exhaustion', level);
  }
</script>

<ActorProfile useHpOverlay={settings.useHpOverlayVehicle}>
  {#if settings.useExhaustion && settings.vehicleExhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={TidyFlags.exhaustion.get(context.actor) ?? 0}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      exhaustionConfig={settings.vehicleExhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        TidyFlags.exhaustion.prop,
      )}
    />
  {:else if settings.useExhaustion && settings.vehicleExhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={TidyFlags.exhaustion.get(context.actor) ?? 0}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        TidyFlags.exhaustion.prop,
      )}
    />
  {/if}
  {#if settings.useVehicleMotion}
    <VehicleMovement
      motion={TidyFlags.motion.get(context.actor) === true}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      animate={true}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
