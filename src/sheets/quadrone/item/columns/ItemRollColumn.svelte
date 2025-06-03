<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/item/item.types';

  let { rowDocument }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

hello roll
