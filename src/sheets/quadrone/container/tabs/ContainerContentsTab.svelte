<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import InventoryTables from 'src/sheets/quadrone/shared/InventoryTables.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyVisibilityObserver from 'src/components/utility/TidyVisibilityObserver.svelte';
  import { Container } from 'src/features/containers/Container';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { TidyFlags } from 'src/api';
  import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import ActionBar from '../../shared/ActionBar.svelte';

  let context = $derived(getContainerSheetQuadroneContext());
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: context.containerContents.contents,
      tabId: tabId,
    });
  });

  let markerEl: HTMLElement | undefined = $state();
  let footerEl: HTMLElement | undefined = $state();

  // TODO: Make this a callback to send through to the component for preparing sections properly
  let configuredContents = $derived(
    SheetSections.configureInventory(
      context.containerContents.contents,
      tabId,
      SheetPreferencesService.getByType(context.item.type),
      TidyFlags.sectionConfig.get(context.item)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
    ),
  );
</script>

{#if !!markerEl && !!footerEl}
  <TidyVisibilityObserver
    root={context.item.sheet.windowContent}
    trackWhenOffScreen={true}
    toObserve={[markerEl]}
    toAffect={[footerEl]}
    rootMargin="-12px"
  />
{/if}

<ActionBar bind:searchCriteria sections={configuredContents} {tabId} />

<!-- Tables -->
<InventoryTables
  sections={configuredContents}
  container={context.item}
  editable={context.editable}
  itemContext={context.containerContents.itemContext}
  {inlineToggleService}
  {searchCriteria}
  sheetDocument={context.item}
  root={true}
/>

<hr class="golden-fade" />

<div bind:this={markerEl} class="contents-footer-scroll-marker"></div>
<footer bind:this={footerEl} class="contents-footer">
  <!-- Capacity Bar -->
  <CapacityBar container={context.item} capacity={context.capacity} />
  <a
    data-tooltip="DND5E.ItemCreate"
    class="button button-icon-only button-primary item-create"
    class:disabled={!context.editable}
    onclick={() => Container.promptCreateInventoryItem(context.item)}
  >
    <i class="fas fa-plus"></i>
  </a>
</footer>
