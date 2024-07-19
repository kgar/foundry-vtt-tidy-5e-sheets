<script lang="ts">
  import SpellbookFooter from 'src/components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from 'src/components/spellbook/SpellbookGrid.svelte';
  import SpellbookList from 'src/components/spellbook/SpellbookList.svelte';
  import type { ItemLayoutMode, NpcSheetContext } from 'src/types/types';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import NoSpells from '../../actor/NoSpells.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';

  let context = getContext<Readable<NpcSheetContext>>('context');
  let tabId = getContext<string>('tabId');

  let searchCriteria: string = '';

  $: spellbook = SheetSections.configureSpellbook(
    $context.actor,
    tabId,
    $context.spellbook,
  );

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext('itemIdsToShow', itemIdsToShow);

  $: {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: spellbook,
      tabId: tabId,
    });
  }

  let layoutMode: ItemLayoutMode;
  $: layoutMode = TidyFlags.spellbookGrid.get($context.actor) ? 'grid' : 'list';

  $: noSpellLevels = !$context.spellbook.length;

  $: utilityBarCommands =
    $context.utilities[tabId]?.utilityToolbarCommands ?? [];
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      $context.filterPins,
      $context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId} />
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
    {#each spellbook as section (section.key)}
      {#if section.show}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.spells,
          $itemIdsToShow,
        )}
        {#if (searchCriteria.trim() === '' && $context.unlocked) || visibleItemCount > 0 || !!section.slots}
          {#if layoutMode === 'list'}
            <SpellbookList
              allowFavorites={false}
              spells={section.spells}
              {section}
            />
          {:else}
            <SpellbookGrid spells={section.spells} {section} />
          {/if}
        {/if}
      {/if}
    {/each}
  {/if}
</div>
<SpellbookFooter />
