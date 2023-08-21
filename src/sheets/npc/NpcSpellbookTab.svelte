<script lang="ts">
  import ItemFilterLayoutToggle from 'src/components/items/ItemFilterLayoutToggle.svelte';
  import ItemFilterOption from 'src/components/items/ItemFilterOption.svelte';
  import ItemFilterSearch from 'src/components/items/ItemFilterSearch.svelte';
  import ItemFilters from 'src/components/items/ItemFilters.svelte';
  import ListContainer from 'src/components/layout/ListContainer.svelte';
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext, ItemLayoutMode } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from '../actor/NoSpells.svelte';

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

  $: allowEdit =
    FoundryAdapter.tryGetFlag<boolean>($store.actor, 'allow-edit') === true;

  $: noSpellLevels = !$store.spellbook.length;
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={$store.actor}
    searchFlag="spell-search"
    cssClass="align-self-flex-end"
  />
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
  {#if noSpellLevels}
    <NoSpells {allowEdit} />
  {:else}
    {#each $store.spellbook as section (section.label)}
      {@const filteredSpells = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.spells
      )}
      {#if (searchCriteria.trim() === '' && allowEdit) || filteredSpells.length > 0}
        {#if layoutMode === 'list'}
          <SpellbookList
            allowFavorites={false}
            spells={filteredSpells}
            {section}
            classicControlsEnabled={true}
          />
        {:else}
          <SpellbookGrid spells={filteredSpells} {section} />
        {/if}
      {/if}
    {/each}
  {/if}
</ListContainer>
<SpellbookFooter />
