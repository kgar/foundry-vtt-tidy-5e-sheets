<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(localize(CONFIG.Item.typeLabels[favorite.item.type]));
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
      <!-- TODO: Hireling / Defender Trackers?  -->
      <!-- TODO: Or perhaps Job Progress? -->
  </span>
  <span class="secondary"> </span>
</FavoriteItemTemplate>
