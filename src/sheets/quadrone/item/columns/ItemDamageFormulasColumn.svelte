<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/item/item.types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());
</script>

<div>
  {#each rowDocument.labels.damages as damage}
    {@const damageType = CONFIG.DND5E.damageTypes[damage.damageType]}
    <div class="row">
      <span class="formula">{damage.formula}</span>
      <span data-tooltip aria-label={damage.label}>
        <!-- 👋 hightouch - --icon-fill variable controls color -->
        <Dnd5eIcon src={damageType.icon} />
      </span>
    </div>
  {:else}
    <span class="color-text-disabled">&mdash;</span>
  {/each}
</div>
