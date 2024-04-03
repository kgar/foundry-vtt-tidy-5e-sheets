<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    ItemLayoutMode,
    SpellbookSection,
  } from 'src/types/types';
  import SpellbookList from '../../../components/spellbook/SpellbookList.svelte';
  import SpellbookFooter from '../../../components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from '../../../components/spellbook/SpellbookGrid.svelte';
  import SpellbookClassFilter from '../../../components/spellbook/SpellbookClassFilter.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from 'src/sheets/actor/NoSpells.svelte';
  import Notice from '../../../components/notice/Notice.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'spellbook-grid')
    ? 'grid'
    : 'list';

  $: selectedClassFilter =
    FoundryAdapter.tryGetFlag($context.actor, 'classFilter') ?? '';

  function tryFilterByClass(spells: any[]) {
    if (
      !$settingStore.useMulticlassSpellbookFilter ||
      selectedClassFilter === ''
    ) {
      return spells;
    }

    return spells.filter(
      (spell) =>
        FoundryAdapter.tryGetFlag(spell, 'parentClass') === selectedClassFilter,
    );
  }

  $: noSpellLevels = !$context.spellbook.length;

  $: noSpells =
    $context.spellbook.reduce(
      (count: number, section: SpellbookSection) =>
        count + section.spells.length,
      0,
    ) === 0;

  $: utilityBarCommands =
    $context.utilities[CONSTANTS.TAB_CHARACTER_SPELLBOOK]
      ?.utilityToolbarCommands ?? [];
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  {#if $settingStore.useMulticlassSpellbookFilter}
    <div class="spellbook-class-filter">
      <SpellbookClassFilter />
    </div>
  {/if}
  <PinnedFilterToggles
    filterGroupName={CONSTANTS.TAB_NPC_SPELLBOOK}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      $context.filterPins,
      $context.filterData,
      CONSTANTS.TAB_CHARACTER_SPELLBOOK,
    )}
  />
  <FilterMenu tabId={CONSTANTS.TAB_CHARACTER_SPELLBOOK} />
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
<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noSpellLevels}
    <NoSpells editable={$context.unlocked} />
  {:else}
    {#each $context.spellbook as section (section.label)}
      {@const classSpells = tryFilterByClass(section.spells)}
      {@const visibleItemIdSubset = FoundryAdapter.searchItems(
        searchCriteria,
        classSpells,
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || visibleItemIdSubset.size > 0}
        {#if layoutMode === 'list'}
          <SpellbookList spells={classSpells} {section} {visibleItemIdSubset} />
        {:else}
          <SpellbookGrid spells={classSpells} {section} {visibleItemIdSubset} />
        {/if}
      {/if}
    {/each}
  {/if}

  {#if noSpells && !$context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {/if}
</div>

<SpellbookFooter />

<style lang="scss">
  .spellbook-class-filter {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    align-self: center;
  }
</style>
