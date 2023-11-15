<script lang="ts">
  import ItemFilterLayoutToggle from 'src/components/item-list/ItemFilterLayoutToggle.svelte';
  import ItemFilterOption from 'src/components/item-list/ItemFilterOption.svelte';
  import ItemFilterSearch from 'src/components/item-list/ItemFilterSearch.svelte';
  import ItemFilters from 'src/components/item-list/ItemFilters.svelte';
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemLayoutMode, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from '../../actor/NoSpells.svelte';

  let context = getContext<Readable<NpcSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($context.actor, 'spellbook-grid');
      return;
    }

    FoundryAdapter.setFlag($context.actor, 'spellbook-grid', true);
  }

  $: noSpellLevels = !$context.spellbook.length;
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    cssClass="align-self-flex-end"
    placeholder={localize('T5EK.Search')}
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
    {#if $context.preparedSpells > 0}
      ({$context.preparedSpells})
    {/if}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>
<div class="scroll-container flex-column small-gap">
  {#if noSpellLevels}
    <NoSpells editable={$context.editable} />
  {:else}
    {#each $context.spellbook as section (section.label)}
      {@const filteredSpells = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.spells
      )}
      {#if (searchCriteria.trim() === '' && $context.editable) || filteredSpells.length > 0}
        {#if layoutMode === 'list'}
          <SpellbookList
            allowFavorites={false}
            spells={filteredSpells}
            {section}
          />
        {:else}
          <SpellbookGrid spells={filteredSpells} {section} />
        {/if}
      {/if}
    {/each}
  {/if}
</div>
<SpellbookFooter />
