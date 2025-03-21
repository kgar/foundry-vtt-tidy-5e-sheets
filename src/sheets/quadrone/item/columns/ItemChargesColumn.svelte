<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/item/item.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let { rowDocument: item }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());

  let gmEditMode = $derived(
    FoundryAdapter.userIsGm() &&
      FoundryAdapter.isSheetUnlocked(context.document),
  );

  let conceal = $derived(item.system.identified === false && !gmEditMode);
</script>

{#if item.hasLimitedUses && !conceal}
  <input
    type="text"
    value={item.system.uses.value}
    onfocus={(event) => event.currentTarget.select()}
    onchange={(event) => FoundryAdapter.handleItemUsesChanged(event, item)}
    class="uninput uses-value color-text-default"
  />
  <span class="color-text-gold">/</span>
  <span class="uses-max color-text-lighter">{item.system.uses.max}</span>
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
