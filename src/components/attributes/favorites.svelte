<script lang="ts">
  import { isItemFavorite } from 'src/favorites/favorites';
  import type { ActorSheetContext } from 'src/types/types';
  import InventoryList from '../inventory/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from '../favorites/FavoriteFeaturesList.svelte';
  import type { Item5e } from 'src/types/item';
  import FavoriteSpellsList from 'src/components/favorites/FavoriteSpellsList.svelte';
  import { SettingsProvider } from 'src/settings/settings';

  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;

  const sortAlphabetically =
    SettingsProvider.settings.enableSortFavoritesItemsAlphabetically.get();

  $: favoriteInventory = sortByNameIfConfigured(
    context.inventory
      .flatMap((x: { items: Item5e[] }) => x.items)
      .filter(isItemFavorite)
  );

  $: favoriteFeatures = sortByNameIfConfigured(
    context.features
      .flatMap((x: { items: Item5e[] }) => x.items)
      .filter(isItemFavorite)
  );

  function getFavoriteSpells(spells: Item5e[]): Item5e[] {
    return sortByNameIfConfigured(spells.filter(isItemFavorite));
  }

  function sortByNameIfConfigured(items: Item5e[]): Item5e[] {
    return sortAlphabetically
      ? items.sort((a, b) => a.name.localeCompare(b.name))
      : items;
  }
</script>

<div class="flexcol no-gap">
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
    <FavoriteFeaturesList {context} items={favoriteFeatures} />
  {/if}

  {#each context.spellbook as section}
    {@const favoriteSpells = getFavoriteSpells(section.spells)}
    {#if favoriteSpells.length}
      <FavoriteSpellsList {context} {section} spells={favoriteSpells} />
    {/if}
  {/each}
</div>
