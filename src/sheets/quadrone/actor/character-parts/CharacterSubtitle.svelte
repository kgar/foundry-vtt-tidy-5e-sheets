<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  // type Props = {
  //   onRollAbility?: (event: MouseEvent, key: string, value: number) => void;
  // }
  // let { onRollAbility }: Props = $props();

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

  let checkWidths = $derived(() => {
    console.log(window.innerWidth);
  });
</script>

{#snippet speedSenseSummary(
  speed: CharacterSpeedSenseEntryContext,
  clsx?: ClassValue,
  hide?: ClassValue
)}
  <span class={[clsx, hide]}>
    <span class="color-text-gold font-label-medium">{speed.label}</span>
    <span class="color-text-default font-data-medium">{speed.value}</span>
    <span class="color-text-lighter font-label-medium">{speed.units}</span>
  </span>
  <div class={[hide, "divider-dot"]}></div>
{/snippet}

<div class="character-details-subtitle-row">
  <div class="character-subtitle flexrow">
    {#each context.speeds.main as speed}
      {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
    {/each}
    {#each context.senses.main as sense}
      {@render speedSenseSummary(sense, ['sense', 'main-sense'], ['hide-under-500'])}
    {/each}
    {#each context.speeds.secondary as speed}
      {@render speedSenseSummary(speed, ['speed', 'secondary-speed'], ['hide-under-600'])}
    {/each}
    {#each context.senses.secondary as sense}
      {@render speedSenseSummary(sense, ['sense', 'secondary-sense'], ['hide-under-600'])}
    {/each}
    {#if size}
      <span class="size">
        <span class="font-label-medium color-text-gold">{size}</span>
      </span>
      <div class="divider-dot"></div>
    {/if}
    {#if context.creatureType?.title}
      <span class="creature-type">
        <span class="font-label-medium color-text-gold">
          {context.creatureType.title}
          {#if context.creatureType.subtitle}
            ({context.creatureType.subtitle})
          {/if}
        </span>
      </span>
      <div class="divider-dot"></div>
    {/if}
    {#if species}
      <span class="species hide-under-600">
        <span class="font-label-medium color-text-gold">{species}</span>
      </span>
      <div class="divider-dot hide-under-600"></div>
    {/if}
    <span class="alignment {context.speeds.secondary.length > 0 ? 'hide-under-600' : 'hide-under-700'}">
      <span class="font-label-medium color-text-gold">{alignment}</span>
    </span>
    <div class="divider-dot {context.speeds.secondary.length > 0 ? 'hide-under-600' : 'hide-under-700'}"></div>
    {#each context.classes as entry, i}
      <span class="class" class:hide-under-600={i > 0}>
        <span class="color-text-gold font-label-medium">{entry.name}</span>
        <span class="color-text-default font-data-medium">{entry.levels}</span>
        <!-- TODO: Add button to roll a save request to chat here (enricher?) -->
        {#if entry.spellcasting}
          <!-- <button 
            type="button"
            onclick={(ev) => entry.spellcasting && onRollAbility?.(ev, entry.spellcasting.ability, entry.spellcasting.dc)}
            class="ability-roll-button label color-text-lighter font-label-medium dc"
            > -->
            <span class="color-text-lighter font-label-medium dc"
              >{entry.spellcasting.ability}
              {localize('DND5E.AbbreviationDC')}</span
            >
            <span class="color-text-default font-data-medium"
              >{entry.spellcasting.dc}</span
            >
          <!-- </button> -->
        {/if}
      </span>
      <div class="divider-dot hide-under-600"></div>
    {/each}
  </div>
  {#if context.enableXp}
    <div class="xp-container">    
      <div class="xp-label">
        <span class="label font-label-medium color-text-gold">XP</span>
        <span class="label font-label-medium color-text-default">12,345</span>
        <span class="separator">/</span>
        <span class="label font-body-medium color-text-lighter">17,500</span>
      </div>
      <div class="xp-bar xp meter progress"
        style="--bar-percentage: 50%;">
        <span class="xp-bar-current" style="width: 50%"></span>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .character-details-subtitle-row {
    container-type: inline-size;

    @container (width > 800px) {
      // background-color: red;
    }
  }
</style>
