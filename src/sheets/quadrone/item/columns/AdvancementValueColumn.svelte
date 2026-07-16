<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { AdvancementItemContext } from 'src/types/item.types';
  import { isNil } from 'src/utils/data';

  let {
    rowDocument: advancement,
  }: ColumnCellProps<AdvancementItemContext, AdvancementItemContext> = $props();
</script>

{#if !isNil(advancement.value)}
  {const value = $derived(advancement.value?.toString())}
  <span class="truncate" data-tooltip={value}>
    {value}
  </span>
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
