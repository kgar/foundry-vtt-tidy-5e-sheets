<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/item/item.types';
  import ItemPriceSummary from '../parts/header/ItemPriceSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let { rowDocument: item }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));

  let conceal = $derived(item.system.identified === false && !gmEditMode);
</script>

{#if !conceal}
  <ItemPriceSummary {item} icon={false} truncate={true} showTitle={true} />
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
