<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import Legendaries from '../npc-parts/Legendaries.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import StatblockTables from '../../shared/StatblockTables.svelte';
  import ActorTraitClasses from '../parts/ActorTraitClasses.svelte';
  import ActorTraitBackground from '../parts/ActorTraitBackground.svelte';
  import NpcTraitSpecies from '../npc-parts/traits/NpcTraitSpecies.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { buildNpcStatblockSettingsTab } from '../settings/NpcStatblockSettingsTab';
  import type { FeatureSection, SpellbookSection } from 'src/types/types';

  const localize = FoundryAdapter.localize;

  let context = $derived(getNpcSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let settingsTab = $derived(buildNpcStatblockSettingsTab(context, tabId));
  let tabOptionGroups = $derived(settingsTab.optionsGroups ?? []);
  let sections = $derived(
    settingsTab.sections as (FeatureSection | SpellbookSection)[],
  );

  let hasAtLeastOneItem = $derived(
    sections.some((section) => section.items.length > 0),
  );

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
      sections: sections,
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
  {sections}
  {tabId}
  {tabOptionGroups}
  onConfigureClick={openTabSettings}
/>

<div class="tab-content">
  {#if context.showLegendariesOnStatblockTab && (context.showLegendaryActions || context.showLegendaryResistances || context.showLairTracker)}
    <div class="legendaries cards-container flexrow">
      <Legendaries />
    </div>
  {/if}

  {#if showSheetPins}
    <SheetPins />
  {/if}

  {#if !hasAtLeastOneItem}
  <div class="empty-state-container empty-state-description">
    {@html localize('TIDY5E.SheetLock.Empty.Hint')}
  </div>
  {/if}

  <StatblockTables
    {sections}
    {inlineToggleService}
    itemContext={context.itemContext}
    {searchCriteria}
    sheetDocument={context.actor}
  />

  {#if context.unlocked || context.background || context.species || context.classes.length > 0}
    <div class="tidy-table character-traits">
      <div class="tidy-table-header-row">
        <h3>{localize('TIDY5E.CharacterTraits.Title')}</h3>
      </div>
      <div class="list traits">
        <ActorTraitClasses />
        <ActorTraitBackground />
        <NpcTraitSpecies />
        <div class="list-entry">
          <div class="list-label">
            <h4 class="font-weight-label">
              {localize('DND5E.SpecialTraits')}
            </h4>
          </div>
          <div class="list-content">
            <div class="list-values trait-item">
              <button
                type="button"
                class="button button-secondary"
                aria-label={localize('DND5E.FlagsTitle')}
                data-tooltip
                onclick={() =>
                  context.sheet._renderChild(
                    new SpecialTraitsApplication({
                      document: context.actor,
                    }),
                  )}
              >
                <i class="fa-solid fa-star"></i>
                {localize('DND5E.FlagsTitle')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
