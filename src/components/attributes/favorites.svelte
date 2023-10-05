<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import InventoryList from '../inventory/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from '../favorites/FavoriteFeaturesList.svelte';
  import type { Item5e } from 'src/types/item';
  import FavoriteSpellsList from 'src/components/favorites/FavoriteSpellsList.svelte';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<CharacterSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  $: favoriteInventory = sortByNameIfConfigured(
    $settingStore.enableSortFavoritesItemsAlphabetically,
    $store.inventory
      .flatMap((x: { items: Item5e[] }) => x.items)
      .filter(FoundryAdapter.isItemFavorite)
  );

  $: favoriteFeatures = sortByNameIfConfigured(
    $settingStore.enableSortFavoritesItemsAlphabetically,
    $store.features
      .flatMap((x: { items: Item5e[] }) => x.items)
      .filter(FoundryAdapter.isItemFavorite)
  );

  function getFavoriteSpells(
    sortFavoritesItemsAlphabetically: boolean,
    spells: Item5e[]
  ): Item5e[] {
    return sortByNameIfConfigured(
      sortFavoritesItemsAlphabetically,
      spells.filter(FoundryAdapter.isItemFavorite)
    );
  }

  function sortByNameIfConfigured(
    sortAlphabetically: boolean,
    items: Item5e[]
  ): Item5e[] {
    return sortAlphabetically
      ? items.sort((a, b) => a.name.localeCompare(b.name))
      : items;
  }
</script>

<div class="flex-column small-gap">
  {#if favoriteInventory.length}
    <InventoryList
      items={favoriteInventory}
      primaryColumnName={localize('DND5E.Inventory')}
      lockControls={true}
      allowFavoriteIconNextToName={false}
      includeWeightColumn={false}
    />
  {/if}

  {#if favoriteFeatures.length}
    <FavoriteFeaturesList items={favoriteFeatures} />
  {/if}

  {#each $store.spellbook as section}
    {@const favoriteSpells = getFavoriteSpells(
      $settingStore.enableSortFavoritesItemsAlphabetically,
      section.spells
    )}
    {#if favoriteSpells.length}
      <FavoriteSpellsList {section} spells={favoriteSpells} />
    {/if}
  {/each}
</div>
