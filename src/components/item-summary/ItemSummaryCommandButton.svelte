<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { RegisteredItemSummaryCommand } from 'src/runtime/types';
  import { settings } from 'src/settings/settings.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    command: RegisteredItemSummaryCommand;
    item: Item5e;
  }

  let { command, item }: Props = $props();
</script>

<button
  type="button"
  class="button button-borderless"
  title={FoundryAdapter.localize(command.tooltip ?? '')}
  onclick={(event) => command.execute?.({ event, item: item })}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
>
  {#if command.iconClass}
    <i class={command.iconClass}></i>
  {/if}
  {FoundryAdapter.localize(command.label ?? '')}
</button>
