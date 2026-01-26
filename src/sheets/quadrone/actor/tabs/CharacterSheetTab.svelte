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
  import type {
    RadioSetting,
    SectionOptionGroup,
  } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SpellTable from '../../shared/SpellTable.svelte';
  import FeatureTable from '../../shared/FeatureTable.svelte';
  import InventoryTable from '../../shared/InventoryTable.svelte';
  import ActionTable from '../../shared/ActionTable.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import { TidyFlags } from 'src/api';

  let context = $derived(getCharacterSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let sections = $derived(context.sheetTabSections);

  const organization = $derived(
    SettingsProvider.settings.characterSheetTabOrganization.get(),
  );

  let tabOptionGroups = $derived<SectionOptionGroup[]>([
    {
      title: 'TIDY5E.SectionOrganization',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: FoundryAdapter.localize('TIDY5E.GenericDefaultPrefix', {
                value: FoundryAdapter.localize(
                  SettingsProvider.settings.characterSheetTabOrganization
                    .options.choices[organization],
                ),
              }),
              value: null,
            },
            {
              label:
                SettingsProvider.settings.characterSheetTabOrganization.options
                  .choices.action,
              value: CONSTANTS.SECTION_ORGANIZATION_ACTION,
            },
            {
              label:
                SettingsProvider.settings.characterSheetTabOrganization.options
                  .choices.origin,
              value: CONSTANTS.SECTION_ORGANIZATION_ORIGIN,
            },
          ],
          prop: TidyFlags.characterSheetTabSectionOrganization.prop,
          doc: context.actor,
          default: null,
        } satisfies RadioSetting<string | null>,
      ],
    },
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
  ]);

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

  const localize = FoundryAdapter.localize;

  let hasAtLeastOneItem = $derived(
    sections.some((section) => section.items.length > 0),
  );

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });

  let itemToggleMap = $derived(inlineToggleService.map);
</script>

<ItemsActionBar bind:searchCriteria {sections} {tabId} {tabOptionGroups} />

{#if showSheetPins}
  <SheetPins />
{/if}

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if !hasAtLeastOneItem}
    <div class="empty-state-container empty-state-description">
      {localize('TIDY5E.SheetLock.Empty.Hint')}
    </div>
  {:else}
    {#each sections as section}
      {#if 'type' in section}
        {#if section.type === 'spellbook'}
          {@const hasViewableItems = ItemVisibility.hasViewableItems(
            section.items,
            searchResults.uuids,
          )}

          {#if section.show && hasViewableItems}
            {@const columns = new ColumnsLoadout(
              ItemColumnRuntime.getConfiguredColumnSpecifications({
                sheetType: context.document.type,
                tabId: tabId,
                sectionKey: section.key,
                rowActions: section.rowActions,
                section: section,
                sheetDocument: context.document,
              }),
            )}
            <SpellTable
              {section}
              sheetDocument={context.document}
              {sectionsInlineWidth}
              {itemToggleMap}
              {columns}
            />
          {/if}
        {:else if section.type === 'inventory'}
          {@const hasViewableItems = ItemVisibility.hasViewableItems(
            section.items,
            searchResults.uuids,
          )}
          {#if section.show && hasViewableItems}
            {@const columns = new ColumnsLoadout(
              ItemColumnRuntime.getConfiguredColumnSpecifications({
                sheetType: context.document.type,
                tabId: tabId,
                sectionKey: section.key,
                rowActions: section.rowActions,
                section: section,
                sheetDocument: context.document,
              }),
            )}
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
              {columns}
            />
          {/if}
        {:else if section.type === 'feature'}
          {@const hasViewableItems = ItemVisibility.hasViewableItems(
            section.items,
            searchResults.uuids,
          )}
          {#if section.show && hasViewableItems}
            {@const columns = new ColumnsLoadout(
              ItemColumnRuntime.getConfiguredColumnSpecifications({
                sheetType: context.document.type,
                tabId,
                sectionKey: section.key,
                rowActions: section.rowActions,
                section: section,
                sheetDocument: context.document,
              }),
            )}
            <FeatureTable
              {section}
              {itemToggleMap}
              {sectionsInlineWidth}
              sheetDocument={context.document}
              {columns}
            />
          {/if}
        {:else if section.type === 'custom'}
          {@const hasViewableItems = ItemVisibility.hasViewableItems(
            section.items,
            searchResults.uuids,
          )}
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
