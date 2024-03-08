<script lang="ts">
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from 'src/components/item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  $: section = $context.inventory.contents;

  const localize = FoundryAdapter.localize;
</script>

<Currency document={$context.item} />

<section class="inventory-list-section">
  <ItemTable location={section.label} toggleable={false}>
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          {localize(section.label)}
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
  </ItemTable>
</section>
