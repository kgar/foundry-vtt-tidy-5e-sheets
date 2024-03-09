<script lang="ts">
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import CapacityBar from 'src/sheets/container/CapacityBar.svelte';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  let searchCriteria = '';

  $: section = $context.inventory.contents;

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
    section.items,
  );
</script>

<div class="container-contents-wrapper">
  <div role="presentation" class="currency-wrapper">
    <Currency document={$context.item} />
  </div>

  <UtilityToolbar>
    <Search bind:value={searchCriteria}></Search>
  </UtilityToolbar>

  <section
    class="container-contents-list-section scroll-container"
    style="--grid-template-columns: {gridTemplateColumns};"
  >
    <TidyTable location={section.label} toggleable={false}>
      <svelte:fragment slot="header">
        <TidyTableHeaderRow>
          <TidyTableHeaderCell primary={true}>
            {localize(section.label)} ({section.items.length})
          </TidyTableHeaderCell>
          <TidyTableHeaderCell>
            {localize('DND5E.Weight')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell>
            {localize('DND5E.QuantityAbbr')}
          </TidyTableHeaderCell>
          {#if useClassicControls}
            <TidyTableHeaderCell></TidyTableHeaderCell>
          {/if}
        </TidyTableHeaderRow>
      </svelte:fragment>
      <svelte:fragment slot="body">
        {#each section.items as item (item.id)}
          {@const ctx = $context.itemContext[item.id]}
          {@const weight = ctx?.totalWeight ?? item.system.weight}
          <TidyTableRow hidden={!visibleItemIdSubset.has(item.id)}>
            <TidyTableCell class="flex-row extra-small-gap">
              <ItemUseButton
                disabled={!FoundryAdapter.canUseItem(item)}
                {item}
              />
              <ItemName
                on:toggle={() => alert('Toggle summary!')}
                cssClass="extra-small-gap"
                {item}
              >
                <span
                  class="truncate"
                  data-tidy-item-name={item.name}
                  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                  >{item.name}</span
                >
              </ItemName>
            </TidyTableCell>
            <TidyTableCell
              title={localize('TIDY5E.Inventory.Weight.Text', {
                weight: weight,
                weightUnit: weightUnit,
              })}
            >
              <span class="truncate">
                {weight}
              </span>
            </TidyTableCell>
            <TidyTableCell>
              <!-- Qty -->
              <TextInput
                document={item}
                field="system.quantity"
                value={item.system.quantity}
                selectOnFocus={true}
                disabled={!$context.editable || $context.lockItemQuantity}
                placeholder="0"
                allowDeltaChanges={true}
              />
            </TidyTableCell>
            {#if useClassicControls}
              <TidyTableCell>
                {#each classicControls as control}
                  <svelte:component
                    this={control.component}
                    {...control.getProps(item)}
                  ></svelte:component>
                {/each}
              </TidyTableCell>
            {/if}
            <svelte:fragment slot="after-row"></svelte:fragment>
          </TidyTableRow>
        {/each}
      </svelte:fragment>
    </TidyTable>
    <!-- <ItemTable location={section.label} toggleable={false}>
      <svelte:fragment slot="header">
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)} ({section.items.length})
          </ItemTableColumn>
        </ItemTableHeaderRow>
      </svelte:fragment>
      <svelte:fragment slot="body">
        {#each section.items as item (item.id)}
          {@const ctx = $context.itemContext[item.id]}
          <ItemTableRow
            {item}
            on:mousedown={(event) =>
              FoundryAdapter.editOnMiddleClick(event.detail, item)}
            contextMenu={{
              type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
              id: item.id,
            }}
            let:toggleSummary
          >
            <ItemUseButton disabled={true} {item} />
            <ItemName
              on:toggle={() => toggleSummary($context.item)}
              cssClass="extra-small-gap"
              {item}
            >
              <span
                class="truncate"
                data-tidy-item-name={item.name}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                >{item.name}</span
              >
            </ItemName>
          </ItemTableRow>
        {/each}
      </svelte:fragment>
    </ItemTable> -->
  </section>
  <footer class="container-contents-footer">
    <CapacityBar />
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
  .container-contents-list-section {
    flex: 1;
    margin-right: -0.75rem;
  }

  .scroll-container {
    padding-bottom: 0;
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
