<script lang="ts">
  import { getContext } from 'svelte';
  import Traits from '../actor/Traits.svelte';
  import VehicleAttributes from './parts/VehicleAttributes.svelte';
  import type { Readable } from 'svelte/store';
  import type { VehicleSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTable from 'src/components/items/ItemTable.svelte';
  import ItemTableHeaderRow from 'src/components/items/ItemTableHeaderRow.svelte';
  import ItemTableColumn from 'src/components/items/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/items/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/items/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemName from 'src/components/items/ItemName.svelte';
  import ItemUseButton from 'src/components/items/ItemUseButton.svelte';
  import ListItemQuantity from '../actor/ListItemQuantity.svelte';
    import ItemTableFooter from 'src/components/items/ItemTableFooter.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit') === true;

  const localize = FoundryAdapter.localize;
</script>

<div class="attributes-tab-contents">
  <div class="side-panel">
    <VehicleAttributes />
    <Traits
      toggleable={true}
      useSenses={false}
      enableSpecialTraitsConfiguration={false}
    />
  </div>
  <div class="main-panel">
    {#each $store.features as section}
      {#if allowEdit || section.items.length}
        <ItemTable>
          <ItemTableHeaderRow>
            <ItemTableColumn primary={true}>
              {localize(section.label)}
            </ItemTableColumn>
          </ItemTableHeaderRow>
          {#each section.items as item}
            {@const ctx = $store.itemContext[item.id]}
            <ItemTableRow
              let:toggleSummary
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, item)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                id: item.id,
              }}
              {item}
            >
              <ItemTableCell primary={true}>
                <ItemUseButton {item} />
                <ItemName
                  on:click={(event) =>
                    toggleSummary(event.detail, $store.actor)}
                  cssClass="extra-small-gap"
                >
                  <span class="truncate">{item.name}</span>
                  <ListItemQuantity {item} {ctx} />
                </ItemName>
              </ItemTableCell>
            </ItemTableRow>
          {/each}
          {#if $store.owner && allowEdit && section.dataset}
            <ItemTableFooter actor={$store.actor} dataset={section.dataset} />
          {/if}
        </ItemTable>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .attributes-tab-contents {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 13.75rem;
  }

  .main-panel {
    flex: 1;
    // display: flex;
    // flex-direction: column;
    // gap: 0.5rem;
    // padding: 0;
    // height: auto;
    // overflow-x: auto;
  }
</style>
