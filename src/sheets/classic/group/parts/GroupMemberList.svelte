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
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: GroupMemberSection;
  }

  let { section }: Props = $props();

  const memberActorIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.MEMBER_IDS_TO_SHOW,
  );

  const context = getGroupSheetClassicContext();

  const localize = FoundryAdapter.localize;
</script>

<TidyTable key={section.key} data-custom-section={section.custom ? true : null}>
  {#snippet header()}
    <TidyTableHeaderRow>
      <TidyTableHeaderCell primary={true}>
        {localize(section.label)}
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    <div class="flex-column small-gap mt-2">
      {#each section.members as member, index (member.uuid)}
        {#if $memberActorIdsToShow === undefined || $memberActorIdsToShow.has(member.id)}
          <GroupMemberListItem
            {member}
            ctx={context.memberContext[member.id]}
          />

          {#if section.members.length > 1 && index !== section.members.length - 1}
            <HorizontalLineSeparator class="mx-1" borderColor="separator" />
          {/if}
        {/if}
      {/each}
    </div>
  {/snippet}
</TidyTable>
