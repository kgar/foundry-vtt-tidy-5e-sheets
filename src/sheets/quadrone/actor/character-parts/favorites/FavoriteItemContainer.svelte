<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(localize(CONFIG.Item.typeLabels[favorite.item.type]));
</script>

<div
  class="list-entry favorite"
  data-favorite-type="container"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.item.item?.id}
>
  <FavoriteItemRollButton
    {favorite}
    img={favorite.item.img}
    title={favorite.item.name}
    onUse={async (ev) =>
      await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
  />
  <div class="">
    <div class="item-name stacked">
      <span class="title">
        {favorite.item.name}
      </span>
    <span class="subtitle flexrow color-text-lighter font-default-small">
      {@html subtitle}
    </span>
    </div>
  </div>
  <div class="">
    <span class="primary">
      {#if favorite.capacity}
        <span class="value">{favorite.capacity.value}</span>
        <span class="separator">&sol;</span>
        <span class="max">{favorite.capacity.max}</span>
      {/if}
    </span>
    <!-- <span class="secondary"> </span> -->
  </div>
</div>
