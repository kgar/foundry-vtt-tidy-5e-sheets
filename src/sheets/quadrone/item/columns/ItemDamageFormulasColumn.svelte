<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { Actions } from 'src/features/actions/actions.svelte';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  const damageHealingTypeIcons = Actions.damageAndHealingTypesIconSrcMap;
</script>

<div>
  {#each (rowDocument.labels.damages ?? []) as damage}
    {@const damageHealingIcon = damageHealingTypeIcons[damage.damageType]}
    <div class="flexrow">
      <span class="flexshrink damage-formula">{damage.formula}</span>
      {#if damageHealingIcon}
        <span class="flexshrink damage-icon" data-tooltip aria-label={damage.label}>
          <Dnd5eIcon src={damageHealingIcon} />
        </span>
      {/if}
    </div>
  {:else}
    <span class="color-text-disabled">&mdash;</span>
  {/each}
</div>
