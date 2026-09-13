<script lang="ts">
  import type { VehicleItemQuadroneContext } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';

  type Props = {
    rowDocument: Item5e;
    rowContext: VehicleItemQuadroneContext;
  };

  let { rowDocument, rowContext }: Props = $props();

  const value = $derived(
    rowContext.crew?.filter((c) => c.actor && !c.brokenLink).length ?? 0,
  );
  const max = $derived(rowDocument.system.crew?.max);
</script>

{#if max !== undefined || value > 0}
  <span class={['inline-crew-count', { 'crew-warning': value > max }]}>
    <span class="uses-value font-label-medium color-text-default">
      {value}
    </span>
    <span class="separator">/</span>
    <span class="uses-max font-default-medium color-text-default">{max ?? '—'}</span>
  </span>
{:else}
  <span class="uses-max font-default-medium color-text-disabled"
    >{max ?? '—'}</span
  >
{/if}
