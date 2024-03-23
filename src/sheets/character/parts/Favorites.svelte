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
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function sortByNameIfConfigured(
    sortAlphabetically: boolean,
    items: Item5e[],
  ): Item5e[] {
    return sortAlphabetically
      ? items.sort((a, b) => a.name.localeCompare(b.name))
      : items;
  }
</script>

<div class="flex-column small-gap">
  <!--  TODO: Sort favorites based on setting during data item preparation -->
  {#each $context.favorites as section}
    {#if section.type === CONSTANTS.TAB_CHARACTER_INVENTORY}
      {@const items = sortByNameIfConfigured(
        $settingStore.sortFavoriteItemsAlphabetically,
        section.items,
      )}
      <InventoryList
        {section}
        {items}
        primaryColumnName="{localize(section.label)} ({items.length})"
        lockControls={true}
        allowFavoriteIconNextToName={false}
        includeWeightColumn={false}
      />
    {/if}
    {#if section.type === CONSTANTS.TAB_CHARACTER_FEATURES}
      {@const items = sortByNameIfConfigured(
        $settingStore.sortFavoriteItemsAlphabetically,
        section.items,
      )}
      <FavoriteFeaturesList sectionTitle={section.label} {items} />
    {/if}
    {#if section.type === CONSTANTS.TAB_CHARACTER_SPELLBOOK}
      {@const spells = sortByNameIfConfigured(
        $settingStore.sortFavoriteItemsAlphabetically,
        section.spells,
      )}
      <FavoriteSpellsList {section} {spells} />
    {/if}
  {/each}
</div>
