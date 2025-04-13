<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from './ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    item: Item5e;
    favorited: boolean;
  }

  let { item, favorited }: Props = $props();

  let title = $derived(
    FoundryAdapter.localize(
      favorited ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
    ),
  );
</script>

<ItemControl
  iconCssClass="fas fa-bookmark"
  active={favorited}
  {title}
  onclick={() => FoundryAdapter.toggleFavoriteItem(item)}
/>
