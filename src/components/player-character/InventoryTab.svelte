<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import type { ItemLayoutMode, SheetFunctions } from 'src/types/types';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';
  import ListContainer from '../layout/ListContainer.svelte';
  import FilteredItems from '../items/FilteredItems.svelte';
  import InventoryList from '../inventory/InventoryList.svelte';
  import InventoryGrid from '../inventory/InventoryGrid.svelte';

  export let context: CharacterSheetContext;
  export let sheetFunctions: SheetFunctions;

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  const layoutMode: ItemLayoutMode = FoundryAdapter.tryGetFlag(
    context.actor,
    'inventory-grid'
  )
    ? 'grid'
    : 'list';
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag(context.actor, 'inventory-grid');
      return;
    }

    FoundryAdapter.setFlag(context.actor, 'inventory-grid', true);
  }
</script>

<ItemFilters>
  <ItemFilterSearch
    actor={context.actor}
    bind:searchCriteria
    searchFlag="item-search"
  />
  <ItemFilterOption filterName="action" setName="inventory" {sheetFunctions}>
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption filterName="bonus" setName="inventory" {sheetFunctions}>
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption filterName="reaction" setName="inventory" {sheetFunctions}>
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption filterName="equipped" setName="inventory" {sheetFunctions}>
    {localize('DND5E.Equipped')}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>

<ListContainer>
  {#each context.inventory as section}
    <FilteredItems {searchCriteria} items={section.items} let:filteredItems>
      {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
        {#if layoutMode === 'list'}
          <InventoryList items={filteredItems} {section} {context} />
        {:else}
          <InventoryGrid items={filteredItems} {section} {context} />
        {/if}
      {/if}
    </FilteredItems>
  {/each}
</ListContainer>

<!-- TODO: Footer here -->
