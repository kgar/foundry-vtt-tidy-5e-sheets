<script lang="ts">
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import BastionFacilitiesTable from '../group-parts/bastions/BastionFacilitiesTable.svelte';
  import BastionOrdersTable from '../group-parts/bastions/BastionOrdersTable.svelte';
  import GroupBastionsActionBar from '../../shared/GroupBastionsActionBar.svelte';
  import type {
    BastionOrderQuadroneContext,
    GroupMemberBastionQuadroneContext,
  } from 'src/types/types';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let tabId = CONSTANTS.TAB_GROUP_BASTIONS;

  let hasMembers = $derived(context.bastionsContext.members.length > 0);

  $effect(() => {
    searchResults.criteria = searchCriteria;
    searchResults.uuids = getBastionSearchUuids(
      searchCriteria,
      context.bastionsContext.members,
      context.bastionsContext.orders,
    );
  });

  function includesCriteria(
    value: string | null | undefined,
    criteria: string,
  ) {
    return !!value && value.toLowerCase().includes(criteria);
  }

  /** Match orders, facility names, crafted items, bastion names, and character names. */
  function getBastionSearchUuids(
    criteriaText: string,
    members: GroupMemberBastionQuadroneContext[],
    orders: BastionOrderQuadroneContext[],
  ) {
    const criteria = criteriaText.trim().toLowerCase();
    if (!criteria) {
      return undefined;
    }

    const uuids = new Set<string>();

    for (const order of orders) {
      if (
        includesCriteria(order.label, criteria) ||
        includesCriteria(order.facilityName, criteria) ||
        includesCriteria(order.craft?.name, criteria) ||
        includesCriteria(order.member.actor.name, criteria) ||
        includesCriteria(order.member.actor.system.bastion?.name, criteria)
      ) {
        uuids.add(order.facility.uuid);
        uuids.add(order.member.actor.uuid);
      }
    }

    for (const member of members) {
      const actor = member.member.actor;
      const bastionMatches =
        includesCriteria(member.name, criteria) ||
        includesCriteria(actor.name, criteria);

      const facilities = [
        ...member.facilities.special.builtFacilities,
        ...member.facilities.basic.builtFacilities,
      ];

      for (const chosen of facilities) {
        const facilityMatches =
          includesCriteria(chosen.name, criteria) ||
          includesCriteria(chosen.labels?.order, criteria) ||
          includesCriteria(chosen.craft?.name, criteria);

        if (bastionMatches || facilityMatches) {
          uuids.add(chosen.facility.uuid);
          uuids.add(actor.uuid);
        }
      }

      if (bastionMatches) {
        uuids.add(actor.uuid);
      }
    }

    return uuids;
  }
</script>

<div class="tab-right-column">
  <GroupBastionsActionBar bind:searchCriteria {tabId} />

  <div class="tab-content" {@attach observeResize(onResize)}>
    {#if hasMembers}
      <BastionOrdersTable {sectionsInlineWidth} />

      <BastionFacilitiesTable {sectionsInlineWidth} />
    {:else}
      <div class="empty-state-container empty-state-description">
        {localize('TIDY5E.Bastion.Group.EmptyStateHint')}
      </div>
    {/if}
  </div>
</div>
