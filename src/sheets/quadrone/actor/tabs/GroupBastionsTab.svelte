<script lang="ts">
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import { createSearchResultsState } from 'src/features/search/search.svelte';
  import BastionFacilitiesTable from '../group-parts/bastions/BastionFacilitiesTable.svelte';
  import BastionOrdersTable from '../group-parts/bastions/BastionOrdersTable.svelte';
  import GroupBastionsActionBar from '../../shared/GroupBastionsActionBar.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let searchCriteria = $state('');
  let searchResults = createSearchResultsState();

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let hasMembers = $derived(context.bastionsContext.members.length > 0);
</script>

<div class="tab-right-column">
  <GroupBastionsActionBar bind:searchCriteria tabId={CONSTANTS.TAB_GROUP_BASTIONS} />

  <div class="tab-content" {@attach observeResize(onResize)}>
    {#if hasMembers}
      <!-- <BastionOrdersTable {sectionsInlineWidth} />

      <BastionFacilitiesTable {sectionsInlineWidth} /> -->
    {:else}
      <div class="empty-state-container empty-state-description">
        {localize('TIDY5E.Bastion.Group.EmptyStateHint')}
      </div>
    {/if}
  </div>
</div>
