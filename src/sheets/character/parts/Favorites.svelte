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

  export let searchCriteria: string = '';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="flex-column small-gap">
  <!--  TODO: Sort favorites based on setting during data item preparation -->
  {#each $context.favorites as section}
    {#if section.type === CONSTANTS.TAB_CHARACTER_INVENTORY}
      {@const visibleItemIdSubset = FoundryAdapter.searchItems(
        searchCriteria,
        section.items,
      )}
      <InventoryList
        {section}
        items={section.items}
        primaryColumnName={localize(section.label)}
        lockControls={true}
        allowFavoriteIconNextToName={false}
        includeWeightColumn={false}
        {visibleItemIdSubset}
      />
    {/if}
    {#if section.type === CONSTANTS.TAB_CHARACTER_FEATURES}
      {@const visibleItemIdSubset = FoundryAdapter.searchItems(
        searchCriteria,
        section.items,
      )}
      <FavoriteFeaturesList
        sectionTitle={section.label}
        items={section.items}
        {visibleItemIdSubset}
      />
    {/if}
    {#if section.type === CONSTANTS.TAB_CHARACTER_SPELLBOOK}
      {@const visibleItemIdSubset = FoundryAdapter.searchItems(
        searchCriteria,
        section.spells,
      )}
      <FavoriteSpellsList
        {section}
        spells={section.spells}
        {visibleItemIdSubset}
      />
    {/if}
  {/each}
</div>
