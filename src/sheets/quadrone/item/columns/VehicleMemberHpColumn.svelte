<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ColumnCellProps,
    VehicleCrewMemberContext,
    VehicleDraftAnimalContext,
    VehiclePassengerMemberContext,
  } from 'src/types/types';

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

<span class="hp-value font-default-medium color-text-default"
  >{FoundryAdapter.formatCr(rowDocument.system.attributes.hp.max)}</span
>
