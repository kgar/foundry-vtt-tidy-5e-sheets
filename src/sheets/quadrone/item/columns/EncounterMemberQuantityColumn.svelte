<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    EncounterMemberQuadroneContext | EncounterPlaceholderQuadroneContext
  > = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;
</script>

{#if rowContext.type === 'member'}
  {@const quantity = rowContext.quantity.value?.toString() ?? ''}

  {#if context.unlocked}
    <InlineQuantityTracker
      aria-label={localize('DND5E.Quantity')}
      data-tooltip="DND5E.Quantity"
      min="0"
      value={quantity}
      onchange={async (ev) => {
        const input = ev.currentTarget;
        await context.sheet.updateMemberQuantity(
          rowDocument.uuid,
          ev.currentTarget.value,
        );
        input.value = quantity;
      }}
    />
  {:else}
    <span class="font-label-large color-text-default"
      >{rowContext.quantity.value}</span
    >
  {/if}
{/if}
