<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let size = $derived<string | undefined>(
    context.config.actorSizes[context.system.traits.size]?.label,
  );

  let alignment = $derived<string | undefined>(
    context.system.details.alignment,
  );

  let species = $derived.by<string | undefined>(() => {
    if (context.system.details.race?.name) {
      return context.system.details.race.name;
    } else if (context.system.details.race) {
      return context.system.details.race;
    }
  });

  let pb = $derived(getModifierData(context.system.attributes.prof ?? 0));

  let vehicleTypeLabel = $derived.by<string | undefined>(() => {
    const type = context.system.details.type;
    if (!type) return undefined;
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return localize(`DND5E.VEHICLE.Type.${capitalizedType}.label`);
  });
</script>

{#snippet speedSenseSummary(
  speed: ActorSpeedSenseEntryContext,
  clsx?: ClassValue,
  hide?: ClassValue,
)}
  <span class={[clsx, hide]}>
    <span class="color-text-gold font-label-medium">{speed.label}</span>
    <span class="color-text-default font-data-medium">{speed.value}</span>
    <span class="color-text-lighter font-label-medium">{speed.units}</span>
    {#if speed.parenthetical}
      <span class="color-text-gold font-label-medium"
        >({speed.parenthetical})</span
      >
    {/if}
  </span>
{/snippet}

<div
  class="actor-details-subtitle-row"
  data-tidy-sheet-part="actor-details-row"
>
  <div class="actor-subtitle flexrow" data-tidy-sheet-part="subtitle-row">
    <span class="vehicle-quality">
      <span class="font-label-medium color-text-gold">
        {localize('DND5E.VEHICLE.Type.label')}
      </span>
      <span class="font-label-medium color-text-default">
        {vehicleTypeLabel ?? context.system.details.type}
      </span>
    </span>
    <div class="divider-dot"></div>
    {#each context.speeds as speed, i}
      {#if i > 0}
        <div class="divider-dot"></div>
      {/if}
      {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
    {/each}
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
        <span class="font-label-medium color-text-gold">{size}</span>
      </span>
    {/if}
    {#if !isNil(context.system.details.type.label, '')}
      <div class="divider-dot"></div>
      <span class="creature-type">
        <span class="font-label-medium color-text-gold">
          {context.system.details.type.label}
        </span>
      </span>
    {/if}
    {#if species}
      <div class="divider-dot"></div>
      <span class="species">
        <span class="font-label-medium color-text-gold">{species}</span>
      </span>
    {/if}
  </div>
</div>
