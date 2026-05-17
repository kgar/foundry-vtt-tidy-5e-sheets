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
  import ActorSpellbookFooter from '../parts/ActorSpellbookFooter.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { buildActorSpellbookSettingsTab } from './ActorSpellbookTab.pane';
  import { TidySheetSettingsQuadroneApplication } from 'src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte';

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

  let settingsTab = $derived(buildActorSpellbookSettingsTab(context, tabId));
  let tabOptionGroups = $derived(settingsTab.optionsGroups ?? []);

  let showSheetPins = $derived(
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

  function openTabSettings() {
    context.editable &&
    context.sheet._renderChild(
      new TidySheetSettingsQuadroneApplication({
        document: context.document,
        initialTabId: tabId,
        tabSettings: { [tabId]: settingsTab },
      }),
    )
  }
</script>

<ItemsActionBar
  bind:searchCriteria
  sections={spellbook}
  {tabId}
  {tabOptionGroups}
  onConfigureClick={openTabSettings}
/>

<div class="tab-content">
  {#if showSheetPins}
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
</div>
