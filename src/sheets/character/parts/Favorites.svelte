<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import InventoryList from '../../actor/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from './FavoriteFeaturesList.svelte';
  import FavoriteSpellsList from 'src/sheets/character/parts/FavoriteSpellsList.svelte';
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
    {#if section.show}
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
      <!-- TODO: Cut a copy of the Favorite Features component and custom tailor it for the generic section -->
      {#if section.type === CONSTANTS.TAB_CHARACTER_FEATURES || section.type === CONSTANTS.CHARACTER_FAVORITE_SECTION_GENERIC}
        {@const visibleItemIdSubset = FoundryAdapter.searchItems(
          searchCriteria,
          section.items,
        )}
        <FavoriteFeaturesList
          {section}
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
    {/if}
  {/each}
</div>
