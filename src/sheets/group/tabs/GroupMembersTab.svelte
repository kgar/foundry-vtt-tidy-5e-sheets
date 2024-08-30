<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import GroupMemberList from '../parts/GroupMemberList.svelte';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<section
  class="scroll-container flex-column small-gap"
  data-tidy-track-scroll-y
>
  {#each $context.memberSections as section (section.key)}
    <GroupMemberList {section} />
  {/each}
</section>
