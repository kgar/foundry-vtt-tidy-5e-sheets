<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let member: Actor5e;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="inline-icon-button"
  on:click={() => $context.actor.system.removeMember(member.id)}
  title={localize('TIDY5E.Group.RemoveMemberFromGroup')}
>
  <i class="fas fa-xmark"></i>
</a>
