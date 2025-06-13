<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let range = $derived(rowDocument.system.range);
</script>

{#if range?.value}
  <span class="range">
    {range.value}
    {#if range.long}&sol; {range.long}{/if}
  </span>
  <span class="units font-default-medium color-text-lighter">
    {range.units}
  </span>
{:else if range?.reach}
  <span class="range">
    {range.reach}
  </span>
  <span class="units font-default-medium color-text-lighter">
    {range.units}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
