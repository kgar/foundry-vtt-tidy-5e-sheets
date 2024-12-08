<script lang="ts">
  import InventoryList from '../../actor/InventoryList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FavoriteFeaturesList from './FavoriteFeaturesList.svelte';
  import FavoriteSpellsList from 'src/sheets/classic/character/parts/FavoriteSpellsList.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import FavoriteEffectsList from './FavoriteEffectsList.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import FavoriteFacilitiesList from './FavoriteFacilitiesList.svelte';
  import FavoriteActivitiesList from './FavoriteActivitiesList.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    searchCriteria?: string;
  }

  let { searchCriteria = '' }: Props = $props();

  let context = $derived(getCharacterSheetContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let favorites = $derived(
    SheetSections.configureFavorites(
      context.favorites,
      context.actor,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    const sections = favorites.filter(
      (x) =>
        x.type !== CONSTANTS.FAVORITES_SECTION_TYPE_EFFECT &&
        x.type !== CONSTANTS.FAVORITES_SECTION_TYPE_ACTIVITY,
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
        <InventoryList
          {section}
          items={section.items}
          primaryColumnName={localize(section.label)}
          lockControls={true}
          allowFavoriteIconNextToName={false}
          includeWeightColumn={false}
        />
      {/if}
      <!-- TODO: Cut a copy of the Favorite Features component and custom tailor it for the generic section -->
      {#if section.type === CONSTANTS.FAVORITES_SECTION_TYPE_FEATURE || section.type === CONSTANTS.FAVORITES_SECTION_TYPE_GENERIC}
        <FavoriteFeaturesList {section} items={section.items} />
      {/if}
      {#if section.type === CONSTANTS.FAVORITES_SECTION_TYPE_SPELLBOOK}
        <FavoriteSpellsList {section} spells={section.spells} />
      {/if}
      {#if section.type === CONSTANTS.FAVORITES_SECTION_TYPE_EFFECT}
        {@const visibleEffectIdSubset = FoundryAdapter.searchEffects(
          searchCriteria,
          section.effects.map((e) => e.effect),
        )}
        <FavoriteEffectsList {section} {visibleEffectIdSubset} />
      {/if}
      {#if section.type === CONSTANTS.FAVORITES_SECTION_TYPE_FACILITY}
        <FavoriteFacilitiesList {section} items={section.items}
        ></FavoriteFacilitiesList>
      {/if}
      {#if section.type === CONSTANTS.FAVORITES_SECTION_TYPE_ACTIVITY}
        {@const visibleActivityUuidSubset = FoundryAdapter.searchActivities(
          searchCriteria,
          section.activities,
        )}
        <FavoriteActivitiesList {section} {visibleActivityUuidSubset}
        ></FavoriteActivitiesList>
      {/if}
    {/if}
  {/each}
</div>
