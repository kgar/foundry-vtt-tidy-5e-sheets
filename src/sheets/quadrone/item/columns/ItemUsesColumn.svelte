<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let { rowDocument: item }: ColumnCellProps = $props();

  let conceal = $derived(item.system.identified === false);

  let context = $derived(getSheetContext());
</script>

{#if item.hasLimitedUses && !conceal}
  <input
    type="text"
    value={item.system.uses.value}
    onfocus={(event) => event.currentTarget.select()}
    onchange={(event) => FoundryAdapter.handleItemUsesChanged(event, item)}
    class="uninput uses-value color-text-default"
    disabled={!context.editable}
  />
  <span class="color-text-gold">/</span>
  <span class="uses-max color-text-lighter">{item.system.uses.max}</span>
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
