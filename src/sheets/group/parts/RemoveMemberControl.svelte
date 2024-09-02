<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let member: Actor5e;
</script>

<button
  type="button"
  class="inline-icon-button"
  on:click={() => $context.actor.system.removeMember(member.id)}
>
  <i class="fas fa-xmark"></i>
</button>
