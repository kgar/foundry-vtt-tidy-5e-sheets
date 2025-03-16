<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/item/item.types';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  let weight = $derived(rowContext?.totalWeight ?? item.system.weight.value);
</script>

{weight}
