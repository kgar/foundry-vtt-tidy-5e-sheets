<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    CrewMemberContext,
    PassengerMemberContext,
    DraftAnimalContext,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    CrewMemberContext | PassengerMemberContext | DraftAnimalContext
  > = $props();
</script>

<span class="hp-value font-default-medium color-text-default"
  >{FoundryAdapter.formatCr(rowDocument.system.attributes.hp.max)}</span
>
