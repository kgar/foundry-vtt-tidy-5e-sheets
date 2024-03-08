<script lang="ts">
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemLayoutMode, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from '../../actor/NoSpells.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import { CONSTANTS } from 'src/constants';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';

  let context = getContext<Readable<NpcSheetContext>>('context');

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  $: noSpellLevels = !$context.spellbook.length;

  $: utilityBarCommands =
    $context.utilities[CONSTANTS.TAB_NPC_SPELLBOOK]?.utilityToolbarCommands ??
    [];
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <FilterMenu tabId={CONSTANTS.TAB_NPC_SPELLBOOK} />
  {#each utilityBarCommands as command (command.title)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      on:execute={(ev) => command.execute?.(ev.detail)}
    />
  {/each}
</UtilityToolbar>

<div class="scroll-container flex-column small-gap">
  {#if noSpellLevels}
    <NoSpells editable={$context.unlocked} />
  {:else}
    {#each $context.spellbook as section (section.label)}
      {@const visibleItemIdSubset = FoundryAdapter.searchItems(
        searchCriteria,
        section.spells,
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || visibleItemIdSubset.size > 0}
        {#if layoutMode === 'list'}
          <SpellbookList
            allowFavorites={false}
            spells={section.spells}
            {section}
            {visibleItemIdSubset}
          />
        {:else}
          <SpellbookGrid
            spells={section.spells}
            {section}
            {visibleItemIdSubset}
          />
        {/if}
      {/if}
    {/each}
  {/if}
</div>
<SpellbookFooter />
