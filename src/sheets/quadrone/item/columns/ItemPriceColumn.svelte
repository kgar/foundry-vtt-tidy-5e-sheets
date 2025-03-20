<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/item/item.types';
  import ItemPriceSummary from '../parts/header/ItemPriceSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let { rowDocument: item }: ColumnCellProps = $props();

  let conceal = $derived(
    !FoundryAdapter.userIsGm() && item.system.identified === false,
  );
</script>

{#if !conceal}
  <ItemPriceSummary {item} icon={false} truncate={true} showTitle={true} />
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
