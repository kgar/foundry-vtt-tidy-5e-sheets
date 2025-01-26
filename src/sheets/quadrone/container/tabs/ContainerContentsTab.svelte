<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import ContainerContentsSections from 'src/sheets/quadrone/container/parts/ContainerContentsSections.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import ToggleButton from 'src/components/buttons/ToggleButton.svelte';
  import Search from '../../shared/Search.svelte';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyVisibilityObserver from 'src/components/utility/TidyVisibilityObserver.svelte';
  import { Container } from 'src/features/containers/Container';
  import ExpandCollapseButton from '../../shared/ExpandCollapseButton.svelte';

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

  const localize = FoundryAdapter.localize;

  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let menuOpen = $derived(false);

  let markerEl: HTMLElement | undefined = $state();
  let footerEl: HTMLElement | undefined = $state();
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

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <!-- TODO: Extract to component. -->
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

  <div class="button-group">
    <ToggleButton class="hide-under-450">Action</ToggleButton>
    <ToggleButton class="hide-under-550">Bonus Action</ToggleButton>
    <ToggleButton class="hide-under-600">Reaction</ToggleButton>
    <ToggleButton class="hide-under-400">Can Use</ToggleButton>
    <ToggleButton>Magical</ToggleButton>
  </div>

  <a class="button icon-button">
    <i class="fas fa-filter"></i>
  </a>

  <ButtonWithOptionPanel class="icon-button" anchor="right">
    <i class="fas fa-arrow-down-a-z fa-fw"></i>
    {#snippet options()}
      <label for="{context.document.id}-sort-option-alphabetical">
        <input
          type="radio"
          id="{context.document.id}-sort-option-alphabetical"
          checked={true}
        />
        {localize('TIDY5E.SortMenu.OptionAlphabetical')}
      </label>
      <label for="{context.document.id}-sort-option-manual">
        <input
          type="radio"
          id="{context.document.id}-sort-option-manual"
          checked={false}
        />
        {localize('TIDY5E.SortMenu.OptionManual')}
      </label>
      <label for="{context.document.id}-sort-option-equipped">
        <input
          type="radio"
          id="{context.document.id}-sort-option-equipped"
          checked={false}
        />
        {localize('TIDY5E.SortMenu.OptionEquipped')}
      </label>
    {/snippet}
  </ButtonWithOptionPanel>

  <a class="button icon-button" class:disabled={!context.editable}>
    <i class="fas fa-gear"></i>
  </a>
</section>

<!-- Tables -->
<!-- New Container Contents Sections > New Inline Container View (requires options for column specification, classic controls)  -->
<!-- Column specification needs to have options for spanning -->
<!-- These options should be conditional accepted here, since this will also be reused for actor inventories -->
<!-- ? DO we have to reuse the same components, or can we make curated versions for container and actor? -->
<div class="container-contents-wrapper">
  <ContainerContentsSections
    contents={context.containerContents.contents}
    container={context.item}
    editable={context.editable}
    itemContext={context.containerContents.itemContext}
    {inlineToggleService}
    lockItemQuantity={context.lockItemQuantity}
    sheetDocument={context.item}
    unlocked={context.unlocked}
  />
</div>

<hr class="golden-fade" />

<div bind:this={markerEl} class="contents-footer-scroll-marker"></div>
<footer bind:this={footerEl} class="contents-footer">
  <!-- Capacity Bar -->
  <CapacityBar container={context.item} capacity={context.capacity} />
  <a
    title={localize('DND5E.ItemCreate')}
    class="button icon-button attention item-create"
    class:disabled={!context.editable}
    onclick={() => Container.promptCreateInventoryItem(context.item)}
  >
    <i class="fas fa-plus"></i>
  </a>
</footer>
