<script lang="ts">
  import InlineItemQuantityTracker from 'src/components/trackers/InlineItemQuantityTracker.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/types/types';

  let { rowDocument }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

<InlineItemQuantityTracker
  disabled={!context.editable}
  item={rowDocument}
  field="system.quantity"
/>
