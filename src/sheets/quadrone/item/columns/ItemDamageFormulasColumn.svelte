<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { Actions } from 'src/features/actions/actions.svelte';
  import { error } from 'src/utils/logging';
  import ListItemsTooltip from 'src/tooltips/ListItemsTooltip.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type { TidyTableToggleSummaryFunction } from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    rowDocument: Item5e;
  };

  const localize = FoundryAdapter.localize;
  let { rowDocument }: Props = $props();
  let identified = $derived(rowDocument?.system?.identified !== false);

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
        { error: e, rowDocument },
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
  role="tooltip"
  onmouseover={(ev) =>
    identified &&
    allDamageLabels?.length &&
    tooltip?.tryShow(ev.currentTarget)}
  onfocus={(ev) =>
    identified &&
    allDamageLabels?.length &&
    tooltip?.tryShow(ev.currentTarget)}
>
  {#if identified}
    {#each topTwoDamages ?? [] as damage, i}
      {const formula = $derived(getTrimmedExpression(damage.formula))}
      {const damageHealingIcon = $derived(
        damageHealingTypeIcons[damage.damageType],
      )}
      <div class="flexrow damage-formula-container">
        <span class="flexshrink damage-formula truncate">{formula}</span>
        {#if damageHealingIcon}
          <span class="flexshrink damage-icon" aria-label={damage.label}>
            <Dnd5eIcon src={damageHealingIcon} />
          </span>
        {/if}
        {#if i === 1 && remainingDamagesCount > 0}
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            type="button"
            role="button"
            tabindex="0"
            class="button remaining-damages-count"
            onclick={() => {
              toggleSummary?.(true);
              Tooltip.hide();
            }}
            onkeydown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                toggleSummary?.(true);
                Tooltip.hide();
              }
            }}
          >
            +{remainingDamagesCount}
          </a>
        {/if}
      </div>
    {:else}
      <span class="color-text-disabled">{identified ? '—' : localize('TIDY5E.Table.UnidentifiedPlaceholder')}</span>
    {/each}
  {:else}
    <span class="color-text-disabled">{identified ? '—' : localize('TIDY5E.Table.UnidentifiedPlaceholder')}</span>
  {/if}
</div>
