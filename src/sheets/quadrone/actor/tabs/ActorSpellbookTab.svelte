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
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import SpellTables from '../../shared/SpellTables.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import ActorSpellbookFooter from '../parts/ActorSpellbookFooter.svelte';
  import SpellSourceClassAssignmentsFormApplication from 'src/applications/spell-source-class-assignments/SpellSourceClassAssignmentsFormApplication.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

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
          prop: `flags.tidy5e-sheet.sheetPreferences.${context.actor.type}.spellSlotTrackerMode`,
          doc: game.user,
          default: CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
        },
      ],
    },
    {
      title: 'TIDY5E.Utilities.CastActivitySpellGroupingTitle',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label:
                'TIDY5E.Utilities.CastActivitySpellGroupingOptionAdditional',
              value: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL,
            },
            {
              label: 'TIDY5E.Utilities.CastActivitySpellGroupingOptionPerItem',
              value: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PER_ITEM,
            },
          ],
          prop: 'flags.tidy5e-sheet.userPreferences.castActivitySpellGrouping',
          doc: game.user,
          default: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL,
        },
      ],
    },
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
    {
      title: 'TIDY5E.Utilities.Tools',
      settings: [
        {
          type: 'button',
          icon: 'fa-solid fa-list-check',
          label: 'TIDY5E.Utilities.AssignSpellsToClasses',
          onclick: (ev, doc) =>
            new SpellSourceClassAssignmentsFormApplication({
              document: context.actor,
            }).render({ force: true }),
        },
      ],
    },
  ]);

  let showSheetPin = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      tabId,
      'showSheetPins',
    ) ?? true,
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: spellbook,
      tabId: tabId,
    });
  });
</script>

<ItemsActionBar bind:searchCriteria sections={spellbook} {tabId} {tabOptionGroups} />

{#if showSheetPin}
  <SheetPins />
{/if}

<SpellTables
  sections={spellbook}
  itemContext={context.itemContext}
  {inlineToggleService}
  sheetDocument={context.actor}
  {searchCriteria}
/>

<ActorSpellbookFooter {tabId} />
