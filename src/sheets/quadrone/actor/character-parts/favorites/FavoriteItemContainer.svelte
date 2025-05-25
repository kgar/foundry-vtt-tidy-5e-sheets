<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(localize(CONFIG.Item.typeLabels[favorite.item.type]));
</script>

<FavoriteItemTemplate
  {favorite}
  img={favorite.item.img}
  name={favorite.item.name}
  onUse={async (ev) =>
    await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
  subtitle={subtitle}
  dataAttributes={{
    'context-menu': CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
    'item-id': favorite.item.item?.id,
  }}
>
  <span class="primary">
    {#if favorite.capacity}
      <span class="value">{favorite.capacity.value}</span>
      <span class="separator">&sol;</span>
      <span class="max">{favorite.capacity.max}</span>
    {/if}
  </span>
  <span class="secondary"> </span>
</FavoriteItemTemplate>