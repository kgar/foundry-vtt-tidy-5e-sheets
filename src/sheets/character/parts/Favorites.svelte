<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import InventoryList from './InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from './FavoriteFeaturesList.svelte';
  import type { Item5e } from 'src/types/item.types';
  import FavoriteSpellsList from 'src/sheets/character/parts/FavoriteSpellsList.svelte';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  $: favoriteInventory = sortByNameIfConfigured(
    $settingStore.sortFavoriteItemsAlphabetically,
    $context.inventory
      .flatMap((x: any) => x.items)
      .filter(FoundryAdapter.isDocumentFavorited)
  );

  $: favoriteFeatures = sortByNameIfConfigured(
    $settingStore.sortFavoriteItemsAlphabetically,
    $context.features
      .flatMap((x: any) => x.items)
      .filter(FoundryAdapter.isDocumentFavorited)
  );

  function getFavoriteSpells(
    sortFavoriteItemsAlphabetically: boolean,
    spells: Item5e[]
  ): Item5e[] {
    return sortByNameIfConfigured(
      sortFavoriteItemsAlphabetically,
      spells.filter(FoundryAdapter.isDocumentFavorited)
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

  {#each $context.spellbook as section}
    {@const favoriteSpells = getFavoriteSpells(
      $settingStore.sortFavoriteItemsAlphabetically,
      section.spells
    )}
    {#if favoriteSpells.length}
      <FavoriteSpellsList {section} spells={favoriteSpells} />
    {/if}
  {/each}
</div>
