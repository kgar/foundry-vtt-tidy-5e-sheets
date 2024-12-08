<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import type { Actor5e } from 'src/types/types';

  const context = getGroupSheetClassicContext();

  interface Props {
    member: Actor5e;
  }

  let { member }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="inline-icon-button"
  onclick={() => context.actor.system.removeMember(member.id)}
  title={localize('TIDY5E.Group.RemoveMemberFromGroup')}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-xmark"></i>
</button>
