<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';

  interface Props {
    document: any;
    uses: any; // TODO: Give it types
    field: string;
  }

  let { document, uses, field }: Props = $props();

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    localize('TIDY5E.RollRecharge.Hint', {
      rechargeLabel: document.labels?.recharge ?? '',
    }),
  );

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  let recovery = $derived(uses?.recovery[0]);

  let disabled = $derived(!context.owner);

  function onRechargeClicked(ev: MouseEvent) {
    ev.shiftKey
      ? document.update({ [field]: 0 })
      : uses.rollRecharge({ apply: true, event: ev });
  }
</script>

<a
  class="item-list-button"
  class:disabled
  title={rechargeLabel}
  onclick={(ev) => !disabled && onRechargeClicked(ev)}
  tabindex="0"
>
  <i class="fas fa-dice-six"></i>
  {recovery?.formula}{#if recovery?.value !== 6}+{/if}
</a>
