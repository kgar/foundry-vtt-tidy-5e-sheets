<script lang="ts">
  import { type SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import type { TidySectionBase } from 'src/types/types';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import ActionBar from './ActionBar.svelte';

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
  ]);
</script>

<ActionBar
  {searchCriteria}
  {tabId}
  {sections}
  tabOptionGroups={allTabOptionGroups}
/>
