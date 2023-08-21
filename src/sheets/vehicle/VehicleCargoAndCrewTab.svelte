<script lang="ts">
  import ItemTable from 'src/components/items/ItemTable.svelte';
  import ItemTableColumn from 'src/components/items/ItemTableColumn.svelte';
  import ItemTableRow from 'src/components/items/ItemTableRow.svelte';
  import ItemTableHeaderRow from 'src/components/items/ItemTableHeaderRow.svelte';
  import ListContainer from 'src/components/layout/ListContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import ItemTableCell from 'src/components/items/ItemTableCell.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import ItemUseButton from 'src/components/items/ItemUseButton.svelte';
  import ItemName from 'src/components/items/ItemName.svelte';
  import ListItemQuantity from '../actor/ListItemQuantity.svelte';
  import ItemTableFooter from 'src/components/items/ItemTableFooter.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit') === true;

  const localize = FoundryAdapter.localize;

  async function onItemCreate(type: string) {
    const actor = $store.actor;
    if (type === 'crew' || type === 'passengers') {
      const cargo = foundry.utils.deepClone(actor.system.cargo[type]);
      cargo.push(FoundryAdapter.getNewCargo());
      return actor.update({ [`system.cargo.${type}`]: cargo });
    }
    return FoundryAdapter.createItem({ type }, actor);
  }
</script>

<ListContainer>
  {#each $store.cargo as section}
    {#if allowEdit || section.items.length}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)}
          </ItemTableColumn>
        </ItemTableHeaderRow>
        {#each section.items as item, index (item.id ?? index)}
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
            cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
          >
            <ItemTableCell primary={true}>
              {#if section.editableName}
                <TextInput document={item} field="name" selectOnFocus={true} />
              {:else}
                <ItemUseButton {item} />
                <ItemName
                  on:click={(event) =>
                    toggleSummary(event.detail, $store.actor)}
                  cssClass="extra-small-gap"
                >
                  <span class="truncate">{item.name}</span>
                  <ListItemQuantity {item} {ctx} />
                </ItemName>
              {/if}
            </ItemTableCell>
          </ItemTableRow>
        {/each}
        {#if $store.owner && allowEdit && section.dataset}
          <ItemTableFooter
            actor={$store.actor}
            dataset={section.dataset}
            create={() => onItemCreate(section.dataset.type)}
          />
        {/if}
      </ItemTable>
    {/if}
  {/each}
</ListContainer>
