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
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={context.actor}
    searchFlag="spell-search"
  />
  {#if SettingsProvider.settings.spellClassFilterSelect.get()}
    <!-- TODO: Refer to impl code samples and set up a shared component for generating this info. -->
    <!-- Also, consider generating the list of classes, taking the author's original list and simply reading the actor class items to pull the appropriate filter values -->
    <!-- 
      Array.from(game.actors).reduce((map, actor) => {
          Object.values(actor.classes).forEach(c => map.set(encodeURIComponent(c.name.toLowerCase()), c.name));
          return map;
      }, new Map())      
     -->
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
    {localize('DND5E.Concentration')}
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
  {#each context.spellbook as section}
    <FilteredItems {searchCriteria} items={section.spells} let:filteredItems>
      {#if layoutMode === 'list'}
        <SpellbookList spells={filteredItems} {section} {context} />
      {:else}
        <SpellbookGrid spells={filteredItems} {section} {context} />
      {/if}
    </FilteredItems>
  {/each}
</ListContainer>

<SpellbookFooter {abilities} {context} />
