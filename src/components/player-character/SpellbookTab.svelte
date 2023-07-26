<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ListContainer from '../layout/ListContainer.svelte';
  import type { ItemLayoutMode, SheetFunctions } from 'src/types/types';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import FilteredItems from '../items/FilteredItems.svelte';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';
  import SpellbookList from '../spellbook/SpellbookList.svelte';
  import SpellbookFooter from '../spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from '../spellbook/SpellbookGrid.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import SpellbookClassFilter from '../spellbook/SpellbookClassFilter.svelte';

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

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag(context.actor, 'spellbook-grid');
      return;
    }

    FoundryAdapter.setFlag(context.actor, 'spellbook-grid', true);
  }

  const filterByClassesEnabled =
    SettingsProvider.settings.spellClassFilterSelect.get();
  const selectedClassFilter =
    FoundryAdapter.tryGetFlag(context.actor, 'classFilter') ?? '';
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');

  function tryFilterByClass(spells: any[]) {
    if (!filterByClassesEnabled || selectedClassFilter === '') {
      return spells;
    }

    return spells.filter(
      (spell) =>
        FoundryAdapter.tryGetFlag(spell, 'parentClass') === selectedClassFilter
    );
  }
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={context.actor}
    searchFlag="spell-search"
    cssClass="align-self-flex-end"
  />
  {#if filterByClassesEnabled}
    <li class="spellbook-class-filter">
      <SpellbookClassFilter {context} />
    </li>
  {/if}
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
    {localize('DND5E.AbbreviationConc')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="ritual" {sheetFunctions}>
    {localize('DND5E.Ritual')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="prepared" {sheetFunctions}>
    {localize('DND5E.Prepared')}
    {#if context.preparedSpells > 0}
      ({context.preparedSpells})
    {/if}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>

<ListContainer>
  {#each context.spellbook as section (section.label)}
    <FilteredItems
      {searchCriteria}
      items={tryFilterByClass(section.spells)}
      let:filteredItems
    >
      {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
        {#if layoutMode === 'list'}
          <SpellbookList spells={filteredItems} {section} {context} />
        {:else}
          <SpellbookGrid spells={filteredItems} {section} {context} />
        {/if}
      {/if}
    </FilteredItems>
  {/each}
</ListContainer>

<SpellbookFooter {abilities} {context} />

<style lang="scss">
  .spellbook-class-filter {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
</style>
