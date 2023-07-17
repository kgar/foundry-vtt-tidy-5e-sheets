<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ListContainer from '../layout/ListContainer.svelte';
  import type { ItemLayoutMode, SheetFunctions } from 'src/types/types';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import FilteredItems from '../items/FilteredItems.svelte';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';
  import SpellbookList from '../spellbook/SpellbookList.svelte';
    import SpellbookFooter from '../spellbook/SpellbookFooter.svelte';

  export let context: any;
  export let sheetFunctions: SheetFunctions;

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  const abilities = Object.entries(context.abilities).map(
    (a: [string, { label: string }]) => ({
      abbr: a[0],
      ...a[1],
    })
  );

  const layoutMode: ItemLayoutMode = FoundryAdapter.tryGetFlag(
    context.actor,
    'spellbook-grid'
  )
    ? 'grid'
    : 'list';
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={context.actor}
    searchFlag="spell-search"
  />
  <ItemFilterOption setName="spellbook" filterName="action" {sheetFunctions}>
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="bonus" {sheetFunctions}>
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="reaction" {sheetFunctions}>
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption
    setName="spellbook"
    filterName="concentration"
    {sheetFunctions}
  >
    {localize('DND5E.Concentration')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="ritual" {sheetFunctions}>
    {localize('DND5E.Ritual')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="prepared" {sheetFunctions}>
    {localize('DND5E.Prepared')}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} />
</ItemFilters>

<ListContainer>
  {#each context.spellbook as section}
    <FilteredItems {searchCriteria} items={section.spells} let:filteredItems>
      {#if layoutMode === 'list'}
        <SpellbookList spells={filteredItems} {section} {context} />
      {:else}
        <em>To Do: wasp has plans for this grid 💪</em>
      {/if}
    </FilteredItems>
  {/each}
</ListContainer>

<SpellbookFooter {abilities} {context} />

