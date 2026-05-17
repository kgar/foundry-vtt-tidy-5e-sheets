<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
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
  import { Container } from 'src/features/containers/Container';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import { TidySheetSettingsQuadroneApplication } from 'src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte';
  import {
    buildContainerContentsSections,
    buildContainerContentsSettingsTab,
  } from './ContainerContentsTab.pane';

  const localize = FoundryAdapter.localize;

  let context = $derived(getContainerSheetQuadroneContext());
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let settingsTab = $derived(buildContainerContentsSettingsTab(context, tabId));
  let tabOptionGroups = $derived(settingsTab.optionsGroups ?? []);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  let configuredContents = $derived(
    buildContainerContentsSections(context, tabId),
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: configuredContents,
      tabId: tabId,
    });
  });

  let footerEl: HTMLElement | undefined = $state();

  function openTabSettings() {
    context.editable &&
    context.sheet._renderChild(
      new TidySheetSettingsQuadroneApplication({
        document: context.document,
        initialTabId: tabId,
        tabSettings: { [tabId]: settingsTab },
      }),
    )
  }
</script>

<ItemsActionBar
  bind:searchCriteria
  sections={configuredContents}
  {tabId}
  {tabOptionGroups}
  onConfigureClick={openTabSettings}
/>


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

<footer bind:this={footerEl} class="contents-footer">
  <!-- Capacity Bar -->
  <CapacityBar container={context.item} capacity={context.capacity} />
  <!-- svelte-ignore a11y_missing_attribute -->
  <a
    aria-label={localize('DND5E.ItemCreate')}
    role="button"
    tabindex="0"
    data-tooltip="DND5E.ItemCreate"
    class="button button-icon-only button-primary item-create"
    class:disabled={!context.editable}
    onclick={() => Container.promptCreateInventoryItem(context.item)}
    onkeydown={(event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        Container.promptCreateInventoryItem(context.item);
      }
    }}
  >
    <i class="fas fa-plus"></i>
  </a>
</footer>
