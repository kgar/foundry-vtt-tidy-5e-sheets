<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteItemRollButton from './parts/FavoriteRollButton.svelte';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';
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


<FavoriteItemTemplate
  {favorite}
  img={favorite.item.img}
  name={favorite.item.name}
  onUse={async (ev) =>
    await FoundryAdapter.actorTryUseItem(favorite.item, ev)}
  subtitle={subtitle}
  dataAttributes={{
    'item-id': favorite.item.item?.id,
    'context-menu': CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
  }}
>
  <div class="info">
    <span class="primary">
      <span class="value">
        {value}
      </span>
    </span>
    <span class="secondary"></span>
  </div>
</FavoriteItemTemplate>