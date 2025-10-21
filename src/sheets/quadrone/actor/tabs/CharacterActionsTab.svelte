<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import ActionTables from '../../shared/ActionTables.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';

  let context = $derived(getCharacterSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let actions = $derived(
    SheetSections.configureActionsQuadrone(
      context.actions,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let tabOptionGroups = $derived<SectionOptionGroup[]>([
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
  ]);

  let showSheetPin = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      tabId,
      'showSheetPins',
    ) ?? true,
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: actions,
      tabId: tabId,
    });
  });
</script>

<ItemsActionBar bind:searchCriteria sections={actions} {tabId} {tabOptionGroups} />

{#if showSheetPin}
  <SheetPins />
{/if}

<ActionTables
  sections={actions}
  {inlineToggleService}
  itemContext={context.itemContext}
  {searchCriteria}
  sheetDocument={context.actor}
/>
