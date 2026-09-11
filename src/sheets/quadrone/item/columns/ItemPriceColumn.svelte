<script lang="ts">
  import ItemPriceSummary from '../parts/header/ItemPriceSummary.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    rowDocument: Item5e;
  };
  const localize = FoundryAdapter.localize;

  let { rowDocument: item }: Props = $props();
  let conceal = $derived(item.system.identified === false);
</script>

{#if !conceal}
  <ItemPriceSummary {item} icon={false} truncate={true} showTitle={true} />
{:else}
  <span class="color-text-disabled">{conceal ? localize('TIDY5E.Table.UnidentifiedPlaceholder') : '—'}</span>
{/if}
