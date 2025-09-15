<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';
  import { tick } from 'svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, EncounterMemberQuadroneContext> = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let quantity = $derived(rowContext.quantity.value?.toString() ?? '');
</script>

{#if context.unlocked}
  <span class="quantity-tracker-input-wrapper flexrow">
    <input
      type="text"
      class="quantity-tracker-input"
      {@attach InputAttachments.selectOnFocus}
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
    <button class="button button-icon-only button-borderless flexshrink">
      <i class="fa-solid fa-dice-d20"></i>
    </button>
  </span>
{:else}
  <span class="font-label-large color-text-default"
    >{rowContext.quantity.value}</span
  >
{/if}
