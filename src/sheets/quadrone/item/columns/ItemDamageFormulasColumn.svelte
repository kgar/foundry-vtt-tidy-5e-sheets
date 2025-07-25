<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { Actions } from 'src/features/actions/actions.svelte';
  import { error } from 'src/utils/logging';
  import ListItemsTooltip from 'src/tooltips/ListItemsTooltip.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type { TidyTableToggleSummaryFunction } from 'src/components/table-quadrone/TidyItemTableRow.svelte';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  const damageHealingTypeIcons = Actions.damageAndHealingTypesIconSrcMap;

  let toggleSummary = getContext<TidyTableToggleSummaryFunction | undefined>(
    CONSTANTS.SVELTE_CONTEXT.TIDY_TABLE_TOGGLE_SUMMARY,
  );

  function getTrimmedExpression(formula: string) {
    try {
      return new Roll(formula).terms.map((t: any) => t.expression).join(' ');
    } catch (e) {
      error(
        'An error occurred while preparing a damage formula for the formula column',
        false,
        { error: e, rowDocument, rowContext },
      );
    }
    return formula;
  }

  let tooltip = $state<ListItemsTooltip>();
  let allDamageLabels = $derived(
    rowDocument.labels.damages?.map((d: any) => d.label) ?? [],
  );

  let topTwoDamages = $derived((rowDocument.labels.damages ?? []).slice(0, 2));
  let remainingDamagesCount = $derived(
    (rowDocument.labels.damages ?? []).slice(2).length,
  );
</script>

<ListItemsTooltip
  bind:this={tooltip}
  entries={allDamageLabels}
  sheetDocument={rowDocument.actor}
/>

<div
  class="flexcol truncate"
  onmouseover={(ev) =>
    allDamageLabels?.length && tooltip?.tryShow(ev.currentTarget)}
>
  {#each topTwoDamages ?? [] as damage, i}
    {@const formula = getTrimmedExpression(damage.formula)}
    {@const damageHealingIcon = damageHealingTypeIcons[damage.damageType]}
    <div class="flexrow damage-formula-container">
      <span class="flexshrink damage-formula truncate">{formula}</span>
      {#if damageHealingIcon}
        <span class="flexshrink damage-icon" aria-label={damage.label}>
          <Dnd5eIcon src={damageHealingIcon} />
        </span>
      {/if}
      {#if i === 1 && remainingDamagesCount > 0}
        <a
          type="button"
          class="button remaining-damages-count"
          onclick={() => {
            toggleSummary?.(true);
            Tooltip.hide();
          }}
        >
          +{remainingDamagesCount}
        </a>
      {/if}
    </div>
  {:else}
    <span class="color-text-disabled">&mdash;</span>
  {/each}
</div>
