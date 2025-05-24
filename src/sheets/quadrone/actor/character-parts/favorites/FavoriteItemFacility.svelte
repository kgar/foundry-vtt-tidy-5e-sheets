<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemRollButton from './parts/FavoriteItemRollButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(localize(CONFIG.Item.typeLabels[favorite.item.type]));
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
    <span class="subtitle">
      {subtitle}
    </span>
  </div>
  <div class="info">
    <span class="primary">
      <!-- TODO: Hireling / Defender Trackers?  -->
      <!-- TODO: Or perhaps Job Progress? -->
    </span>
    <span class="secondary"> </span>
  </div>
</li>
