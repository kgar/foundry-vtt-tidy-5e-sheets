<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, ItemLayoutMode } from 'src/types/types';
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
  import UtilityBarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import UtilityItemFiltersV2 from 'src/components/utility-bar/UtilityItemFiltersV2.svelte';
  import type { UtilityToolbarCommandParams } from 'src/components/utility-bar/types';
  import { ExpandAllCollapseAllService } from 'src/features/expand-collapse/ExpandAllCollapseAllService';

  let context = getContext<Readable<CharacterSheetContext>>('context');

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
      (count: number, section: any) => count + section.spells.length,
      0,
    ) === 0;

  const expandAllCollapseAllService = ExpandAllCollapseAllService.initService();
  let utilityBarCommands: UtilityToolbarCommandParams[] = [];
  $: utilityBarCommands = [
    {
      title: localize('TIDY5E.Commands.ExpandAll'),
      iconClass: 'fas fa-angles-down',
      execute: () => expandAllCollapseAllService.expandAll(),
    },
    {
      title: localize('TIDY5E.Commands.CollapseAll'),
      iconClass: 'fas fa-angles-up',
      execute: () => expandAllCollapseAllService.collapseAll(),
    },
    {
      title: localize('TIDY5E.ListLayout'),
      iconClass: 'fas fa-th-list toggle-list',
      visible: layoutMode === 'grid',
      execute: () => toggleLayout(),
    },
    {
      title: localize('TIDY5E.GridLayout'),
      iconClass: 'fas fa-th-large toggle-grid',
      visible: layoutMode === 'list',
      execute: () => toggleLayout(),
    },
  ];
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  {#if $settingStore.useMulticlassSpellbookFilter}
    <div class="spellbook-class-filter">
      <SpellbookClassFilter />
    </div>
  {/if}
  <UtilityItemFiltersV2 filterGroupName={CONSTANTS.TAB_CHARACTER_SPELLBOOK} />
  {#each utilityBarCommands as command (command.title)}
    <UtilityBarCommand
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
      {@const filteredSpells = tryFilterByClass(
        FoundryAdapter.getFilteredItems(searchCriteria, section.spells),
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || filteredSpells.length > 0}
        {#if layoutMode === 'list'}
          <SpellbookList spells={filteredSpells} {section} />
        {:else}
          <SpellbookGrid spells={filteredSpells} {section} />
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
