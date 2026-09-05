<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  let { rowDocument }: { rowDocument: Actor5e } = $props();
</script>

<span
  class="font-label-large color-text-default"
  data-attribution="attributes.ac"
  data-attribution-caption="DND5E.ArmorClass"
  data-reference-tooltip={rowDocument.uuid}
  data-tooltip-class="property-attribution"
  >{rowDocument.system.attributes.ac.value}</span
>
