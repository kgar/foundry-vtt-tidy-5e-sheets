<script lang="ts">
  import { run } from 'svelte/legacy';

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

  let searchCriteria = $state('');

  let allItems = $derived(
    $context.containerContents.contents.flatMap((x) => x.items),
  );

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  run(() => {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: $context.containerContents.contents,
      tabId: tabId,
    });
  });

  const localize = FoundryAdapter.localize;

  let utilityBarCommands = $derived(
    $context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let menuOpen = $state(false);
</script>

<div class="container-contents-wrapper">
  <div role="presentation" class="currency-wrapper">
    <Currency document={$context.item} />
  </div>

  <UtilityToolbar>
    <Search bind:value={searchCriteria}></Search>
    <PinnedFilterToggles
      filterGroupName={tabId}
      filters={ItemFilterRuntime.getPinnedFiltersForTab(
        $context.filterPins,
        $context.filterData,
        tabId,
      )}
    />
    <FilterMenu {tabId} />
    {#each utilityBarCommands as command (command.title)}
      <UtilityToolbarCommand
        title={command.title}
        iconClass={command.iconClass}
        text={command.text}
        visible={command.visible ?? true}
        on:execute={(ev) => command.execute?.(ev.detail)}
      />
    {/each}

    {#if FoundryAdapter.userIsGm()}
      <ButtonMenu
        iconClass="ra ra-fairy-wand"
        buttonClass={menuOpen ? 'menu-is-open' : ''}
        position="bottom"
        anchor="right"
        title={localize('TIDY5E.Utilities.GMTools')}
        bind:open={menuOpen}
        menuElement="div"
        buttonStyle="transparent-inline-icon"
      >
        <!-- TODO: identify all items recursively -->
        <ButtonMenuCommand
          on:click={() => {
            FoundryAdapter.identifyAllItemsForContainer(
              $context.item,
              allItems,
            );
          }}
          iconClass="fas fa-magnifying-glass"
        >
          {localize('TIDY5E.Utilities.IdentifyAll')}
        </ButtonMenuCommand>
        <ButtonMenuCommand
          on:click={() => {
            FoundryAdapter.markAllItemsAsUnidentifiedForContainer(
              $context.item,
              allItems,
            );
          }}
          iconClass="fas fa-question"
        >
          {localize('TIDY5E.Utilities.MarkAllAsUnidentified')}
        </ButtonMenuCommand>
      </ButtonMenu>
    {/if}
  </UtilityToolbar>

  <div
    class="tidy-container-contents scroll-container flex-column small-gap"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
  >
    <ContainerContentsSections
      contents={$context.containerContents.contents}
      container={$context.item}
      editable={$context.editable}
      itemContext={$context.containerContents.itemContext}
      {inlineToggleService}
      lockItemQuantity={$context.lockItemQuantity}
      sheetDocument={$context.item}
    />
  </div>
  <footer class="container-contents-footer">
    <CapacityBar container={$context.item} capacity={$context.capacity} />
  </footer>
</div>

<style lang="scss">
  .container-contents-wrapper {
    height: 100%;
    padding-left: 1rem;
    padding-right: 0.25rem;
    display: flex;
    flex-direction: column;
    --utility-toolbar-margin-top: 0;
    --utility-toolbar-margin-right: -0.75rem;
    --utility-toolbar-padding-right: 1.25rem;
  }

  .scroll-container {
    padding-bottom: 0;
    padding-right: 0.75rem;
  }

  .container-contents-footer {
    padding: 0.25rem 0.75rem 0.25rem 0;
    display: flex;
    gap: 0.25rem;
    flex-direction: column;
  }

  .currency-wrapper {
    padding-right: 0.75rem;
    padding-top: 0.25rem;
    margin-block-end: 0.25rem;
  }
</style>
