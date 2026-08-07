<script lang="ts">
  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';
  import type {
    Actor5e,
    VehicleCrewMemberContext,
    VehiclePassengerMemberContext,
  } from 'src/types/types';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let {
    rowDocument,
    rowContext,
  }: {
    rowDocument: Actor5e;
    rowContext: VehicleCrewMemberContext | VehiclePassengerMemberContext;
  } = $props();

  const context = $derived(getVehicleSheetQuadroneContext());

  function handleChange(delta: string) {
    const type = rowContext.type;

    context.sheet.applyDeltaToCrew(type, rowDocument.uuid, delta);
  }
</script>

<!-- <InlineQuantityTracker
  value={rowContext.quantity}
  onIncrement={() => handleChange('+1')}
  onDecrement={() => handleChange('-1')}
/> -->
