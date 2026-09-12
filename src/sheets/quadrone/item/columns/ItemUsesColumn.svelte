<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getUsesRechargeDiceRange } from 'src/utils/formula';
  import ActivityUsesColumn from './ActivityUsesColumn.svelte';
  import { Activities } from 'src/features/activities/activities';
  import type { Item5e } from 'src/types/item.types';

  type Props = {
    rowDocument: Item5e;
  };

  let { rowDocument: item }: Props = $props();

  let conceal = $derived(item.system.identified === false);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    localize('TIDY5E.ITEM.Recharge.Hint', {
      rechargeLabel: item.labels?.recharge ?? '',
    }),
  );

  function onRechargeClicked(ev: MouseEvent | KeyboardEvent) {
    ev.shiftKey
      ? item.update({ ['system.uses.spent']: 0 })
      : item.system.uses?.rollRecharge({ apply: true, event: ev });
  }

  let { rechargeRange, diceIconClass } = $derived(
    getUsesRechargeDiceRange(item.system.uses),
  );
</script>

{#if item.hasLimitedUses && !conceal}
  {#if item.hasRecharge && item.isOnCooldown}
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      role="button" 
      tabindex="0"
      class={['item-list-button', { disabled: !item.isOwner }]}
      data-tooltip=""
      aria-label={rechargeLabel}
      onclick={(ev) => item.isOwner && onRechargeClicked(ev)}
      onkeydown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          item.isOwner && onRechargeClicked(ev);
        }
      }}
    >
      <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
      <span class="recharge-range-text font-label-medium">
        {rechargeRange}
      </span>
    </a>
  {:else if item.hasRecharge && !item.isOnCooldown}
    <span class="charged-text">
      {#if item.system.uses.value > 1}
        <span>{item.system.uses.value}</span>
      {/if}
      <i class="fas fa-bolt color-text-gold-emphasis" data-tooltip={localize('DND5E.Charged')}></i>
    </span>
  {:else}
    <input
      type="text"
      inputmode="numeric"
      value={item.system.uses.value}
      {@attach InputAttachments.selectOnFocus}
      data-name="system.uses.value"
      class="uninput uses-value font-label-default color-text-default"
      disabled={!context.editable}
    />
    <span class="separator">/</span>
    <span class="uses-max font-default-medium color-text-default">{item.system.uses.max}</span>
  {/if}
{:else if item.system.linkedActivity}
  {const ctx = $derived(
    Activities.getActivityItemContext(
      context.sheet,
      item.system.linkedActivity,
      context.unlocked,
      context.editable,
    ),
  )}

  <ActivityUsesColumn rowContext={ctx} rowDocument={ctx.activity} />
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
