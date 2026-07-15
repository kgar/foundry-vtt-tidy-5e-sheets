<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ItemsActionBar from '../../shared/ItemsActionBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SpellTable from '../../shared/SpellTable.svelte';
  import FeatureTable from '../../shared/FeatureTable.svelte';
  import InventoryTable from '../../shared/InventoryTable.svelte';
  import ActionTable from '../../shared/ActionTable.svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import { TidyFlags } from 'src/api';
  import { tick } from 'svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  let context = $derived(getCharacterSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let sections = $derived(context.sheetTabSections);

  let showSheetPins = $state(true);

  // Sync from persisted preference when context/tab changes; persist on toggle via onclick
  $effect(() => {
    showSheetPins =
      UserSheetPreferencesService.getDocumentTypeTabPreference(
        context.document.type,
        tabId,
        'showSheetPins',
      ) ?? true;
  });

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: sections,
      tabId: tabId,
    });
  });

  const localize = FoundryAdapter.localize;

  let hasAtLeastOneItem = $derived(
    sections.some((section) => section.items.length > 0),
  );

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let itemToggleMap = $derived(inlineToggleService.map);

  // Effective organization: per-actor override or global setting
  let effectiveOrganization = $derived(
    TidyFlags.characterSheetTabSectionOrganization.get(context.actor) ??
      SettingsProvider.settings.characterSheetTabOrganization.get(),
  );

  let tabContent: HTMLElement;

  // Toggle between origin and action organization, then scroll to top
  async function switchSectionOrganization() {
    const newValue =
      effectiveOrganization === CONSTANTS.SECTION_ORGANIZATION_ORIGIN
        ? CONSTANTS.SECTION_ORGANIZATION_ACTION
        : CONSTANTS.SECTION_ORGANIZATION_ORIGIN;
    await context.actor.update({
      [TidyFlags.characterSheetTabSectionOrganization.prop]: newValue,
    });
    await tick();
    tabContent?.scrollTo({ top: 0 });
  }

  let tab = $derived(context.tabs.find((t) => t.id === tabId));

  let tabName = $derived(localize(tab?.title ?? ''));

</script>

<ItemsActionBar bind:searchCriteria {sections} {tabId} />

<div class="tab-content" bind:this={tabContent}>
  {#if showSheetPins}
    <SheetPins />
  {/if}

  <div
    class="tidy-table-container"
    {@attach observeResize(onResize)}
    data-sort-key={TidyFlags.characterSheetTabSortOrder.prop}
  >
    {#if !hasAtLeastOneItem}
      <div class="empty-state-container empty-state-description">
        {@html localize('TIDY5E.SheetLock.Empty.Hint')}
      </div>
    {:else}
      {#each sections as section}
        {#if 'type' in section}
          {#if section.type === CONSTANTS.SECTION_TYPE_SPELLBOOK}
            {const hasViewableItems = $derived(ItemVisibility.hasViewableItems(
              section.items,
              searchResults.uuids,
            ))}

            {#if section.show && hasViewableItems}
              <SpellTable
                {section}
                sheetDocument={context.document}
                {sectionsInlineWidth}
                {itemToggleMap}
              />
            {/if}
          {:else if section.type === CONSTANTS.SECTION_TYPE_INVENTORY}
            {const hasViewableItems = $derived(ItemVisibility.hasViewableItems(
              section.items,
              searchResults.uuids,
            ))}
            {#if section.show && hasViewableItems}
              <InventoryTable
                containingDocument={context.document}
                editable={context.editable}
                {inlineToggleService}
                itemContext={context.itemContext}
                root={true}
                {searchCriteria}
                {section}
                {sectionsInlineWidth}
                sheetDocument={context.document}
                {tabId}
              />
            {/if}
          {:else if section.type === CONSTANTS.SECTION_TYPE_FEATURE}
            {const hasViewableItems = $derived(ItemVisibility.hasViewableItems(
              section.items,
              searchResults.uuids,
            ))}
            {#if section.show && hasViewableItems}
              <FeatureTable
                {section}
                {itemToggleMap}
                {sectionsInlineWidth}
                sheetDocument={context.document}
              />
            {/if}
          {:else if section.type === CONSTANTS.SECTION_TYPE_CUSTOM}
            {const hasViewableItems = $derived(ItemVisibility.hasViewableItems(
              section.items,
              searchResults.uuids,
            ))}
            {#if section.show && hasViewableItems}
              <ActionTable
                {inlineToggleService}
                itemContext={context.itemContext}
                {section}
                {sectionsInlineWidth}
                sheetDocument={context.document}
                {tabId}
              />
            {/if}
          {/if}
        {/if}
      {/each}
    {/if}
  </div>

  <div class="sheet-footer sheet-tab-footer flexrow">
    <div class="sheet-footer-left flexrow">
      {#if context.unlocked}
        <button
          type="button"
          class="button button-borderless button-small"
          onclick={() => switchSectionOrganization()}
        >
          <i class="fas fa-arrow-right-arrow-left"></i>
          {effectiveOrganization === CONSTANTS.SECTION_ORGANIZATION_ACTION
            ? localize(
                'TIDY5E.Settings.CharacterSheetTabSectionOrganization.option.action',
              )
            : localize(
                'TIDY5E.Settings.CharacterSheetTabSectionOrganization.option.origin',
              )}
        </button>
        <button
          type="button"
          class="button button-small button-borderless"
          onclick={async () => {
            showSheetPins = !showSheetPins;
            await UserSheetPreferencesService.setDocumentTypeTabPreference(
              context.document.type,
              tabId,
              'showSheetPins',
              showSheetPins,
            );
            await tick();
            tabContent?.scrollTo({ top: 0 });
          }}
        >
          <i class="fas fa-thumbtack"></i>
          {localize(
            showSheetPins
              ? 'TIDY5E.Utilities.HideSheetPins'
              : 'TIDY5E.Utilities.ShowSheetPins',
          )}
        </button>
      {/if}
    </div>
    <div class="sheet-footer-right footer-content-right flexshrink">
      <button 
        type="button" 
        aria-label="TIDY5E.SheetLock.Empty.Hint"
        class="button button-borderless button-icon-only" 
        data-tooltip="TIDY5E.SheetLock.Empty.Hint">
        <i class="fas fa-circle-question"></i>
      </button>
      {#if context.editable}
        <button
          type="button"
          aria-label={localize('TIDY5E.ConfigureTab.Title', {
            tabName: tabName,
          })}
          class="button button-borderless button-icon-only"
          data-action="configureTab"
          data-tab-id={tabId}
        >
          <i class="fas fa-gear"></i>
        </button>
      {/if}
    </div>
  </div>
</div>
