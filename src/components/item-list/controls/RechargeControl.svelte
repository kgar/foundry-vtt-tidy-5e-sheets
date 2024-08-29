<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: Item5e;

  const localize = FoundryAdapter.localize;

  $: rechargeLabel =
    item.system.recharge?.charged === false
      ? localize('TIDY5E.RollRecharge.Hint', {
          rechargeLabel: item.labels?.recharge ?? '',
        })
      : item.labels?.recharge ?? '';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<button
  type="button"
  class="item-list-button"
  title={rechargeLabel}
  on:click={(ev) =>
    ev.shiftKey
      ? item.update({ 'system.recharge.charged': true })
      : item.rollRecharge()}
  disabled={!$context.owner}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-dice-six" />
  {item.system.recharge
    ?.value}{#if item.system.recharge?.value !== 6}+{/if}</button
>
