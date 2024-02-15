<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import ItemControl from './ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: Item5e;

  $: active = FoundryAdapter.isDocumentFavorited(item);
  $: title = FoundryAdapter.localize(
    active ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite'
  );
</script>

<ItemControl
  iconCssClass="fas fa-bookmark"
  {active}
  {title}
  on:click={() => FoundryAdapter.toggleFavorite(item)}
/>
