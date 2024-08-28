<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import GroupEncounterMemberListItem from './GroupEncounterMemberListItem.svelte';
  import GroupMemberListItem from './GroupMemberListItem.svelte';
  import { getContext } from 'svelte';
    import type { GroupSheetClassicContext } from 'src/types/group.types';

  const context = getContext<GroupSheetClassicContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  
</script>

<GroupMemberListItem />
<GroupEncounterMemberListItem />
