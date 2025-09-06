<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { isNil } from 'src/utils/data';
  import { getModifierData } from 'src/utils/formatting';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let subtitle = $derived(
    CONFIG.DND5E.itemActionTypes[
      favorite.item?.system?.activities?.contents?.[0]?.actionType
    ],
  );

  let modifier = $derived(favorite.item?.labels?.modifier);

  let range = $derived(favorite.item?.system?.range);
</script>

<div
  class="list-entry favorite"
  data-favorite-type="weapon"
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
    onUse={async (ev) =>
      await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
    name={favorite.item?.name || ''}
    {subtitle}
  />
  <div class="stacked">
    <span class="primary">
      {#if !isNil(modifier)}
        {@const mod = getModifierData(modifier)}
        <span class="modifier"><span class="sign font-default-medium color-text-lighter">{mod.sign}</span><span class="value font-data-medium">{mod.value}</span></span>
      {/if}
    </span>
    <span class="subtitle secondary font-default-medium">
      {#if range?.value}
        <span class="range">
          {range.value}
          {#if range.long}&sol; {range.long}{/if}
          {range.units || ''}
        </span>
      {:else if range?.reach}
        <span class="range">
          {range.reach}
          {range.units || ''}
        </span>
      {/if}
    </span>
  </div>
</div>
