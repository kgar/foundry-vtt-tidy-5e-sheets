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
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SpellTable from '../../shared/SpellTable.svelte';
  import FeatureTable from '../../shared/FeatureTable.svelte';
  import InventoryTable from '../../shared/InventoryTable.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let sections = $derived(
    // SheetSections.configureActionsQuadrone(
    //   context.actions,
    //   tabId,
    //   UserSheetPreferencesService.getByType(context.actor.type),
    //   TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    // ),
    context.sheetTabSections, // TODO: Apply section preparation.
  );

  let tabOptionGroups = $derived<SectionOptionGroup[]>([
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
  ]);

  let showSheetPins = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      tabId,
      'showSheetPins',
    ) ?? true,
  );

  //   $effect(() => {
  //     searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
  //       criteria: searchCriteria,
  //       itemContext: context.itemContext,
  //       sections: sections,
  //       tabId: tabId,
  //     });
  //   });

  const localize = FoundryAdapter.localize;

  let totalActionCount = $derived(
    // sections.reduce((count, s) => count + s.items.length, 0),
    1, // TODO: fixme
  );

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });

  let itemToggleMap = $derived(inlineToggleService.map);
</script>

<ItemsActionBar bind:searchCriteria {sections} {tabId} {tabOptionGroups} />

{#if showSheetPins}
  <SheetPins />
{/if}

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if totalActionCount === 0}
    <div class="empty-state-container empty-state-description">
      {localize('TIDY5E.SheetLock.Empty.Hint')}
    </div>
  {:else}
    {#each sections as section}
      {#if 'type' in section}
        {#if section.type === 'spellbook'}
          <SpellTable
            {section}
            sheetDocument={context.document}
            {sectionsInlineWidth}
            {itemToggleMap}
            tabId={CONSTANTS.TAB_ACTOR_ACTIONS}
          />
        {:else if section.type === 'inventory'}
          <InventoryTable
            containingDocument={context.document}
            editable={context.editable}
            {inlineToggleService}
            itemContext={context.itemContext}
            root={true}
            {searchCriteria}
            {section}
            {sectionsInlineWidth}
            sheetDocument={context.document}
            {tabId}
          />
        {:else if section.type === 'feature'}
          <FeatureTable
            {section}
            {itemToggleMap}
            {sectionsInlineWidth}
            sheetDocument={context.document}
          />
        {:else}
          TODO: get section for {section.type} (also get section for "custom")
        {/if}
      {/if}
    {/each}
  {/if}
</div>
