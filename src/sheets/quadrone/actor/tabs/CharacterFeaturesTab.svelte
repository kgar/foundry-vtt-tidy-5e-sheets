<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import FeatureTables from '../../shared/FeatureTables.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { buildCharacterFeaturesSettingsTab } from '../settings/CharacterFeaturesSettingsTab';
  import type { FeatureSection } from 'src/types/types';

  let context = $derived(getCharacterSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let settingsTab = $derived(buildCharacterFeaturesSettingsTab(context, tabId));
  let tabOptionGroups = $derived(settingsTab.optionsGroups ?? []);

  let features = $derived(settingsTab.sections as FeatureSection[]);

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
      sections: features,
      tabId: tabId,
    });
  });

  async function openTabSettings() {
    if (!context.editable) return;
    const { TidySheetSettingsQuadroneApplication } = await import('src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte');
    context.sheet._renderChild(
      new TidySheetSettingsQuadroneApplication({
        document: context.document,
        initialTabId: tabId,
        tabSettings: { [tabId]: settingsTab },
      }),
    );
  }
</script>

<ItemsActionBar
  bind:searchCriteria
  sections={features}
  {tabId}
  {tabOptionGroups}
  onConfigureClick={openTabSettings}
/>

<div class="tab-content">
  {#if showSheetPins}
    <SheetPins />
  {/if}

  <FeatureTables
    sections={features}
    {inlineToggleService}
    itemContext={context.itemContext}
    {searchCriteria}
    sheetDocument={context.actor}
  />
</div>