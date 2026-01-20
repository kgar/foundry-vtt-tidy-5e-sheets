<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { isNil } from 'src/utils/data';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let size = $derived<string | undefined>(
    context.config.actorSizes[context.system.traits.size]?.label,
  );

  let vehicleTypeLabel = $derived.by<string | undefined>(() => {
    const type = context.system.details.type;
    if (!type) return undefined;
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return localize(`DND5E.VEHICLE.Type.${capitalizedType}.label`);
  });

  // Determine the appropriate travel speed based on vehicle type
  let relevantTravelSpeed = $derived.by(() => {
    const vehicleType = context.system.details.type?.toLowerCase();
    const travelSpeeds = context.travelSpeeds.travelSpeeds;

    // Try to match vehicle type to travel speed type
    if (vehicleType) {
      const matchingSpeed = travelSpeeds.find(
        (speed) => speed.key === vehicleType,
      );
      if (matchingSpeed) {
        return matchingSpeed;
      }
    }

    // Fallback: prefer land, then first available
    const landSpeed = travelSpeeds.find((speed) => speed.key === 'land');
    if (landSpeed) {
      return landSpeed;
    }

    // Return first available travel speed or the currentSpeed as ultimate fallback
    return travelSpeeds[0] ?? context.travelSpeeds.currentSpeed;
  });
</script>

<div
  class="actor-details-subtitle-row"
  data-tidy-sheet-part="actor-details-row"
>
  <div class="actor-subtitle flexrow" data-tidy-sheet-part="subtitle-row">
    <span class="vehicle-quality">
      <!-- <span class="font-label-medium color-text-gold">
        {localize('DND5E.VEHICLE.Type.label')}
      </span> -->
      <span class="font-label-medium color-text-default">
        {vehicleTypeLabel ?? context.system.details.type}
      </span>
    </span>
    {#if relevantTravelSpeed}
      <div class="divider-dot"></div>
      <span class="vehicle-travel-pace">
        <span class="font-label-medium color-text-gold">
          {relevantTravelSpeed.label}
        </span>
        <span class="font-data-medium color-text-default">
          {relevantTravelSpeed.valueDay}
        </span>
        <span class="font-label-medium color-text-lighter">
          {relevantTravelSpeed.unitsDay}
        </span>
      </span>
    {/if}
    <div class="divider-dot"></div>
    <span class="vehicle-quality">
      <span class="font-label-medium color-text-gold">
        {localize('DND5E.Quality')}
      </span>
      <span class="font-label-medium color-text-default">
        {context.system.attributes.quality.value}
      </span>
    </span>
    {#if size}
      <div class="divider-dot"></div>
      <span class="size">
        <span class="font-label-medium color-text-default">{size}</span>
      </span>
    {/if}
    {#if !isNil(context.system.details.type.label, '')}
      <div class="divider-dot"></div>
      <span class="creature-type">
        <span class="font-label-medium color-text-default">
          {context.system.details.type.label}
        </span>
      </span>
    {/if}
  </div>
</div>
