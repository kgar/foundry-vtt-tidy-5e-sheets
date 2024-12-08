<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { ActorSheetContextV1 } from 'src/types/types';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    item.isOnCooldown
      ? localize('TIDY5E.RollRecharge.Hint', {
          rechargeLabel: item.labels?.recharge ?? '',
        })
      : (item.labels?.recharge ?? ''),
  );

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  let recovery = $derived(item.system.uses?.recovery[0]);
</script>

<button
  type="button"
  class="item-list-button"
  title={rechargeLabel}
  onclick={(ev) =>
    ev.shiftKey
      ? item.update({ 'system.uses.spent': 0 })
      : item.system.uses.rollRecharge()}
  disabled={!context.owner}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-dice-six"></i>
  {recovery?.formula}{#if recovery?.value !== 6}+{/if}</button
>
