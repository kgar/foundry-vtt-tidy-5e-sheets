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
  import { isNil } from 'src/utils/data';
    import ToggleButton from 'src/components/buttons/ToggleButton.svelte';

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
  <button type="button">
    <i class="fas fa-angles-down fa-fw"></i>
  </button>

  <search>
    <i class="fas fa-magnifying-glass fa-fw"></i>
    <input type="text" placeholder={localize('TIDY5E.Search')} />
    {#if !isNil(searchCriteria, '')}
      <button type="button">
        <i class="fas fa-xmark fa-fw"></i>
      </button>
    {/if}
  </search>

  <!-- TODO: Wire up actual pinned filter toggles -->
  <!-- TODO: When wiring up pinned filter toggles, use an additive approach instead of hiding after-the-fact. When the window size changes, trigger a render, throttled. -->
  <div class="button-group">
    <ToggleButton class="hide-under-450">Action</ToggleButton>
    <ToggleButton class="hide-under-550">Bonus Action</ToggleButton>
    <ToggleButton class="hide-under-600">Reaction</ToggleButton>
    <ToggleButton class="hide-under-400">Can Use</ToggleButton>
    <ToggleButton>Magical</ToggleButton>
  </div>
</section>

<!-- Tables -->
<!-- New Container Contents Sections > New Inline Container View (requires options for column specification, classic controls)  -->
<!-- Column specification needs to have options for spanning -->
<!-- These options should be conditional accepted here, since this will also be reused for actor inventories -->
<!-- ? DO we have to reuse the same components, or can we make curated versions for container and actor? -->
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

<footer>
  <hr class="golden-fade" />

  <!-- Capacity Bar -->
  <CapacityBar container={$context.item} capacity={$context.capacity} />

  <!-- Currency, with Item Add Button -->
  <ContainerCurrency />
</footer>
