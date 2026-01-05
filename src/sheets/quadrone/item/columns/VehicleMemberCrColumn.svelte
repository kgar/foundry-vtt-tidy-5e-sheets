<script lang="ts">
  import { CONSTANTS } from 'src/constants';
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

{#if rowDocument.type === CONSTANTS.SHEET_TYPE_NPC}
  <span class="cr-value font-default-medium color-text-default"
    >{FoundryAdapter.formatCr(rowDocument.system.details.cr)}</span
  >
{/if}
