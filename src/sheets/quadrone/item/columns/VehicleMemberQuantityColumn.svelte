<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    CrewMemberContext,
    DraftAnimalContext,
    PassengerMemberContext,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    CrewMemberContext | PassengerMemberContext | DraftAnimalContext
  > = $props();

  
</script>

Qty here
