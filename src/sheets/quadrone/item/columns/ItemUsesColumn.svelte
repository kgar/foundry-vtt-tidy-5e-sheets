<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getItemRechargeDiceRange } from 'src/utils/formula';

  let { rowDocument: item }: ColumnCellProps = $props();

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

  let { rechargeRange, diceIconClass } = getItemRechargeDiceRange(item);
</script>

{#if item.hasLimitedUses && !conceal}
  {#if item.hasRecharge && item.isOnCooldown}
    <a
      class={['item-list-button', { disabled: !item.isOwner }]}
      title={rechargeLabel}
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
      <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
    </span>
  {:else}
    <input
      type="text"
      value={item.system.uses.value}
      onfocus={(event) => event.currentTarget.select()}
      onchange={(event) => FoundryAdapter.handleItemUsesChanged(event, item)}
      class="uninput uses-value color-text-default"
      disabled={!context.editable}
    />
    <span class="color-text-gold">/</span>
    <span class="uses-max color-text-lighter">{item.system.uses.max}</span>
  {/if}
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
