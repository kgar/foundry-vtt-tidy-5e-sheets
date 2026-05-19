<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrencyContext, Item5e } from 'src/types/item.types';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = {
    container: Item5e;
    currencies?: CurrencyContext[];
  } & HTMLButtonAttributes;

  let {
    container,
    currencies = [],
    class: cssClass,
    ...rest
  }: Props = $props();

  let hasCurrency = $derived(currencies.some((c) => c.value > 0));
</script>

{#if hasCurrency && container.actor}
  <button
    data-item-id={container.id}
    type="button"
    class={['button button-secondary transfer-currency', cssClass]}
    data-action="transfer-currency"
    aria-label={FoundryAdapter.localize('TIDY5E.Containers.TransferCurrencyToParent.Tooltip')}
    data-tooltip=""
    {...rest}
  >
    <i class="fas fa-person-arrow-up-from-line"></i>
    {FoundryAdapter.localize('DND5E.CurrencyManager.Transfer.Label')}
  </button>
{/if}
