<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ListContainer from '../layout/ListContainer.svelte';
  import type { ActorSheetContext, ItemLayoutMode } from 'src/types/types';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';
  import SpellbookList from '../spellbook/SpellbookList.svelte';
  import SpellbookFooter from '../spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from '../spellbook/SpellbookGrid.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import SpellbookClassFilter from '../spellbook/SpellbookClassFilter.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  $: abilities = Object.entries($store.abilities).map(
    (a: [string, { label: string }]) => ({
      abbr: a[0],
      ...a[1],
    })
  );

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($store.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($store.actor, 'spellbook-grid');
      return;
    }

    FoundryAdapter.setFlag($store.actor, 'spellbook-grid', true);
  }

  const filterByClassesEnabled =
    SettingsProvider.settings.spellClassFilterSelect.get();
  $: selectedClassFilter =
    FoundryAdapter.tryGetFlag($store.actor, 'classFilter') ?? '';
  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');

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
    actor={$store.actor}
    searchFlag="spell-search"
    cssClass="align-self-flex-end"
  />
  {#if filterByClassesEnabled}
    <li class="spellbook-class-filter">
      <SpellbookClassFilter $store={$store} />
    </li>
  {/if}
  <ItemFilterOption setName="spellbook" filterName="action">
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="bonus">
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="reaction">
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="concentration">
    {localize('DND5E.AbbreviationConc')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="ritual">
    {localize('DND5E.Ritual')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="prepared">
    {localize('DND5E.Prepared')}
    {#if $store.preparedSpells > 0}
      ({$store.preparedSpells})
    {/if}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>

<ListContainer>
  {#each $store.spellbook as section (section.label)}
    {@const filteredSpells = tryFilterByClass(
      FoundryAdapter.getFilteredItems(searchCriteria, section.spells)
    )}
    {#if (searchCriteria.trim() === '' && allowEdit) || filteredSpells.length > 0}
      {#if layoutMode === 'list'}
        <SpellbookList spells={filteredSpells} {section} />
      {:else}
        <SpellbookGrid spells={filteredSpells} {section} />
      {/if}
    {/if}
  {/each}
</ListContainer>

<SpellbookFooter {abilities} />

<style lang="scss">
  .spellbook-class-filter {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
</style>
