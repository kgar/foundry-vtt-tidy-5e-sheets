<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let range = $derived(rowDocument.system.range);

  let units = $derived(
    CONFIG.DND5E.movementUnits[range?.units]?.abbreviation ?? range?.units,
  );
</script>

{#if range?.value}
  <span class="range font-label-medium">
    {range.value}
    {#if range.long}&sol; {range.long}{/if}
  </span>
  <span class="units font-default-medium color-text-lighter">
    {units}
  </span>
{:else if range?.reach}
  <span class="range font-label-medium">
    {range.reach}
  </span>
  <span class="units font-default-medium color-text-lighter">
    {units}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
