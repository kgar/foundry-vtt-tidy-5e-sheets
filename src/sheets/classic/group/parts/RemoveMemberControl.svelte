<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  interface Props {
    member: Actor5e;
  }

  let { member }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="inline-icon-button"
  onclick={() => $context.actor.system.removeMember(member.id)}
  title={localize('TIDY5E.Group.RemoveMemberFromGroup')}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-xmark"></i>
</button>
