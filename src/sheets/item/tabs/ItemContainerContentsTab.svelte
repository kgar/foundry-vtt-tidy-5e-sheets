<script lang="ts">
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import TidyTableV2 from 'src/components/item-list/v2/TidyTableV2.svelte';
  import TidyTableHeaderRowV2 from 'src/components/item-list/v2/TidyTableHeaderRowV2.svelte';
  import TidyTableHeaderCellV2 from 'src/components/item-list/v2/TidyTableHeaderCellV2.svelte';
  import TidyTableRowV2 from 'src/components/item-list/v2/TidyTableRowV2.svelte';
  import TidyTableCellV2 from 'src/components/item-list/v2/TidyTableCellV2.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import CapacityBar from 'src/sheets/container/CapacityBar.svelte';
  import Currency from 'src/sheets/actor/Currency.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  $: section = $context.inventory.contents;

  const localize = FoundryAdapter.localize;
</script>

<Currency document={$context.item} />

<section class="container-contents-list-section scroll-container">
  <TidyTableV2 location={section.label} toggleable={false}>
    <svelte:fragment slot="header">
      <TidyTableHeaderRowV2>
        <TidyTableHeaderCellV2 primary={true}>
          {localize(section.label)} ({section.items.length})
        </TidyTableHeaderCellV2>
      </TidyTableHeaderRowV2>
    </svelte:fragment>
    <svelte:fragment slot="body">
      {#each section.items as item (item.id)}
        {@const ctx = $context.itemContext[item.id]}
        <TidyTableRowV2>
          <TidyTableCellV2 class="flex-row extra-small-gap">
            <ItemUseButton disabled={!FoundryAdapter.canUseItem(item)} {item} />
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
          </TidyTableCellV2>
        </TidyTableRowV2>
      {/each}
    </svelte:fragment>
  </TidyTableV2>
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

<style lang="scss">
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
</style>
