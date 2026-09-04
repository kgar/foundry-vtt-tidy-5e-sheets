<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  let { rowDocument }: { rowDocument: Actor5e } = $props();
</script>

{#if rowDocument.system.details.xp}
  {#if rowDocument.system.isCharacter}
    <div
      class="meter meter-small progress xp"
      style="--bar-percentage: {rowDocument.system.details.xp.pct}%;"
    ></div>
    <span class="font-label-medium color-text-default"
      >{dnd5e.utils.formatNumber(rowDocument.system.details.xp.value)}</span
    >
  {:else if rowDocument.system.details.xp.value}
    <span class="font-label-large color-text-default"
      >{rowDocument.system.details.xp.value.toLocaleString()}</span
    >
  {:else}
    <span class="color-text-disabled">—</span>
  {/if}
{/if}
