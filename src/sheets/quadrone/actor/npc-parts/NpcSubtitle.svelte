<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import { getModifierData } from 'src/utils/formatting';

  let context = $derived(getNpcSheetQuadroneContext());

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
  </span>
  <div class={[hide, 'divider-dot']}></div>
{/snippet}

<div
  class="actor-details-subtitle-row"
  data-tidy-sheet-part="actor-details-row"
>
  <div class="actor-subtitle flexrow" data-tidy-sheet-part="subtitle-row">
    {#each context.speeds as speed}
      {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
    {/each}
    {#each context.senses as sense}
      {@render speedSenseSummary(
        sense,
        ['sense', 'main-sense'],
        ['hide-under-600'],
      )}
    {/each}
    {#if size}
      <span class="size">
        <span class="font-label-medium color-text-gold">{size}</span>
      </span>
      <div class="divider-dot"></div>
    {/if}
    {#if context.system.details.creatureType?.title}
      <span class="creature-type">
        <span class="font-label-medium color-text-gold">
          {context.system.details.creatureType.title}
          {#if context.system.details.creatureType.subtitle}
            ({context.system.details.creatureType.subtitle})
          {/if}
        </span>
      </span>
      <div class="divider-dot"></div>
    {/if}
    {#if species}
      <span class="species">
        <span class="font-label-medium color-text-gold">{species}</span>
      </span>
      <div class="divider-dot"></div>
    {/if}
    <span class="alignment">
      <span class="font-label-medium color-text-gold">{alignment}</span>
    </span>
    <div class="divider-dot"></div>
    {#if context.enableXp}
      <div class="xp-label flexrow">
        <span class="label font-label-medium color-text-gold flexshrink"
          >{localize('DND5E.ExperiencePoints.Abbreviation')}</span
        >
        {#if context.unlocked}
          <TextInputQuadrone
            document={context.document}
            field="system.details.xp.value"
            value={context.system.details.xp.value}
            class="xp-value"
            enableDeltaChanges={true}
            selectOnFocus={true}
          />
        {:else}
          <span class="label font-label-medium color-text-default flexshrink">
            {FoundryAdapter.formatNumber(context.system.details.xp.value)}
          </span>
        {/if}
      </div>
    {/if}
  </div>
  <div class="proficiency flexrow" data-tooltip="DND5E.ProficiencyBonus">
    <span class="label font-label-medium color-text-gold">
      {localize('DND5E.Proficiency')}
    </span>
    <span class="modifier font-label-medium color-text-lightest">
      {pb.sign}
    </span>
    <span class="value font-data-medium color-text-default">
      {pb.value}
    </span>
  </div>
</div>
