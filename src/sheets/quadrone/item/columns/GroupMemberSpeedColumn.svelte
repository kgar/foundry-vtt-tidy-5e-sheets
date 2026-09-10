<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  let { rowDocument }: { rowDocument: Actor5e } = $props();

  let movement = $derived(rowDocument.system.attributes.movement);
  let walkSpeed = $derived(movement.speeds.walk ?? 0);
  let units = $derived(
    CONFIG.DND5E.movementUnits[movement.units]?.abbreviation ?? movement.units,
  );
</script>

<span
  class="font-label-medium color-text-default walk-speed"
  data-attribution="attributes.movement"
  data-attribution-caption="DND5E.Speed"
  data-reference-tooltip={rowDocument.uuid}
  data-tooltip-class="property-attribution"
>
  <span class="value">{walkSpeed}</span><span
    class="units font-default-medium color-text-lighter">{units}</span
  >
</span>
