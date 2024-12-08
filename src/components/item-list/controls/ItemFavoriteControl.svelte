<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from './ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  let active = $derived(FoundryAdapter.isItemFavorited(item));
  let title = $derived(
    FoundryAdapter.localize(
      active ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
    ),
  );
</script>

<ItemControl
  iconCssClass="fas fa-bookmark"
  {active}
  {title}
  onclick={() => FoundryAdapter.toggleFavoriteItem(item)}
/>
