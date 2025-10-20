<script lang="ts">
  import {
    ConfigureSectionsApplication,
    type SectionOptionGroup,
  } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    GroupSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import ExpandCollapseButton from './ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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

  let context = $derived(getSheetContext<GroupSheetQuadroneContext>());

  let tab = $derived(context.tabs.find((t) => t.id === tabId));

  let tabName = $derived(localize(tab?.title ?? ''));
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

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
