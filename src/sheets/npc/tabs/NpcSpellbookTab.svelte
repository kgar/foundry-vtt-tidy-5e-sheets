<script lang="ts">
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ItemLayoutMode,
    MessageBus,
    NpcSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NoSpells from '../../actor/NoSpells.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityBarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import type { UtilityToolbarCommandParams } from 'src/components/utility-bar/types';
  import { CONSTANTS } from 'src/constants';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';

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

  const messageBus = getContext<MessageBus>('messageBus');

  let utilityBarCommands: UtilityToolbarCommandParams[] = [];
  $: utilityBarCommands = [
    {
      title: localize('TIDY5E.Commands.ExpandAll'),
      iconClass: 'fas fa-angles-down',
      execute: () =>
        messageBus.set({
          tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
          message: 'expand-all',
        }),
    },
    {
      title: localize('TIDY5E.Commands.CollapseAll'),
      iconClass: 'fas fa-angles-up',
      execute: () =>
        messageBus.set({
          tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
          message: 'collapse-all',
        }),
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
  <FilterMenu tabId={CONSTANTS.TAB_NPC_SPELLBOOK} />
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

<div class="scroll-container flex-column small-gap">
  {#if noSpellLevels}
    <NoSpells editable={$context.unlocked} />
  {:else}
    {#each $context.spellbook as section (section.label)}
      {@const filteredSpells = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.spells,
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || filteredSpells.length > 0}
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
