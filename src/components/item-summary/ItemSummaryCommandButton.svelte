<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ItemSummaryCommandContext,
    ItemSummaryCommandValue,
    RegisteredItemSummaryCommand,
  } from 'src/runtime/types';
  import { settings } from 'src/settings/settings.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    command: RegisteredItemSummaryCommand;
    item: Item5e;
    context: ItemSummaryCommandContext;
  }

  let { command, item, context }: Props = $props();

  let params = $derived({ item, ...context });

  function resolve(value: ItemSummaryCommandValue<string> | undefined) {
    return typeof value === 'function' ? value(params) : value;
  }

  let label = $derived(resolve(command.label));
  let tooltip = $derived(resolve(command.tooltip));
  let iconClass = $derived(resolve(command.iconClass));
</script>

<button
  type="button"
  class="button button-borderless {label ? '' : 'button-icon-only'}"
  title={FoundryAdapter.localize(tooltip ?? '')}
  onclick={(event) => command.execute?.({ ...params, event })}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
  data-tooltip={FoundryAdapter.localize(tooltip ?? '')}
>
  {#if label}
    {FoundryAdapter.localize(label)}
  {/if}
  {#if iconClass}
    <i class={iconClass}></i>
  {/if}
</button>
