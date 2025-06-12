<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';
  import FavoriteItemUses from './parts/FavoriteItemUses.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let quantity = $derived(favorite.item.system.quantity);

  let subtitle = $derived(
    [
      favorite.item.system.type.label,
      favorite.item.labels.activation,
      quantity > 1 ? `&times;${quantity}` : null,
    ].filterJoin(` <div class="divider-dot"></div> `),
  );

  let uses = $derived(
    favorite.item.system.hasLimitedUses
      ? favorite.item.system.getUsesData()
      : null,
  );
</script>

<div
  class="list-entry favorite"
  data-favorite-type="consumable"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-favorite-id={favorite.id}
  data-tidy-draggable
>
  <FavoriteItemRollButton
    {favorite}
    img={favorite.item.img}
    title={favorite.item.name}
    onUse={async (ev) =>
      await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
    name={favorite.item.name}
    {subtitle}
  />
  {#if uses?.max || quantity}
    <div class="">
      <span class="primary">
        {#if uses?.max}
          <FavoriteItemUses {favorite} {uses} />
        {:else}
          <span class="sign font-default-medium color-text-lighter"
            >&times;</span
          >
          <span class="value font-data-medium color-text-default"
            >{quantity}</span
          >
        {/if}
      </span>
    </div>
  {/if}
</div>
