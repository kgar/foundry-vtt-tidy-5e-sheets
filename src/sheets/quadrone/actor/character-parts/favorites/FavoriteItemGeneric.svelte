<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getModifierData } from 'src/utils/formatting';
  import FavoriteItemUses from './parts/FavoriteItemUses.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';
  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let subtitle = 'todo';

  let uses = $derived(
    favorite.item.system.hasLimitedUses
      ? favorite.item.system.getUsesData()
      : null,
  );

  let modifier = $derived(favorite.item.labels?.modifier);

  let save = $derived(
    favorite.item.system.activities?.getByType?.('save')?.[0]?.save,
  );

  let quantity = $derived(favorite.item.system.quantity);

  let range = $derived(favorite.item.system.range);
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
    'item-id': favorite.item.id,
  }}
>
  <span class="primary">
    {#if uses?.max}
      <FavoriteItemUses {favorite} {uses} />
    {:else if !isNil(modifier)}
      {@const mod = getModifierData(modifier)}
      <span class="modifier">
        <span class="sign">
          {mod.sign}
        </span>
        <span>
          {mod.value}
        </span>
      </span>
    {:else if save?.dc?.value}
      <span class="save">
        <span class="value">
          {save.dc.value}
        </span>
        <span class="ability">
          {save.ability}
        </span>
      </span>
    {:else if quantity}
      <span class="sign">&times;</span>
      <span class="value">{quantity}</span>
    {/if}
  </span>
  <span class="secondary">
    {#if uses?.max && quantity}
      <span class="quantity">&times; {quantity}</span>
    {:else if range?.value}
      <span class="range">
        {range.value}
        {#if range.long}&sol; {range.long}{/if}
        {range.units}
      </span>
    {:else if range?.reach}
      <span class="range">
        {range.reach}
        {range.units}
      </span>
    {/if}
  </span>
</FavoriteItemTemplate>
