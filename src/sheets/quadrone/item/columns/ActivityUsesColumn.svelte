<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getUsesRechargeDiceRange } from 'src/utils/formula';

  let { rowDocument: activity, rowContext: ctx }: ColumnCellProps = $props();

  let conceal = $derived(activity.item.system.identified === false);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    localize('TIDY5E.RollRecharge.Hint', {
      rechargeLabel: activity.labels?.recharge ?? '',
    }),
  );

  function onRechargeClicked(ev: MouseEvent) {
    ev.shiftKey
      ? activity.update({ ['uses.spent']: 0 })
      : activity.uses?.rollRecharge({ apply: true, event: ev });
  }

  let { rechargeRange, diceIconClass } = $derived(
    getUsesRechargeDiceRange(activity.uses),
  );
</script>

{#if ctx.hasLimitedUses && !conceal}
  {#if ctx.hasRecharge && ctx.isOnCooldown}
    <a
      class={['item-list-button', { disabled: !activity.item.isOwner }]}
      data-tooltip={rechargeLabel}
      onclick={(ev) => activity.item.isOwner && onRechargeClicked(ev)}
    >
      <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
      <span class="recharge-range-text text-data">
        {rechargeRange}
      </span>
    </a>
  {:else if ctx.hasRecharge && !ctx.isOnCooldown}
    <span class="charged-text">
      {#if activity.uses.value > 1}
        <span>{activity.uses.value}</span>
      {/if}
      <i class="fas fa-bolt" data-tooltip={localize('DND5E.Charged')}></i>
    </span>
  {:else}
    <input
      type="text"
      value={activity.uses.value}
      onfocus={(event) => event.currentTarget.select()}
      onchange={(event) =>
        FoundryAdapter.handleItemUsesChanged(event, activity)}
      class="uninput uses-value color-text-default"
      disabled={!context.editable}
    />
    <span class="color-text-gold">/</span>
    <span class="uses-max color-text-lighter">{activity.uses.max}</span>
  {/if}
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
