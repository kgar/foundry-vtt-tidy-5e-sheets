<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let actor: Actor5e;

  let context = getContext<Readable<ActorSheetContext>>('context');

  $: currencies = Object.entries(actor.system.currency).map((e) => ({
    key: e[0],
    value: e[1] as any,
  }));

  function confirmConvertCurrency() {
    return FoundryAdapter.dialogConfirm({
      title: `${localize('DND5E.CurrencyConvert')}`,
      content: `<p>${localize('DND5E.CurrencyConvertHint')}</p>`,
      yes: () => $context.actor.convertCurrency(),
    });
  }

  function abbreviateCurrency(currencyKey: string) {
    let currency = currencyKey.toUpperCase();

    let abbr = localize(`DND5E.CurrencyAbbr${currency}`);
    if (abbr == `DND5E.CurrencyAbbr${currency}`) {
      abbr = currency;
    }

    return abbr;
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="inventory-currency">
  <ol class="currency">
    <li class="currency-header" title={localize('DND5E.Currency')}>
      <i class="fas fa-coins" />
    </li>
    {#each currencies as currency}
      <li
        class="currency-item {currency.key}"
        title={$context.labels.currencies[currency.key]}
      >
        <TextInput
          document={actor}
          field="system.currency.{currency.key}"
          id="{$context.appId}-system.currency.{currency.key}"
          value={currency.value}
          allowDeltaChanges={true}
          selectOnFocus={true}
          disabled={!$context.editable || $context.lockMoneyChanges}
        />
        <label
          for="{$context.appId}-system.currency.{currency.key}"
          class="denomination {currency.key}"
          data-denom={currency.key}>{abbreviateCurrency(currency.key)}</label
        >
      </li>
    {/each}
    <li class="currency-item convert">
      <button
        type="button"
        class="currency-convert"
        title={localize('DND5E.CurrencyConvertHint')}
        on:click|stopPropagation|preventDefault={() => confirmConvertCurrency()}
        disabled={!$context.editable}
      >
        <i class="fas fa-funnel-dollar" />
      </button>
    </li>
  </ol>
</div>

<style lang="scss">
  .inventory-currency {
    --currency-line-height: 1.875rem;

    .currency {
      display: flex;
      align-items: center;
      list-style: none;
      gap: 0.5rem;
      margin: 0.25rem 0;

      .currency-header {
        flex: 0 0 0.8125rem;
        text-align: center;

        i {
          font-size: 1.25rem;
        }
      }

      .currency-item {
        display: flex;
        align-items: center;
        background: var(--t5ek-faint-color);
        border-radius: 0.3125rem;
        line-height: var(--currency-line-height);
        padding-right: 0.5rem;

        :global(input) {
          text-align: right;
          flex: 1;
          padding-left: 0.5rem;
        }

        label {
          margin-left: 0.25rem;
          flex: 0 0 auto;
        }

        &.convert {
          padding: 0;
          flex: 0 0 0.0625rem;
          text-align: center;
          white-space: nowrap;
        }

        .currency-convert {
          line-height: var(--currency-line-height);
          border: none;
          background: var(--t5ek-tertiary-color);
          color: var(--t5ek-background);
          border-radius: 0.3125rem;
          padding: 0 0.375rem;

          &:hover {
            background: var(--t5ek-secondary-color);
          }
        }

        .denomination {
          text-transform: uppercase;
        }
      }
    }
  }
</style>
