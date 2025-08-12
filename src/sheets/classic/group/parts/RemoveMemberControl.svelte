<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';

  const context = $derived(getGroupSheetClassicContext());

  interface Props {
    memberId: string
  }

  let { memberId }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="inline-icon-button"
  onclick={() => context.actor.system.removeMember(memberId)}
  title={localize('DND5E.Group.Action.Remove')}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-xmark"></i>
</button>
