<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  const { favorite }: Props = $props();

  const context = $derived(getCharacterSheetQuadroneContext());

  const subtitle = $derived(favorite.item.system.type.label);

  const modifier = $derived(
    context.actor.system.tools?.[favorite.item.system.type.baseItem]?.total,
  );
</script>

<div
  class="list-entry favorite"
  data-favorite-type="tool"
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
    onUse={(ev) => context.sheet.tryUseItem(favorite.item, ev)}
    name={favorite.item.name}
    {subtitle}
  />
  <div class="">
    <span class="primary">
      {#if !isNil(modifier)}
        {@const mod = getModifierData(modifier)}
        <span class="modifier">
          <span class="sign">
            {mod.sign}
          </span>
          <span>
            {mod.value}
          </span>
        </span>
      {/if}
    </span>
    <!-- <span class="secondary"> </span> -->
  </div>
</div>
