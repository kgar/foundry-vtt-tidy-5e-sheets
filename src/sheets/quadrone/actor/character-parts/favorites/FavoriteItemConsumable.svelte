<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemGeneric from './FavoriteItemGeneric.svelte';
  import FavoriteItemRollButton from './parts/FavoriteItemRollButton.svelte';
  import FavoriteItemUses from './parts/FavoriteItemUses.svelte';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let subtitle = $derived(
    [
      favorite.item.system.type.label,
      favorite.item.labels.activation,
    ].filterJoin(` <span class="divider-dot"></span> `),
  );

  let uses = $derived(
    favorite.item.system.hasLimitedUses
      ? favorite.item.system.getUsesData()
      : null,
  );

  let quantity = $derived(favorite.item.system.quantity);
</script>

<li
  class="favorite"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.item.item?.id}
>
  <FavoriteItemRollButton {favorite} />
  <div class="name stacked">
    <span class="title">
      {favorite.item.name}
    </span>
    {#if subtitle}
      <span class="subtitle">
        {subtitle}
      </span>
    {/if}
  </div>
  <div class="info">
    <span class="primary">
      {#if uses?.max}
        <FavoriteItemUses {favorite} {uses} />
      {:else}
        <span class="sign">&times;</span>
        <span class="value">{quantity}</span>
      {/if}
    </span>
    <span class="secondary">
      {#if uses?.max && quantity}
        <span class="quantity">&times; {quantity}</span>
      {/if}
    </span>
  </div>
</li>
