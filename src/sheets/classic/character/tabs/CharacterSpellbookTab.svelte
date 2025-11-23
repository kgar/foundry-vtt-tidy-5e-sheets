<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemLayoutMode, SpellbookSection } from 'src/types/types';
  import SpellbookList from '../../../../components/spellbook/SpellbookList.svelte';
  import SpellbookFooter from '../../../../components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from '../../../../components/spellbook/SpellbookGrid.svelte';
  import SpellbookClassFilter from '../../../../components/spellbook/SpellbookClassFilter.svelte';
  import { getContext } from 'svelte';
  import NoSpells from 'src/sheets/classic/actor/NoSpells.svelte';
  import Notice from '../../../../components/notice/Notice.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import SpellSourceClassAssignmentsFormApplication from 'src/applications/spell-source-class-assignments/SpellSourceClassAssignmentsFormApplication.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = $state('');

  let layoutMode: ItemLayoutMode = $derived(
    TidyFlags.spellbookGrid.get(context.actor) ? 'grid' : 'list',
  );

  let spellbook = $derived(
    SheetSections.configureSpellbook(
      context.actor,
      tabId,
      context.spellbook,
      context.actor.sheet.classSpellbookFilter ?? '',
    ),
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: spellbook,
      tabId: tabId,
    });
  });

  let noSpellLevels = $derived(!context.spellbook.length);
  let noSpells = $derived(
    spellbook.reduce(
      (count: number, section: SpellbookSection) =>
        count + section.items.length,
      0,
    ) === 0,
  );
  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let classCount = $derived(Object.keys(context.actor.classes ?? {}).length);
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  {#if classCount > 1}
    <div class="spellbook-class-filter">
      <SpellbookClassFilter />
    </div>
  {/if}
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId}>
    {#snippet beforeClearButton()}
      <div class="filter-option-group">
        <label class="filter-option flex-row no-gap align-items-center">
          <input
            type="checkbox"
            checked={TidyFlags.includeRitualsInCanCast.get(context.actor)}
            onchange={(ev) =>
              TidyFlags.includeRitualsInCanCast.set(
                context.actor,
                ev.currentTarget.checked,
              )}
          />
          <span
            >{localize(
              'TIDY5E.ItemFilters.Options.IncludeRitualsInCanCast',
            )}</span
          >
        </label>
      </div>
    {/snippet}
  </FilterMenu>
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
        new SpellSourceClassAssignmentsFormApplication({
          document: context.actor,
        }).render({ force: true });
      }}
      iconClass="fas fa-list-check"
      disabled={!context.editable}
    >
      {localize('TIDY5E.Utilities.AssignSpellsToClasses')}
    </ButtonMenuCommand>
  </ButtonMenu>
  {#each utilityBarCommands as command (command.id)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      onExecute={(ev) => command.execute?.(ev)}
      sections={spellbook}
    />
  {/each}
</UtilityToolbar>
<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noSpellLevels}
    <NoSpells editable={context.unlocked} />
  {:else}
    {#each spellbook as section (section.key)}
      {#if section.show}
        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.items,
          searchResults.uuids,
        )}

        {#if (searchCriteria.trim() === '' && context.unlocked) || visibleItemCount > 0 || !!section.slots}
          {#if layoutMode === 'list'}
            <SpellbookList {section} />
          {:else}
            <SpellbookGrid {section} />
          {/if}
        {/if}
      {/if}
    {/each}
  {/if}

  {#if noSpells && !context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {/if}
</div>

<SpellbookFooter />

<style lang="less">
  .spellbook-class-filter {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    align-self: center;
  }
</style>
