<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import GroupMemberListItem from './GroupMemberListItem.svelte';
  import { getContext } from 'svelte';
  import type { GroupMemberSection } from 'src/types/group.types';
  import type { Readable } from 'svelte/store';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';

  export let section: GroupMemberSection;

  const memberActorIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.MEMBER_IDS_TO_SHOW,
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
    <div class="flex-column mt-2">
      {#each section.members as member, index (member.uuid)}
        {#if $memberActorIdsToShow === undefined || $memberActorIdsToShow.has(member.id)}
          <GroupMemberListItem {member} />

          {#if section.members.length > 1 && index !== section.members.length - 1}
            <HorizontalLineSeparator class="mx-3" borderColor="separator" />
          {/if}
        {/if}
      {/each}
    </div>
  </svelte:fragment>
</TidyTable>
