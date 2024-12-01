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
  import { CONSTANTS } from 'src/constants';
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import SpellSourceClassAssignmentsFormApplication from 'src/applications/spell-source-class-assignments/SpellSourceClassAssignmentsFormApplication';

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria: string = $state('');

  let spellbook = $derived(
    SheetSections.configureSpellbook($context.actor, tabId, $context.spellbook),
  );

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  $effect(() => {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: spellbook,
      tabId: tabId,
    });
  });

  let layoutMode: ItemLayoutMode = $derived(
    TidyFlags.spellbookGrid.get($context.actor) ? 'grid' : 'list',
  );

  let noSpellLevels = $derived(!$context.spellbook.length);

  let utilityBarCommands = $derived(
    $context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  const localize = FoundryAdapter.localize;
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
  <ButtonMenu
    iconClass="ra ra-fairy-wand"
    buttonStyle="transparent-inline-icon"
    position="bottom"
    anchor="right"
    title={localize('TIDY5E.Utilities.Tools')}
    menuElement="div"
  >
    <ButtonMenuCommand
      onMenuClick={() => {
        new SpellSourceClassAssignmentsFormApplication($context.actor).render(
          true,
        );
      }}
      iconClass="fas fa-list-check"
      disabled={!$context.editable}
    >
      {localize('TIDY5E.Utilities.AssignSpellsToClasses')}
    </ButtonMenuCommand>
  </ButtonMenu>
  {#each utilityBarCommands as command (command.title)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      onExecute={(ev) => command.execute?.(ev)}
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
