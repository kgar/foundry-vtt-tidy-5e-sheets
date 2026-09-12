<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import FeatureTables from '../../shared/FeatureTables.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { SectionVisibility } from 'src/features/sections/SectionVisibility';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { TidyFlags } from 'src/foundry/TidyFlags';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let features = $derived(
    SheetSections.configureFeatures(
      context.features,
      context,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  $effect(() => {
    SectionVisibility.syncItemTabSearchResults(searchResults, searchCriteria, {
      itemContext: context.itemContext,
      sections: features,
      tabId: tabId,
    });
  });
  
  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
    });
  }
</script>

<ItemsActionBar bind:searchCriteria sections={features} {tabId} />

<div class="tab-content">
  <SheetPins />

  <FeatureTables
    sections={features}
    {inlineToggleService}
    itemContext={context.itemContext}
    {searchCriteria}
    sheetDocument={context.actor}
  />

  <!-- should we use `<footer>`? We'd need to ensure an appropriate ancestor `<section>` -->
  <div class="sheet-footer flexrow sticky-footer">
    {#if context.editable}
      <div class="footer-content-right flexrow flexshrink">
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          role="button"
          tabindex="0"
          aria-label={localize('DND5E.ItemCreate')}
          data-tooltip="DND5E.ItemCreate"
          class="button button-icon-only button-primary item-create flexshrink"
          onclick={onAddClicked}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onAddClicked();
            }
          }}
        >
          <i class="fas fa-plus"></i>
        </a>
      </div>
    {/if}
  </div>
</div>

