<script lang="ts">
  import { type SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import type {
    DocumentSheetV2Context,
    TidySectionBase,
  } from 'src/types/types';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import ActionBar from './ActionBar.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';

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

  let context = $derived(getSheetContext<DocumentSheetV2Context>());

  let allTabOptionGroups = $derived<SectionOptionGroup[]>([
    ...tabOptionGroups,
    {
      title: 'TIDY5E.DisplayOptions.Title',
      settings: [
        {
          type: 'boolean',
          checked: false,
          label: 'TIDY5E.DisplayOptions.ShowContainerRow.Label',
          prop: TidyFlags.showContainerPanel.prop,
        },
      ],
    },
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
  ]);
</script>

<ActionBar
  bind:searchCriteria
  {tabId}
  {sections}
  tabOptionGroups={allTabOptionGroups}
/>
