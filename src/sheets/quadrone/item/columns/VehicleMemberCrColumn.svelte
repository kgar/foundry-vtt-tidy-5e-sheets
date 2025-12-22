<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    CrewMemberContext,
    PassengerMemberContext,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, CrewMemberContext | PassengerMemberContext> =
    $props();
</script>

CR col here