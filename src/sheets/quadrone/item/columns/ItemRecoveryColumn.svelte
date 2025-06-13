<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

recovery here