<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

{#if !isNil(rowContext.toHit)}
  {@const mod = getModifierData(rowContext.toHit)}
  <span class="modifier">
    <span class="sign font-default-medium color-text-lightest">{mod.sign}</span><span class="value font-label-medium">{mod.value}</span>
  </span>
{:else if rowContext.save?.ability}
  <div class="stacked">
    <span class="ability uppercase color-text-gold-emphasis font-label-medium">{rowContext.save.ability}</span>
    <span class="value font-label-medium">{rowContext.save.dc.value}</span>
  </div>
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
