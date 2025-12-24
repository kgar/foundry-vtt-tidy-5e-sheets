<script lang="ts">
  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CrewMemberContext,
    CrewSection,
    PassengerMemberContext,
    PassengerSection,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
    section,
  }: ColumnCellProps<any, CrewMemberContext | PassengerMemberContext> =
    $props();

  const context = $derived(getVehicleSheetQuadroneContext());

  function handleChange(delta: string) {
    const type = (section as CrewSection | PassengerSection).type;

    context.sheet.applyDeltaToCrew(type, rowDocument.uuid, delta);
  }
</script>

<InlineQuantityTracker
  value={rowContext.quantity}
  onIncrement={() => handleChange('+1')}
  onDecrement={() => handleChange('-1')}
/>
