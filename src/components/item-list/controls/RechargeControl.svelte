<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

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

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

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
  disabled={!$context.owner}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-dice-six"></i>
  {recovery?.formula}{#if recovery?.value !== 6}+{/if}</button
>
