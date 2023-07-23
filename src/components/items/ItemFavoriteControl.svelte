<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import ItemControl from './ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: Item5e;

  const active = FoundryAdapter.tryGetFlag<boolean>(item, 'favorite') === true;
  const title = FoundryAdapter.localize(
    active ? 'T5EK.AddFav' : 'Remove Favorite'
  );

  function toggleFavorite() {
    if (active) {
      FoundryAdapter.unsetFlag(item, 'favorite');
    } else {
      FoundryAdapter.setFlag(item, 'favorite', true);
    }
  }
</script>

<ItemControl
  iconCssClass="fas fa-bookmark"
  {active}
  {title}
  on:click={() => toggleFavorite()}
/>
