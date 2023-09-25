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
  import SpellbookClassFilter from '../spellbook/SpellbookClassFilter.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from 'src/sheets/actor/NoSpells.svelte';
  import Notice from '../shared/Notice.svelte';
  import { settingStore } from 'src/settings/settings';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

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

  $: selectedClassFilter =
    FoundryAdapter.tryGetFlag($store.actor, 'classFilter') ?? '';
  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit') === true;

  function tryFilterByClass(spells: any[]) {
    if (
      !$settingStore.spellClassFilterSelect ||
      selectedClassFilter === ''
    ) {
      return spells;
    }

    return spells.filter(
      (spell) =>
        FoundryAdapter.tryGetFlag(spell, 'parentClass') === selectedClassFilter
    );
  }

  $: noSpellLevels = !$store.spellbook.length;

  $: noSpells =
    $store.spellbook.reduce(
      (count: number, section: any) => count + section.spells.length,
      0
    ) === 0;
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={$store.actor}
    searchFlag="spell-search"
    cssClass="align-self-flex-end"
  />
  {#if $settingStore.spellClassFilterSelect}
    <li class="spellbook-class-filter">
      <SpellbookClassFilter />
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

<ListContainer cssClass="flex-column small-gap">
  {#if noSpellLevels}
    <NoSpells {allowEdit} />
  {:else}
    {#each $store.spellbook as section (section.label)}
      {@const filteredSpells = tryFilterByClass(
        FoundryAdapter.getFilteredItems(searchCriteria, section.spells)
      )}
      {#if (searchCriteria.trim() === '' && allowEdit) || filteredSpells.length > 0}
        {#if layoutMode === 'list'}
          <SpellbookList
            spells={filteredSpells}
            {section}
            classicControlsEnabled={$settingStore.classicControlsEnabled}
          />
        {:else}
          <SpellbookGrid spells={filteredSpells} {section} />
        {/if}
      {/if}
    {/each}
  {/if}

  {#if noSpells && !allowEdit}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {/if}
</ListContainer>

<SpellbookFooter />

<style lang="scss">
  .spellbook-class-filter {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    align-self: center;
  }
</style>
