<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetClassicContext,
    Item5e,
  } from 'src/types/item.types';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import CapacityBar from 'src/sheets/classic/container/CapacityBar.svelte';
  import Currency from 'src/sheets/classic/actor/Currency.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import ContainerContentsSections from 'src/sheets/classic/container/ContainerContentsSections.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';

  let context = getContext<Readable<ContainerSheetClassicContext>>(
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

<!-- New Utility Toolbar -->

<!-- Tables -->
<!-- New Container Contents Sections > New Inline Container View (requires options for column specification, classic controls)  -->
<!-- Column specification needs to have options for spanning -->
<!-- These options should be conditional accepted here, since this will also be reused for actor inventories -->
<!-- ? DO we have to reuse the same components, or can we make curated versions for container and actor? -->

<!-- Capacity Bar -->

<!-- Currency, with Item Add Button -->
