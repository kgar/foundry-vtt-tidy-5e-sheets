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
  import ItemTable from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from 'src/components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableColumn from 'src/components/item-list/v1/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let section: GroupMemberSection;

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key={section.key}>
  <svelte:fragment slot="header">
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label)}
      </ItemTableColumn>
    </ItemTableHeaderRow>
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
</ItemTable>
