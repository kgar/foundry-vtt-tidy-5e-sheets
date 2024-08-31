<script lang="ts">
  import type { GroupMemberContext } from 'src/types/group.types';

  export let member: GroupMemberContext;
</script>

<p>Encounter member list item here for {member.actor.name}</p>
