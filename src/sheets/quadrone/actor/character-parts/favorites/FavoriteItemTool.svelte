<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemTemplate from './FavoriteItemTemplate.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let subtitle = $derived(favorite.item.system.type.label);

  let modifier = $derived(
    context.actor.system.tools?.[favorite.item.system.type.baseItem]?.total,
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
    {#if !isNil(modifier)}
      {@const mod = getModifierData(modifier)}
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
  <span class="secondary"> </span>
</FavoriteItemTemplate>