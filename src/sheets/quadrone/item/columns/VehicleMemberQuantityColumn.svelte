<script lang="ts">
  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';
  import type {
    ColumnCellProps,
    VehicleCrewMemberContext,
    VehicleCrewSection,
    VehiclePassengerMemberContext,
    VehiclePassengerSection,
  } from 'src/types/types';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let {
    rowDocument,
    rowContext,
    section,
  }: ColumnCellProps<
    any,
    VehicleCrewMemberContext | VehiclePassengerMemberContext
  > = $props();

  const context = $derived(getVehicleSheetQuadroneContext());

  function handleChange(delta: string) {
    const type = (section as VehicleCrewSection | VehiclePassengerSection).type;

    context.sheet.applyDeltaToCrew(type, rowDocument.uuid, delta);
  }
</script>

<InlineQuantityTracker
  value={rowContext.quantity}
  onIncrement={() => handleChange('+1')}
  onDecrement={() => handleChange('-1')}
/>
