<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  const { favorite }: Props = $props();

  const localize = FoundryAdapter.localize;

  const subtitle = $derived(
    localize(CONFIG.Item.typeLabels[favorite.item.type]),
  );

  const context = $derived(getCharacterSheetQuadroneContext());
</script>

<div
  class="list-entry favorite"
  data-favorite-type="container"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-favorite-id={favorite.id}
  data-tidy-draggable
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, favorite.item)}
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    {favorite}
    img={favorite.item.img}
    title={favorite.item.name}
    onUse={async (ev) => context.sheet.tryUseItem(favorite.item, ev)}
    name={favorite.item.name}
    {subtitle}
  />
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
