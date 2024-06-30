<script lang="ts">
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import ItemTableRowV2 from 'src/components/item-list/v2/ItemTableRowV2.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerSheetContext, Item5e } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import CapacityBar from 'src/sheets/container/CapacityBar.svelte';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import InlineFavoriteIcon from 'src/components/item-list/InlineFavoriteIcon.svelte';
  import ContainerContentsList from '../parts/ContainerContentsList.svelte';
  import { InlineContainerService } from 'src/features/inline-container/InlineContainerService';

  let context = getContext<Readable<ContainerSheetContext>>('context');
  let inlineContainerService = getContext<InlineContainerService>(
    'inlineContainerService',
  );

  let searchCriteria = '';

  $: contents = $context.inventory.contents;

  const weightUnit = FoundryAdapter.getWeightUnit();
  const localize = FoundryAdapter.localize;

  const classicControls = [
    {
      component: ItemEditControl,
      getProps: (item: Item5e) => ({ item }),
    },
    {
      component: ItemDeleteControl,
      getProps: (item: Item5e) => ({
        item,
        deleteFn: () => item.deleteDialog(),
      }),
    },
  ];

  const classicControlWidthRems = 1.5;

  $: useClassicControls = FoundryAdapter.useClassicControls($context.item);

  $: classicControlsWidth = useClassicControls
    ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
    : '';

  $: gridTemplateColumns = `/* Name */ 1fr /* Weight */ 3rem /* Quantity */ 3rem ${classicControlsWidth}`;

  $: visibleItemIdSubset = FoundryAdapter.searchItems(
    searchCriteria,
    contents.items,
  );

  $: utilityBarCommands =
    $context.utilities[CONSTANTS.TAB_CONTAINER_CONTENTS]
      ?.utilityToolbarCommands ?? [];

  $: menuOpen = false;
</script>

<div class="container-contents-wrapper">
  <div role="presentation" class="currency-wrapper">
    <Currency document={$context.item} />
  </div>

  <UtilityToolbar>
    <Search bind:value={searchCriteria}></Search>
    <PinnedFilterToggles
      filterGroupName={CONSTANTS.TAB_CONTAINER_CONTENTS}
      filters={ItemFilterRuntime.getPinnedFiltersForTab(
        $context.filterPins,
        $context.filterData,
        CONSTANTS.TAB_CONTAINER_CONTENTS,
      )}
    />
    <FilterMenu tabId={CONSTANTS.TAB_CONTAINER_CONTENTS} />
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
        buttonClass="inline-icon-button {menuOpen ? 'menu-is-open' : ''}"
        position="bottom"
        anchor="right"
        title={localize('TIDY5E.Utilities.GMTools')}
        bind:open={menuOpen}
        menuElement="div"
      >
        <ButtonMenuCommand
          on:click={() => {
            FoundryAdapter.identifyAllItemsForContainer(
              $context.item,
              contents.items,
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
              contents.items,
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
    <!-- TODO: Rename this to be clearer; InventoryList only renders one table, for example. -->
    <ContainerContentsList
      editable={$context.editable}
      {inlineContainerService}
      inventory={$context.inventory.sections}
      item={$context.item}
      itemContext={$context.itemContext}
      lockItemQuantity={$context.lockItemQuantity}
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
