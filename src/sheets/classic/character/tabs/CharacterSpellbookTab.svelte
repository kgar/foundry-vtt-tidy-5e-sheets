<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    CharacterSheetContext,
    ItemLayoutMode,
    SpellbookSection,
  } from 'src/types/types';
  import SpellbookList from '../../../../components/spellbook/SpellbookList.svelte';
  import SpellbookFooter from '../../../../components/spellbook/SpellbookFooter.svelte';
  import SpellbookGrid from '../../../../components/spellbook/SpellbookGrid.svelte';
  import SpellbookClassFilter from '../../../../components/spellbook/SpellbookClassFilter.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';
  import NoSpells from 'src/sheets/classic/actor/NoSpells.svelte';
  import Notice from '../../../../components/notice/Notice.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import SpellSourceClassAssignmentsFormApplication from 'src/applications/spell-source-class-assignments/SpellSourceClassAssignmentsFormApplication';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  // kgar-migration-task - swap to a state or derived rune | consider using a service of some kind
  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = $state('');

  let layoutMode: ItemLayoutMode = $derived(
    TidyFlags.spellbookGrid.get($context.actor) ? 'grid' : 'list',
  );

  function tryFilterByClass(spells: any[]) {
    if (
      !$settingStore.useMulticlassSpellbookFilter ||
      selectedClassFilter === ''
    ) {
      return spells;
    }

    return spells.filter(
      (spell) =>
        spell.system.sourceClass?.trim() === selectedClassFilter?.trim(),
    );
  }

  let spellbook = $derived(
    SheetSections.configureSpellbook($context.actor, tabId, $context.spellbook),
  );

  $effect(() => {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: spellbook,
      tabId: tabId,
    });
  });

  let selectedClassFilter = $derived(
    TidyFlags.classFilter.get($context.actor) ?? '',
  );
  let noSpellLevels = $derived(!$context.spellbook.length);
  let noSpells = $derived(
    spellbook.reduce(
      (count: number, section: SpellbookSection) =>
        count + section.spells.length,
      0,
    ) === 0,
  );
  let utilityBarCommands = $derived(
    $context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  {#if $settingStore.useMulticlassSpellbookFilter}
    <div class="spellbook-class-filter">
      <SpellbookClassFilter />
    </div>
  {/if}
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
<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noSpellLevels}
    <NoSpells editable={$context.unlocked} />
  {:else}
    {#each spellbook as section (section.key)}
      {#if section.show}
        {@const classSpells = tryFilterByClass(section.spells)}

        {@const visibleItemCount = ItemVisibility.countVisibleItems(
          section.spells,
          $itemIdsToShow,
        )}

        {#if (searchCriteria.trim() === '' && $context.unlocked) || visibleItemCount > 0 || !!section.slots}
          {#if layoutMode === 'list'}
            <SpellbookList spells={classSpells} {section} />
          {:else}
            <SpellbookGrid spells={classSpells} {section} />
          {/if}
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
