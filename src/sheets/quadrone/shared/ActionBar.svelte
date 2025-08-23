<script lang="ts">
  import {
    ConfigureSectionsApplication,
    type SectionOptionGroup,
  } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import ExpandCollapseButton from './ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import FilterToggle from 'src/components/buttons/FilterToggle.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FilterButtonMenuQuadrone from 'src/components/action-bar/FilterButtonMenuQuadrone.svelte';
  import SortButtonWithMenuQuadrone from 'src/components/action-bar/SortButtonWithMenuQuadrone.svelte';
  import type { ContainerSheetQuadroneContext } from 'src/types/item.types';

  interface Props {
    searchCriteria: string;
    tabId: string;
    sections: TidySectionBase[];
    tabOptionGroups?: SectionOptionGroup[];
  }

  let {
    searchCriteria = $bindable(),
    tabId,
    sections,
    tabOptionGroups = [],
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext | ContainerSheetQuadroneContext
      >(),
    );

  let tab = $derived(context.tabs.find((t) => t.id === tabId));

  let tabName = $derived(localize(tab?.title ?? ''));

  let pinnedFilters = $derived(
    ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    ),
  );
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

  {#if pinnedFilters.length}
    <div class="button-group">
      {#each pinnedFilters as pinnedFilter (pinnedFilter.name)}
        <FilterToggle
          filter={pinnedFilter}
          filterGroupName={tabId}
          class={pinnedFilter.pinnedFilterClass}
          data-tooltip={localize(pinnedFilter.text)}
          data-filter-text={localize(pinnedFilter.text)}
          data-filter-abbr={pinnedFilter.abbreviation
            ? localize(pinnedFilter.abbreviation)
            : ''}
        >
          {localize(pinnedFilter.text)}
        </FilterToggle>
      {/each}
    </div>
  {/if}

  {#if Object.keys(context.filterData).length}
    <FilterButtonMenuQuadrone filterData={context.filterData} {tabId} />
  {/if}

  <SortButtonWithMenuQuadrone doc={context.document} {tabId} />

  {#if context.editable}
    <a
      class="button button-icon-only"
      title={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
      onclick={() =>
        context.editable &&
        new ConfigureSectionsApplication({
          document: context.document,
          settings: {
            tabId,
            sections: sections,
            optionsGroups: tabOptionGroups,
            formTitle: localize('TIDY5E.ConfigureTab.Title', {
              tabName: tabName,
            }),
          },
          window: {
            title: localize('TIDY5E.ConfigureTab.Title', { tabName: tabName }),
          },
        }).render({ force: true })}
    >
      <i class="fas fa-gear"></i>
    </a>
  {/if}
</section>
