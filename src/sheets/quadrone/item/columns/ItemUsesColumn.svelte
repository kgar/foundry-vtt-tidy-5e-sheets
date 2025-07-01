<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemRechargeSummary from '../parts/header/ItemRechargeSummary.svelte';

  let { rowDocument: item }: ColumnCellProps = $props();

  let conceal = $derived(item.system.identified === false);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    localize('TIDY5E.RollRecharge.Hint', {
      rechargeLabel: item.labels?.recharge ?? '',
    }),
  );

  let recovery = $derived(item.system.uses?.recovery[0]);

  function onRechargeClicked(ev: MouseEvent) {
    ev.shiftKey
      ? item.update({ ['system.uses.spent']: 0 })
      : item.system.uses?.rollRecharge({ apply: true, event: ev });
  }

  // TODO: this is duplicated. Share it somewhere universal?
  let faces: Record<string, string> = {
    '1': 'fa-solid fa-dice-one',
    '2': 'fa-solid fa-dice-two',
    '3': 'fa-solid fa-dice-three',
    '4': 'fa-solid fa-dice-four',
    '5': 'fa-solid fa-dice-five',
    '6': 'fa-solid fa-dice-six',
  };

  let unknownFace = 'fa-solid fa-dice';

  let formula = $derived(recovery?.formula ?? '');
  let recharge = $derived(formula === '6' ? formula : `${formula}-6`);
  let diceIconClass = $derived(faces[formula] ?? unknownFace);
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
        {recharge}
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
