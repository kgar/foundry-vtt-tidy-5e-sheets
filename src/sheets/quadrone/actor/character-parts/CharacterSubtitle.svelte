<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  let context = $derived(getCharacterSheetQuadroneContext());

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
</script>

{#snippet speedSenseSummary(
  speed: CharacterSpeedSenseEntryContext,
  clsx?: ClassValue,
)}
  <span class={[clsx]}>
    <span class="color-text-gold font-label-medium">{speed.label}</span>
    <span class="color-text-default font-data-medium">{speed.value}</span>
    <span class="color-text-lighter font-label-medium">{speed.units}</span>
  </span>
{/snippet}

<div class="character-details-subtitle-row">
  <div class="character-subtitle">
    {#each context.speeds.main as speed}
      {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
    {/each}
    {#each context.senses.main as sense}
      {@render speedSenseSummary(sense, ['sense', 'main-sense'])}
    {/each}
    {#each context.speeds.secondary as speed}
      {@render speedSenseSummary(speed, ['speed', 'secondary-speed'])}
    {/each}
    {#each context.senses.secondary as sense}
      {@render speedSenseSummary(sense, ['sense', 'secondary-sense'])}
    {/each}
    {#if size}
      <span class="size">
        <span class="color-text-gold">{size}</span>
      </span>
    {/if}
    {#if context.creatureType?.title}
      <span class="creature-type">
        <span class="color-text-gold">
          {context.creatureType.title}
          {#if context.creatureType.subtitle}
            ({context.creatureType.subtitle})
          {/if}
        </span>
      </span>
    {/if}
    {#if species}
      <span class="species">
        <span class="color-text-gold">{species}</span>
      </span>
    {/if}
    <span class="alignment">
      <span class="color-text-gold">{alignment}</span>
    </span>
    {#each context.classes as entry}
      <span class="class">
        <span class="color-text-gold font-label-medium">{entry.name}</span>
        <span class="color-text-default font-data-medium">{entry.levels}</span>
        <!-- TODO: Add button to roll a save request to chat here (enricher?) -->
        {#if entry.spellcasting}
          <span class="color-text-lighter font-label-medium dc"
            >{entry.spellcasting.ability}
            {localize('DND5E.AbbreviationDC')}</span
          >
          <span class="color-text-default font-data-medium"
            >{entry.spellcasting.dc}</span
          >
        {/if}
      </span>
    {/each}
  </div>
  {#if context.enableXp}
    <div class="xp-container">Literally have never used this.</div>
  {/if}
</div>
