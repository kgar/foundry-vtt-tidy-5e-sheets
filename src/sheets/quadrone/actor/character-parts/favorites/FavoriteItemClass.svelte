<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let subtitle = $derived(
    favorite.item.subclass
      ? favorite.item.subclass.name
      : localize(CONFIG.Item.typeLabels[favorite.item.type]),
  );

  let value = $derived(favorite.item.system.levels);
</script>

<div
  class="list-entry favorite"
  role="button"
  tabindex="0"
  data-favorite-type="class"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-tidy-draggable
  data-favorite-id={favorite.id}
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, favorite.item)}
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    {favorite}
    img={favorite.item.img}
    title={favorite.item.name}
    onUse={async (ev) =>
      await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
    name={favorite.item.name}
    {subtitle}
  />
  {#if value}
    <div class="">
      <span class="primary">
        <span class="value font-data-medium color-text-default">
          {value}
        </span>
      </span>
      <!-- <span class="secondary"> </span> -->
    </div>
  {/if}
</div>
