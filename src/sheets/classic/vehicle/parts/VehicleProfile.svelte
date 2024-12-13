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

  let context = $derived(getVehicleSheetContext());

  function onLevelSelected(level: number) {
    TidyFlags.setFlag(context.actor, 'exhaustion', level);
  }
</script>

<ActorProfile
  useHpOverlay={settings.value.useHpOverlayVehicle &&
    context.system.attributes.hp.max > 0}
>
  {#if settings.value.useExhaustion && settings.value.vehicleExhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={TidyFlags.exhaustion.get(context.actor) ?? 0}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      exhaustionConfig={settings.value.vehicleExhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        TidyFlags.exhaustion.prop,
      )}
    />
  {:else if settings.value.useExhaustion && settings.value.vehicleExhaustionConfig.type === 'open'}
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
  {#if settings.value.useVehicleMotion}
    <VehicleMovement
      motion={TidyFlags.motion.get(context.actor) === true}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      animate={true}
    />
  {/if}
  <VehicleHitPoints />
</ActorProfile>
<VehicleDamageAndMishapThresholds />
