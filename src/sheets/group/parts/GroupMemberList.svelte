<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import GroupEncounterMemberListItem from './GroupEncounterMemberListItem.svelte';
  import GroupMemberListItem from './GroupMemberListItem.svelte';
  import { getContext } from 'svelte';
  import type {
    GroupMemberSection,
    GroupSheetClassicContext,
  } from 'src/types/group.types';
  import type { Readable } from 'svelte/store';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';

  export let section: GroupMemberSection;

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<TidyTable key={section.key} data-custom-section={section.custom ? true : null}>
  <svelte:fragment slot="header">
    <TidyTableHeaderRow>
      <TidyTableHeaderCell primary={true}>
        {localize(section.label)}
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#each section.members as member (member.actor.uuid)}
      {#if $context.actor.system.type.value === CONSTANTS.GROUP_TYPE_ENCOUNTER}
        <GroupEncounterMemberListItem />
      {:else}
        <GroupMemberListItem />
      {/if}
    {/each}
  </svelte:fragment>
</TidyTable>
