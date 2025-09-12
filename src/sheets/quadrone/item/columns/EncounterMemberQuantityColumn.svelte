<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';
  import { tick } from 'svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, EncounterMemberQuadroneContext> = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let quantity = $derived(rowContext.quantity.value);
</script>

{#if context.unlocked}
  <InlineQuantityTracker
    aria-label={localize('DND5E.Quantity')}
    data-tooltip="DND5E.Quantity"
    min="0"
    value={quantity}
    onchange={async (ev) =>
      await context.sheet.updateMemberQuantity(
        rowDocument.uuid,
        ev.currentTarget.value,
      )}
  />
{:else}
  <span class="font-label-large color-text-default"
    >{rowContext.quantity.value}</span
  >
{/if}
