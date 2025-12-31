<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getUsesRechargeDiceRange } from 'src/utils/formula';
  import ActivityUsesColumn from './ActivityUsesColumn.svelte';
  import { Activities } from 'src/features/activities/activities';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { VehicleItemContext } from 'src/types/types';

  let {
    rowDocument: item,
    rowContext,
  }: ColumnCellProps<any, VehicleItemContext> = $props();

  let conceal = $derived(item.system.identified === false);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    localize('TIDY5E.RollRecharge.Hint', {
      rechargeLabel: item.labels?.recharge ?? '',
    }),
  );

  function onRechargeClicked(ev: MouseEvent) {
    ev.shiftKey
      ? item.update({ ['system.uses.spent']: 0 })
      : item.system.uses?.rollRecharge({ apply: true, event: ev });
  }

  let { rechargeRange, diceIconClass } = $derived(
    getUsesRechargeDiceRange(item.system.uses),
  );

  let value = $derived(item.system.uses?.value ?? 0);
  let max = $derived(item.system.uses?.max ?? 0);
  let pct = $derived(calculatePct());

  function calculatePct() {
    if (max === 0) {
      return 0;
    }

    return (value / max) * 100;
  }
</script>

{#if item.hasLimitedUses && !conceal}
  <div
    class="meter meter-small progress uses"
    style="--bar-percentage: {pct.toFixed(0)}%"
  ></div>
  {#if item.hasRecharge && item.isOnCooldown}
    <a
      class={['item-list-button', { disabled: !item.isOwner }]}
      data-tooltip={rechargeLabel}
      onclick={(ev) => item.isOwner && onRechargeClicked(ev)}
    >
      <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
      <span class="recharge-range-text text-data">
        {rechargeRange}
      </span>
    </a>
  {:else if item.hasRecharge && !item.isOnCooldown}
    <span class="charged-text">
      {#if item.system.uses.value > 1}
        <span>{item.system.uses.value}</span>
      {/if}
      <i class="fas fa-bolt" data-tooltip={localize('DND5E.Charged')}></i>
    </span>
  {:else}
    <div class="inline-uses flexrow">
      <input
        type="text"
        value={item.system.uses.value}
        {@attach InputAttachments.selectOnFocus}
        onchange={(event) =>
          FoundryAdapter.handleDocumentUsesChanged(event, item)}
        class="uninput uses-value color-text-default"
        disabled={!context.editable}
      />
      <span class="divider color-text-gold flexshrink">/</span>
      <span class="uses-max color-text-lighter">{item.system.uses.max}</span>
    </div>
  {/if}
{:else if item.system.linkedActivity}
  {@const ctx = Activities.getActivityItemContext(item.system.linkedActivity)}
  <ActivityUsesColumn
    rowContext={ctx}
    rowDocument={ctx.activity}
    section={SheetSections.EMPTY}
  />
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
