<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
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
    {#each context.speeds.main as speed}
      {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
    {/each}
    {#each context.senses.main as sense}
      {@render speedSenseSummary(
        sense,
        ['sense', 'main-sense'],
        ['hide-under-500'],
      )}
    {/each}
    {#each context.speeds.secondary as speed}
      {@render speedSenseSummary(
        speed,
        ['speed', 'secondary-speed'],
        ['hide-under-600'],
      )}
    {/each}
    {#each context.senses.secondary as sense}
      {@render speedSenseSummary(
        sense,
        ['sense', 'secondary-sense'],
        ['hide-under-600'],
      )}
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
      <span class="species {context.enableXp ? '' : 'hide-under-600'}">
        <span class="font-label-medium color-text-gold">{species}</span>
      </span>
      <div class="divider-dot {context.enableXp ? '' : 'hide-under-600'}"></div>
    {/if}
    <span
      class="alignment {context.speeds.secondary.length > 0
        ? context.enableXp
          ? 'hide-under-500'
          : 'hide-under-600'
        : context.enableXp
          ? 'hide-under-600'
          : 'hide-under-700'}"
    >
      <span class="font-label-medium color-text-gold">{alignment}</span>
    </span>
    <div
      class="divider-dot {context.speeds.secondary.length > 0
        ? context.enableXp
          ? 'hide-under-500'
          : 'hide-under-600'
        : context.enableXp
          ? 'hide-under-600'
          : 'hide-under-700'}"
    ></div>
    {#each context.classes as entry, i}
      <span
        class="class {i > 0
          ? context.enableXp
            ? 'hide-under-500'
            : 'hide-under-600'
          : ''}"
      >
        <span class="color-text-gold font-label-medium">{entry.name}</span>
        <span class="color-text-default font-data-medium">{entry.levels}</span>
        <!-- TODO: Add button to roll a save request to chat here (enricher?) -->
        {#if entry.spellcasting?.ability}
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
      <div
        class="divider-dot {context.enableXp
          ? 'hide-under-500'
          : 'hide-under-600'}"
      ></div>
    {/each}
  </div>
  {#if context.enableXp}
    <div class="xp-container" data-tidy-sheet-part="xp-container">
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
        <span class="separator flexshrink">/</span>
        <span class="label font-body-medium color-text-lighter flexshrink"
          >{FoundryAdapter.formatNumber(context.system.details.xp.max)}</span
        >
      </div>
      {#if !context.unlocked}
        <div
          class="xp-bar xp meter progress"
          style="--bar-percentage: {context.system.details.xp.pct}%;"
          data-tidy-sheet-part="xp-bar"
        >
          <span
            class="xp-bar-current"
            style="width: {context.system.details.xp.pct}%"
          ></span>
        </div>
      {/if}
    </div>
  {/if}
</div>
