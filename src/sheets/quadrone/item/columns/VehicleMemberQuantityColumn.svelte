<script lang="ts">
  import InlineQuantityTracker from 'src/components/trackers/InlineQuantityTracker.svelte';
  import type {
    Actor5e,
    VehicleCrewMemberContext,
    VehiclePassengerMemberContext,
  } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let {
    rowContext,
  }: {
    rowDocument: Actor5e;
    rowContext: VehicleCrewMemberContext | VehiclePassengerMemberContext;
  } = $props();
</script>

<InlineQuantityTracker
  aria-label={FoundryAdapter.localize('DND5E.Quantity')}
  data-tooltip="DND5E.Quantity"
  min="0"
  value={rowContext.quantity}
  property="crewQuantity:value"
  decreaseAction="adjustCrew"
  decreaseAttributes={{
    'data-delta': '-1',
  }}
  increaseAction="adjustCrew"
  increaseAttributes={{
    'data-delta': '+1',
  }}
/>
