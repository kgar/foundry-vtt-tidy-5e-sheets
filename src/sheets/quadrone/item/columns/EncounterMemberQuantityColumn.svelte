<script lang="ts">
  import type {
    Actor5e,
    EncounterMemberCombatantQuadroneContext,
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';

  let {
    rowDocument,
    rowContext,
  }: {
    rowDocument: Actor5e | undefined;
    rowContext:
      | EncounterMemberQuadroneContext
      | EncounterMemberCombatantQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  } = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  // When the quantity column is in the combat table,
  // it needs to put member index directly on the
  // quantity tracker, since non-member updates are done
  // on this tab, such as initiative.
  let index = $derived(
    rowContext.type === 'member' ? rowContext.index : undefined,
  );
</script>

{#if rowContext.type === 'member'}
  {const quantity = $derived(rowContext.quantity.value?.toString() ?? '')}

  {#if context.unlocked}
    <InlineQuantityTracker
      aria-label={localize('DND5E.Quantity')}
      data-tooltip="DND5E.Quantity"
      min="0"
      value={quantity}
      property="quantity.value"
      containerAttributes={{
        'data-index': index,
      }}
    />
  {:else}
    <span class="font-label-large color-text-default"
      >{rowContext.quantity.value}</span
    >
  {/if}
{/if}
