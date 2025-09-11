<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

  let context = $derived(getEncounterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let isEditingXp = $state(false);
  let xpInputRef: TextInputQuadrone | undefined = $state();

  $effect(() => {
    if (isEditingXp && xpInputRef) {
      xpInputRef.selectText();
    }
  });

  let memberCount = $derived(
      context.members.npc.length
  );
  /* TODO: Use getGpSummary from Tidy5eMultiActorSheetQuadroneBase */
  let totalGold = 0; // $derived.by(() => context.sheet.getGpSummary(context.actor));
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
{/snippet}

<!-- Group subtitle, member info -->
<div class="actor-subtitle separated-list" data-tidy-sheet-part="subtitle-row">
  <span class="difficulty">
    <!-- TODO: Add difficulty level -->
    <span class="color-text-default font-label-medium"
      >{localize('DND5E.ENCOUNTER.Difficulty.low')}</span
    >
  </span>
  <div class="divider-dot"></div>
  <span class="members">
    <span class="color-text-gold font-label-medium"
      >{memberCount > 1
        ? localize('DND5E.Group.Member.other')
        : localize('DND5E.Group.Member.one')}</span
    >
    <span class="color-text-default font-data-medium">{memberCount}</span>
  </span>
  <!-- TODO: Is there any difficulty calculator math we can easily do? -->
  <!-- <div class="divider-dot"></div>
  <span class="average-level">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.LevelAvg')}</span
    >
    <span class="color-text-default font-data-medium"
      >{context.actor.system.level}</span
    >
  </span> -->
  {#if totalGold !== null}
    <div class="divider-dot"></div>
    <span class="money">
      <i class="currency gp"></i>
      <span class="color-text-default font-data-medium"
        >{FoundryAdapter.formatNumber(Math.round(totalGold))}</span
      >
    </span>
  {/if}
  <!-- TODO Figure out how to display total encounter XP up here. -->
</div>
