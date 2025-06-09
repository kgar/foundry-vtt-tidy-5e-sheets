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
  import ExpandCollapseButton from '../../shared/ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import FilterToggle from 'src/components/buttons/FilterToggle.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FilterMenuQuadrone from 'src/components/action-bar/FilterButtonMenuQuadrone.svelte';
  import SortButtonWithMenuQuadrone from 'src/components/action-bar/SortButtonWithMenuQuadrone.svelte';
  import CharacterSheetQuadroneRuntime from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
  import { isNil } from 'src/utils/data';

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

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let pinnedFilters = $derived(
    ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    ),
  );

  let tabName = $derived(
    context.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? CharacterSheetQuadroneRuntime.getTabTitle(tabId)
      : 'TODO',
  );
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

  <div class="button-group">
    {#each pinnedFilters as pinnedFilter (pinnedFilter.name)}
      <FilterToggle
        filter={pinnedFilter}
        filterGroupName={tabId}
        class={pinnedFilter.pinnedFilterClass}
        data-tooltip={pinnedFilter.text}
      >
        {#if !isNil(pinnedFilter.abbreviation, '')}
          {localize(pinnedFilter.abbreviation)}
        {:else}
          {localize(pinnedFilter.text)}
        {/if}
      </FilterToggle>
    {/each}
  </div>

  <FilterMenuQuadrone filterData={context.filterData} {tabId} />

  <SortButtonWithMenuQuadrone doc={context.actor} {tabId} />

  <a
    class="button button-icon-only"
    class:disabled={!context.editable}
    title={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
    onclick={() =>
      context.editable &&
      new ConfigureSectionsApplication({
        document: context.actor,
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
</section>
