<script lang="ts">
  import { isItemFavorite } from 'src/favorites/favorites';
  import type { ActorSheetContext } from 'src/types/types';
  import InventoryList from '../inventory/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from '../favorites/FavoriteFeaturesList.svelte';
  import type { Item5e } from 'src/types/item';
  import FavoriteSpellsList from 'src/components/favorites/FavoriteSpellsList.svelte';

  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;

  const favoriteInventory = context.inventory
    .flatMap((x: { items: Item5e[] }) => x.items)
    .filter(isItemFavorite);

  const favoriteFeatures = context.features
    .flatMap((x: { items: Item5e[] }) => x.items)
    .filter(isItemFavorite);

  function getFavoriteSpells(spells: Item5e[]): Item5e[] {
    return spells.filter(isItemFavorite);
  }
</script>

<div class="flexcol no-gap">
  {#if favoriteInventory.length}
    <InventoryList
      {context}
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
