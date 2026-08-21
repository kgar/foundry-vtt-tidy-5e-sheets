<script lang="ts">
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import ActorTableImage from 'src/sheets/quadrone/shared/ActorTableImage.svelte';
  
  interface Props {
    member: GroupMemberQuadroneContext;
  }

  let { member }: Props = $props();
</script>

<ActorTableImage {member} />

<span class="truncate">{member.actor.name}</span>