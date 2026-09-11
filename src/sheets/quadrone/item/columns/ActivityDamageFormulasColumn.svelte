<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { Actions } from 'src/features/actions/actions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { error } from 'src/utils/logging';
  import ListItemsTooltip from 'src/tooltips/ListItemsTooltip.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import type { ActivityItemContext } from 'src/types/types';

  type Props = {
    rowDocument: Activity5e;
    rowContext: ActivityItemContext;
  };

  let { rowDocument, rowContext }: Props = $props();
  const localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext());
  let unidentified = $derived(rowDocument.item?.system?.identified === false);
  let onItemSheet = $derived(
    context.document?.documentName === 'Item' &&
      context.document?.id === rowDocument.item?.id,
  );
  let conceal = $derived(
    unidentified &&
      !(onItemSheet && FoundryAdapter.isInGmEditMode(context.document)),
  );

  const damageHealingTypeIcons = Actions.damageAndHealingTypesIconSrcMap;

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
  let labels = $derived(
    rowDocument.labels.damages?.map((d: any) => d.label) ?? [],
  );
</script>

<ListItemsTooltip
  bind:this={tooltip}
  entries={labels}
  sheetDocument={rowDocument.actor}
/>

<div
  class="flexcol truncate"
  role="tooltip"
  onmouseover={(ev) =>
    !conceal && labels?.length && tooltip?.tryShow(ev.currentTarget)}
  onfocus={(ev) =>
    !conceal && labels?.length && tooltip?.tryShow(ev.currentTarget)}
>
  {#if !conceal}
    {#each rowDocument.labels.damages ?? [] as damage}
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
      </div>
    {:else}
      <span class="color-text-disabled">{unidentified ? localize('TIDY5E.Table.UnidentifiedPlaceholder') : '—'}</span>
    {/each}
  {:else}
    <span class="color-text-disabled">{unidentified ? localize('TIDY5E.Table.UnidentifiedPlaceholder') : '—'}</span>
  {/if}
</div>
