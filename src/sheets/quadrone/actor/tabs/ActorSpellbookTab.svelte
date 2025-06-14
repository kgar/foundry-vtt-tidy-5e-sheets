<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import ActionBar from '../../shared/ActionBar.svelte';
  import SpellTables from '../../shared/SpellTables.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let spellbook = $derived(
    SheetSections.configureSpellbook(context.actor, tabId, context.spellbook),
  );

  let tabOptionGroups: SectionOptionGroup[] = $derived([
    {
      title: 'TIDY5E.Utilities.SpellSlotTrackingModeTitle',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: 'TIDY5E.Utilities.SpellValueMax',
              value: CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
            },
            {
              label: 'TIDY5E.Utilities.SpellPips',
              value: CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
            },
          ],
          // TODO: make it so TidyFlags can provide this info.
          prop: 'flags.tidy5e-sheet.sheetPreferences.character.spellSlotTrackerMode',
          doc: game.user,
        },
      ],
    },
  ]);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: spellbook,
      tabId: tabId,
    });
  });
</script>

<ActionBar bind:searchCriteria sections={spellbook} {tabId} {tabOptionGroups} />

<SpellTables
  sections={spellbook}
  itemContext={context.itemContext}
  {inlineToggleService}
  sheetDocument={context.actor}
  {searchCriteria}
/>
