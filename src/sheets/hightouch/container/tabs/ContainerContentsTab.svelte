<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerSheetHightouchContext } from 'src/types/item.types';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import CapacityBar from 'src/sheets/hightouch/container/parts/CapacityBar.svelte';
  import ContainerContentsSections from 'src/sheets/hightouch/container/parts/ContainerContentsSections.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import ContainerCurrency from '../parts/ContainerCurrency.svelte';
  import ToggleButton from 'src/components/buttons/ToggleButton.svelte';
  import Search from '../../shared/Search.svelte';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';

  let context = getContext<Readable<ContainerSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = '';

  $: allItems = $context.containerContents.contents.flatMap((x) => x.items);

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  $: {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: $context.containerContents.contents,
      tabId: tabId,
    });
  }

  const localize = FoundryAdapter.localize;

  $: utilityBarCommands =
    $context.utilities[tabId]?.utilityToolbarCommands ?? [];

  $: menuOpen = false;
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ButtonWithOptionPanel class="icon-button">
    <i class="fas fa-angles-down fa-fw"></i>
    <svelte:fragment slot="options">
      <h4>{localize('TIDY5E.ExpandCollapseMenu.OptionTitle')}</h4>
      <label
        for="{$context.document.id}-expand-collapse-behavior-top-level-sections"
      >
        <input type="radio" checked={true} />
        {localize('TIDY5E.ExpandCollapseMenu.OptionTopLevel')}
      </label>
      <label for="{$context.document.id}-expand-collapse-behavior-all-sections">
        <input
          type="radio"
          id="{$context.document.id}-expand-collapse-behavior-all-sections"
          checked={false}
        />
        {localize('TIDY5E.ExpandCollapseMenu.OptionAllSections')}
      </label>
    </svelte:fragment>
  </ButtonWithOptionPanel>

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
    <svelte:fragment slot="options">
      <label for="{$context.document.id}-sort-option-alphabetical">
        <input
          type="radio"
          id="{$context.document.id}-sort-option-alphabetical"
          checked={true}
        />
        {localize('TIDY5E.SortMenu.OptionAlphabetical')}
      </label>
      <label for="{$context.document.id}-sort-option-manual">
        <input
          type="radio"
          id="{$context.document.id}-sort-option-manual"
          checked={false}
        />
        {localize('TIDY5E.SortMenu.OptionManual')}
      </label>
      <label for="{$context.document.id}-sort-option-equipped">
        <input
          type="radio"
          id="{$context.document.id}-sort-option-equipped"
          checked={false}
        />
        {localize('TIDY5E.SortMenu.OptionEquipped')}
      </label>
    </svelte:fragment>
  </ButtonWithOptionPanel>

  <a class="button icon-button">
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
    contents={$context.containerContents.contents}
    container={$context.item}
    editable={$context.editable}
    itemContext={$context.containerContents.itemContext}
    {inlineToggleService}
    lockItemQuantity={$context.lockItemQuantity}
    sheetDocument={$context.item}
    unlocked={$context.unlocked}
  />
</div>

<footer class="contents-footer">
  <!-- Capacity Bar -->
  <CapacityBar container={$context.item} capacity={$context.capacity} />

  <hr class="golden-fade" />

  <!-- Currency, with Item Add Button -->
  <ContainerCurrency />
</footer>
