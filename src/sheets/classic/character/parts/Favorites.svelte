<script lang="ts">
  import InventoryList from '../../actor/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from './FavoriteFeaturesList.svelte';
  import FavoriteSpellsList from 'src/sheets/classic/character/parts/FavoriteSpellsList.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import FavoriteEffectsList from './FavoriteEffectsList.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import FavoriteFacilitiesList from './FavoriteFacilitiesList.svelte';
  import FavoriteActivitiesList from './FavoriteActivitiesList.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { FavoriteSection } from 'src/types/types';

  interface Props {
    searchCriteria?: string;
    favorites: FavoriteSection[];
  }

  let { searchCriteria = '', favorites }: Props = $props();

  let context = $derived(getCharacterSheetContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    const sections = favorites.filter(
      (x) =>
        x.type !== CONSTANTS.SECTION_TYPE_EFFECT &&
        x.type !== CONSTANTS.SECTION_TYPE_ACTIVITY,
    );

    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: sections,
      tabId: tabId,
    });
  });

  const localize = FoundryAdapter.localize;
</script>

<div class="flex-column small-gap" data-tidy-favorites>
  <!--  TODO: Sort favorites based on setting during data item preparation -->
  {#each favorites as section}
    {#if section.show}
      {#if section.type === CONSTANTS.TAB_ACTOR_INVENTORY}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.items,
          searchResults.uuids,
        )}
        <InventoryList
          {section}
          lockControls={true}
          allowFavoriteIconNextToName={false}
          includeWeightColumn={false}
        >
          {#snippet primaryColumn()}
            {localize(section.label)}
            <span class="item-table-count">{visibleItemCount}</span>
          {/snippet}
        </InventoryList>
      {/if}
      <!-- TODO: Cut a copy of the Favorite Features component and custom tailor it for the generic section -->
      {#if section.type === CONSTANTS.SECTION_TYPE_FEATURE}
        <FavoriteFeaturesList {section} />
      {/if}
      {#if section.type === CONSTANTS.SECTION_TYPE_SPELLBOOK}
        <FavoriteSpellsList {section} />
      {/if}
      {#if section.type === CONSTANTS.SECTION_TYPE_EFFECT}
        {@const visibleEffectIdSubset = FoundryAdapter.searchEffects(
          searchCriteria,
          section.effects.map((e) => e.effect),
        )}
        <FavoriteEffectsList {section} {visibleEffectIdSubset} />
      {/if}
      {#if section.type === CONSTANTS.SECTION_TYPE_FACILITY}
        <FavoriteFacilitiesList {section} />
      {/if}
      {#if section.type === CONSTANTS.SECTION_TYPE_ACTIVITY}
        {@const visibleActivityUuidSubset = FoundryAdapter.searchActivities(
          searchCriteria,
          section.activities,
        )}
        <FavoriteActivitiesList {section} {visibleActivityUuidSubset} />
      {/if}
    {/if}
  {/each}
</div>
