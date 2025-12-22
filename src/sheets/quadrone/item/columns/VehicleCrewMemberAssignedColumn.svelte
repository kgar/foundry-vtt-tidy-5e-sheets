<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { CrewMemberContext } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps<any, CrewMemberContext> =
    $props();
</script>

Assigned col here
