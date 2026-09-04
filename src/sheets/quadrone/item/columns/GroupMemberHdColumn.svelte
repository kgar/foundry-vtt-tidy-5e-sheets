<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  let { rowDocument }: { rowDocument: Actor5e } = $props();

  let hdPct = $derived(rowDocument.system.attributes?.hd?.pct);
</script>

{#if hdPct !== undefined}
  <div
    class="meter meter-small progress hit-die"
    style="--bar-percentage: {hdPct.toFixed(0)}%"
  ></div>
  <div class="flexrow">
    <span class="font-label-medium color-text-default"
      >{rowDocument.system.attributes.hd.value}</span
    >
    <span class="font-body-medium color-text-lightest separator">/</span>
    <span class="font-body-medium color-text-default"
      >{rowDocument.system.attributes.hd.max}</span
    >
  </div>
{/if}
