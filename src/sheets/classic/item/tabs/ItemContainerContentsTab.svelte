<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import CapacityBar from 'src/sheets/classic/container/CapacityBar.svelte';
  import Currency from 'src/sheets/classic/actor/Currency.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import ContainerContentsSections from 'src/sheets/classic/container/ContainerContentsSections.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getContainerSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import { TidyFlags } from "src/foundry/TidyFlags";
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

  let context = $derived(getContainerSheetClassicContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  let allItems = $derived(
    context.containerContents.contents.flatMap((x) => x.items),
  );

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

  let menuOpen = $state(false);

  // TODO: Figure out how to avoid duplicating the recursive inline container section config :/
  let configuredContents = $derived(
    SheetSections.configureInventory(
      context.containerContents.contents.filter((i) => i.items.length),
      tabId,
      UserSheetPreferencesService.getByType(context.item.type),
      TidyFlags.sectionConfig.get(context.item)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
    ),
  );
</script>

<div class="container-contents-wrapper">
  <div role="presentation" class="currency-wrapper">
    <Currency document={context.item} />
  </div>

  <UtilityToolbar>
    <Search bind:value={searchCriteria}></Search>
    <PinnedFilterToggles
      filterGroupName={tabId}
      filters={ItemFilterRuntime.getPinnedFiltersForTab(
        context.filterPins,
        context.filterData,
        tabId,
      )}
    />
    <FilterMenu {tabId} />
    {#each utilityBarCommands as command (command.id)}
      <UtilityToolbarCommand
        title={command.title}
        iconClass={command.iconClass}
        text={command.text}
        visible={command.visible ?? true}
        onExecute={(ev) => command.execute?.(ev)}
        sections={configuredContents}
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
          onMenuClick={() => {
            FoundryAdapter.identifyAllItemsForContainer(context.item, allItems);
          }}
          iconClass="fas fa-magnifying-glass"
        >
          {localize('TIDY5E.Utilities.IdentifyAll')}
        </ButtonMenuCommand>
        <ButtonMenuCommand
          onMenuClick={() => {
            FoundryAdapter.markAllItemsAsUnidentifiedForContainer(
              context.item,
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
      contents={context.containerContents.contents}
      container={context.item}
      editable={context.editable}
      itemContext={context.containerContents.itemContext}
      {inlineToggleService}
      lockItemQuantity={context.lockItemQuantity}
      sheetDocument={context.item}
    />
  </div>
  <footer class="container-contents-footer">
    <CapacityBar container={context.item} capacity={context.capacity} />
  </footer>
</div>

<style lang="less">
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
