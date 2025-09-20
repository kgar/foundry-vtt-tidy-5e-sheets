<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { EncounterCreatureTypeContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  let context = $derived(getEncounterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  // TODO: To context prop
  let memberCount = $derived(
    context.members.npc.reduce(
      (prev, curr) => prev + (curr.quantity.value ?? 0),
      0,
    ),
  );

  let totalGold = $derived.by(() =>
    FoundryAdapter.formatNumber(context.totalGold),
  );

  let totalXp = $derived.by(() => FoundryAdapter.formatNumber(context.totalXp));
</script>

{#snippet creatureTypeEntry(
  entry: EncounterCreatureTypeContext,
  clsx?: ClassValue,
  hide?: ClassValue,
)}
  <span class={[clsx, hide]}>
    <span class="color-text-gold font-label-medium">{entry.label}</span>
    <span class="color-text-default font-data-medium">{entry.quantity}</span>
  </span>
{/snippet}

<div class="actor-subtitle separated-list" data-tidy-sheet-part="subtitle-row">
  {#if memberCount > 0}
    <span class="members">
      <span class="color-text-gold font-label-medium"
        >{memberCount > 1
          ? localize('DND5E.Group.Member.other')
          : localize('DND5E.Group.Member.one')}</span
      >
      <span class="color-text-default font-data-medium">{memberCount}</span>
    </span>
    <div class="divider-dot"></div>
  {/if}
  {#each context.creatureTypes as entry, i}
    {#if i > 0}
      <div class="divider-dot"></div>
    {/if}
    {@render creatureTypeEntry(entry)}
  {/each}

  {#if context.enableXp}
    <div class="divider-dot"></div>
    <span class="xp">
      <span class="label font-label-medium color-text-gold flexshrink"
        >{localize('DND5E.ExperiencePoints.Abbreviation')}</span
      >
      <span class="label font-label-medium color-text-default flexshrink"
        >{totalXp}</span
      >
    </span>
  {/if}

  {#if totalGold !== null}
    <div class="divider-dot"></div>
    <span class="money">
      <i class="currency gp"></i>
      <span class="color-text-default font-data-medium">{totalGold}</span>
    </span>
  {/if}
</div>
