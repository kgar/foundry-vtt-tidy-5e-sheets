<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import FavoriteItemGeneric from './FavoriteItemGeneric.svelte';
  import FavoriteItemClass from './FavoriteItemClass.svelte';
  import FavoriteItemConsumable from './FavoriteItemConsumable.svelte';
  import FavoriteItemContainer from './FavoriteItemContainer.svelte';
  import FavoriteItemEquipment from './FavoriteItemEquipment.svelte';
  import FavoriteItemFacility from './FavoriteItemFacility.svelte';
  import FavoriteItemFeat from './FavoriteItemFeat.svelte';
  import FavoriteItemSpell from './FavoriteItemSpell.svelte';
  import FavoriteItemTool from './FavoriteItemTool.svelte';
  import FavoriteItemWeapon from './FavoriteItemWeapon.svelte';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

{#if favorite.item.type === CONSTANTS.ITEM_TYPE_CLASS}
  <FavoriteItemClass {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_CONSUMABLE}
  <FavoriteItemConsumable {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_CONTAINER}
  <FavoriteItemContainer {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
  <FavoriteItemEquipment {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_FACILITY}
  <FavoriteItemFacility {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_FEAT}
  <FavoriteItemFeat {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_SPELL}
  <FavoriteItemSpell {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_TOOL}
  <FavoriteItemTool {favorite} />
{:else if favorite.item.type === CONSTANTS.ITEM_TYPE_WEAPON}
  <FavoriteItemWeapon {favorite} />
{:else}
  <FavoriteItemGeneric {favorite} />
{/if}
