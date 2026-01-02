<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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

<span class="hp-value font-label-large color-text-default"
  >{FoundryAdapter.formatCr(rowDocument.system.attributes.hp.max)}</span
>
