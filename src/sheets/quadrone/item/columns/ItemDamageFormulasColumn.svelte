<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

<div>
  {#each rowDocument.labels.damages as damage}
    {@const damageType = CONFIG.DND5E.damageTypes[damage.damageType]}
    <div class="flexrow">
      <span class="flexshrink formula">{damage.formula}</span>
      <span class="flexshrink" data-tooltip aria-label={damage.label}>
        <Dnd5eIcon src={damageType.icon} />
      </span>
    </div>
  {:else}
    <span class="color-text-disabled">&mdash;</span>
  {/each}
</div>
