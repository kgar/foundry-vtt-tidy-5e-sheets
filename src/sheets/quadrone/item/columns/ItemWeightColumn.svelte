<script lang="ts">
  import type { ColumnCellProps } from 'src/types/types';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  let weight = $derived(rowContext?.totalWeight ?? item.system.weight.value);
</script>

{weight}
