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
  import { SectionVisibility } from 'src/features/sections/SectionVisibility';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import CompendiumBrowseButton from 'src/components/buttons/CompendiumBrowseButton.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

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

  const localize = FoundryAdapter.localize;

  // Modules can register more item types for this tab; only say "Feature" when feats are all it holds.
  let itemTypes = $derived<string[]>(
    context.actor.sheet._addDocumentItemTypes(tabId),
  );

  let createLabel = $derived(
    itemTypes.length === 1 && itemTypes[0] === CONSTANTS.ITEM_TYPE_FEAT
      ? localize('DND5E.FeatureAdd')
      : localize('DND5E.ItemCreate'),
  );
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

  {#if context.editable}
    <div class="sheet-footer flexrow features-footer">
      <div class="footer-content-right flexrow">
        <CompendiumBrowseButton
          class="button-primary flexshrink"
          sheetDocument={context.actor}
          {tabId}
          iconOnly
        />
        <!-- svelte-ignore a11y_missing_attribute, a11y_click_events_have_key_events -->
        <a
          aria-label={createLabel}
          role="button"
          tabindex="0"
          data-tooltip={createLabel}
          class="button button-icon-only button-primary item-create flexshrink"
          onclick={() => context.actor.sheet._addDocument({ tabId })}
          {@attach InputAttachments.triggerClickOnKeydown}
        >
          <i class="fas fa-plus"></i>
        </a>
      </div>
    </div>
  {/if}
</div>
