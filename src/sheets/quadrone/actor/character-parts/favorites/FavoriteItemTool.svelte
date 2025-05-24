<script lang="ts">
    import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
    import FavoriteItemGeneric from './FavoriteItemGeneric.svelte';
    import FavoriteItemRollButton from './parts/FavoriteItemRollButton.svelte';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());
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
      <!-- {subtitle} -->
    </span>
  </div>
  <div class="info">
    <span class="primary"> </span>
    <span class="secondary"> </span>
  </div>
</li>
