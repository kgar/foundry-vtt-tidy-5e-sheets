<script lang="ts">
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import FeatureTables from '../../shared/FeatureTables.svelte';
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
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';

  let context = $derived(getNpcSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let tabOptionGroups: SectionOptionGroup[] = $derived([
    {
      title: 'TIDY5E.DisplayOptions.Title',
      settings: [
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

  let features = $derived(
    SheetSections.configureFeatures(
      context.features,
      context,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: features,
      tabId: tabId,
    });
  });
</script>

<ActionBar bind:searchCriteria sections={features} {tabId} {tabOptionGroups} />

<FeatureTables
  sections={features}
  {inlineToggleService}
  itemContext={context.itemContext}
  {searchCriteria}
  sheetDocument={context.actor}
/>
