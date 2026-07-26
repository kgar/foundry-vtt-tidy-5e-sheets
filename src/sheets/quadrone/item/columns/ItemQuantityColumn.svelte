<script lang="ts">
  import InlineItemQuantityTracker from 'src/components/trackers/InlineItemQuantityTracker.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';

  type Props = {
    rowDocument: Item5e;
  };

  let { rowDocument }: Props = $props();

  let context = $derived(getSheetContext());
</script>

<InlineItemQuantityTracker
  disabled={!context.editable}
  item={rowDocument}
  field="system.quantity"
/>
