<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ItemUtils } from 'src/utils/ItemUtils';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  const { favorite }: Props = $props();
  const localize = FoundryAdapter.localize;
  const context = $derived(getCharacterSheetQuadroneContext());
  const unidentified = $derived(ItemUtils.isUnidentified(favorite.item));
  const concealed = $derived(
    ItemUtils.isConcealed(favorite.item, { unlocked: context.unlocked }),
  );

  const subtitle = $derived(favorite.item.system.type.label);

  const modifier = $derived(
    context.actor.system.tools?.[favorite.item.system.type.baseItem]?.total,
  );
</script>

<div
  class="list-entry favorite {unidentified ? 'diminished' : ''}"
  data-favorite-type="tool"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={favorite.item?.id}
  data-favorite-id={favorite.id}
  data-tidy-draggable
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    img={favorite.item.img}
    title={favorite.item.name}
    data-action="use"
    name={favorite.item.name}
    {subtitle}
  />
  <div class="">
    <span class="primary">
      {#if concealed}
        <span class="value color-text-lightest">{localize('TIDY5E.COMMON.Unidentified.Placeholder')}</span>
      {:else if !isNil(modifier)}
        {const mod = $derived(getModifierData(modifier))}
        <span class="modifier">
          <span class="sign">
            {mod.sign}
          </span>
          <span>
            {mod.value}
          </span>
        </span>
      {/if}
    </span>
    <!-- <span class="secondary"> </span> -->
  </div>
</div>
