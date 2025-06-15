<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import ItemPriceSummary from '../parts/header/ItemPriceSummary.svelte';

  let { rowDocument: item }: ColumnCellProps = $props();

let conceal = $derived(item.system.identified === false);
</script>

{#if !conceal}
  <ItemPriceSummary {item} icon={false} truncate={true} showTitle={true} />
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
