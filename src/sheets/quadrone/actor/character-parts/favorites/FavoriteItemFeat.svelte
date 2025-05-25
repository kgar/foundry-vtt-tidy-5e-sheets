<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';
  import FavoriteItemUses from './parts/FavoriteItemUses.svelte';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

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
    {/if}
  </span>
  <span class="secondary"> </span>
</FavoriteItemTemplate>
