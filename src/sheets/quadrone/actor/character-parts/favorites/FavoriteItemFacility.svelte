<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  const { favorite }: Props = $props();

  const localize = FoundryAdapter.localize;

  const subtitle = $derived(
    localize(CONFIG.Item.typeLabels[favorite.item.type]),
  );
</script>

<div
  class="list-entry favorite"
  data-favorite-type="facility"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-favorite-id={favorite.id}
  data-tidy-draggable
  data-tidy-sheet-part="favorite-entry"
  data-reference-tooltip={favorite.reference}
>
  <FavoriteRollButton
    data-action="use"
    img={favorite.item.img}
    title={!favorite.reference ? favorite.item?.name : undefined}
    name={favorite.item.name}
    {subtitle}
    useTooltip={!favorite.reference}
  />
  <div class="">
    <span class="primary">
      <!-- TODO: Hireling / Defender Trackers?  -->
      <!-- TODO: Or perhaps Job Progress? -->
    </span>
    <!-- <span class="secondary"> </span> -->
  </div>
</div>
