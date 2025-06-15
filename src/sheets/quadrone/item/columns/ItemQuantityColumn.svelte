<script lang="ts">
  import InlineItemQuantityTracker from 'src/components/trackers/InlineItemQuantityTracker.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

<InlineItemQuantityTracker
  disabled={!context.editable}
  item={rowDocument}
  field="system.quantity"
/>
