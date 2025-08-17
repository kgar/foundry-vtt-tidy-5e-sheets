<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/api';
  import ActionBar from '../../shared/ActionBar.svelte';
  import Legendaries from '../npc-parts/Legendaries.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import StatblockTables from '../../shared/StatblockTables.svelte';
  import type { FeatureSection, SpellbookSection } from 'src/types/types';
  import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
  import ActorTraitClasses from '../parts/ActorTraitClasses.svelte';
  import ActorTraitBackground from '../parts/ActorTraitBackground.svelte';
  import ActorTraitSpecies from '../parts/ActorTraitSpecies.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  const localize = FoundryAdapter.localize;

  let context = $derived(getNpcSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const legendariesProp = `${UserPreferencesService.getProp()}.${CONSTANTS.SHOW_LEGENDARIES_ON_NPC_STATBLOCK_PREFERENCE}`;

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let tabOptionGroups: SectionOptionGroup[] = $derived([
    {
      title: 'TIDY5E.DisplayOptions.Title',
      settings: [
        {
          type: 'boolean',
          label: 'TIDY5E.Utilities.ShowLegendaryTrackersOnNpcStatblock',
          doc: game.user,
          prop: legendariesProp,
          default: false,
        },
        {
          type: 'boolean',
          label: 'TIDY5E.Utilities.IncludeSpellbookInNpcStatblockTab',
          doc: context.actor,
          prop: TidyFlags.includeSpellbookInNpcStatblockTab.prop,
          default: false,
        },
      ],
    } satisfies SectionOptionGroup,
  ]);

  let sections = $derived.by(() => {
    let sectionsToConfigure: (FeatureSection | SpellbookSection)[] =
      TidyFlags.includeSpellbookInNpcStatblockTab.get(context.actor)
        ? [...context.features, ...context.spellbook]
        : context.features;

    return SheetSections.configureStatblock(
      sectionsToConfigure,
      context,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    );
  });

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: sections,
      tabId: tabId,
    });
  });
</script>

<ActionBar bind:searchCriteria {sections} {tabId} {tabOptionGroups} />

{#if context.showLegendariesOnStatblockTab && (context.showLegendaryActions || context.showLegendaryResistances || context.showLairTracker)}
  <div class="legendaries cards-container flexrow">
    <Legendaries />
  </div>
{/if}

<StatblockTables
  {sections}
  {inlineToggleService}
  itemContext={context.itemContext}
  {searchCriteria}
  sheetDocument={context.actor}
/>


<div class="tidy-table character-traits">
  <div class="tidy-table-header-row theme-dark">
    <h3>{localize('TIDY5E.CharacterTraits.Title')}</h3>
  </div>
  <div class="list traits">
    <ActorTraitClasses />

    <ActorTraitBackground />

    {#if context.unlocked}
      <ActorTraitSpecies includeCreatureTypeConfig />
    {/if}
  </div>
</div>
