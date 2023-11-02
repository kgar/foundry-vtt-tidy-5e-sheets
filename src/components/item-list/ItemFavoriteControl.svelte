<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import ItemControl from './controls/ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: Item5e;

  $: active = FoundryAdapter.tryGetFlag<boolean>(item, 'favorite') === true;
  $: title = FoundryAdapter.localize(
    active ? 'Remove Favorite' : 'T5EK.AddFav'
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
