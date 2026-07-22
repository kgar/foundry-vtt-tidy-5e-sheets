<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    VehicleCrewMemberContext,
    VehicleDraftAnimalContext,
  } from 'src/types/types';
  import type { ColumnCellProps } from 'src/types/columns.types';
  import type { VehiclePassengerMemberContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    | VehicleCrewMemberContext
    | VehiclePassengerMemberContext
    | VehicleDraftAnimalContext
  > = $props();
</script>

{#if rowDocument.system.isNPC}
  <span class="cr-value font-default-medium color-text-default"
    >{FoundryAdapter.formatCr(rowDocument.system.details.cr)}</span
  >
{/if}
