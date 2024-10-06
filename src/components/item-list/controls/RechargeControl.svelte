<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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
      : (item.labels?.recharge ?? '');

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="item-list-button"
  title={rechargeLabel}
  on:click={(ev) =>
    ev.shiftKey
      ? $context.owner && item.update({ 'system.recharge.charged': true })
      : $context.owner && item.rollRecharge()}
>
  <i class="fas fa-dice-six" />
  {item.system.recharge?.value}{#if item.system.recharge?.value !== 6}+{/if}
</a>
