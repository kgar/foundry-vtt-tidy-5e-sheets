<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import RemoveMemberControl from './RemoveMemberControl.svelte';

  export let member: Actor5e;
</script>

<p class="flex-row small-gap">
  Encounter member list item here for {member.name} - <RemoveMemberControl
    {member}
  />
</p>
