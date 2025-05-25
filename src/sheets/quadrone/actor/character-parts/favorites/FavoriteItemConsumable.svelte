<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemUses from './parts/FavoriteItemUses.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';

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
</FavoriteItemTemplate>
