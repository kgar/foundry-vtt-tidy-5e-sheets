<script lang="ts">
  import ItemPriceSummary from '../parts/header/ItemPriceSummary.svelte';
  import type { Item5e } from 'src/types/item.types';

  type Props = {
    rowDocument: Item5e;
  };

  let { rowDocument: item }: Props = $props();
  let conceal = $derived(item.system.identified === false);
</script>

{#if !conceal}
  <ItemPriceSummary {item} icon={false} truncate={true} showTitle={true} />
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
