<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerSheetContext, Item5e } from 'src/types/item.types';
  import type { Actor5e } from 'src/types/types';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let document: Actor5e | Item5e;

  let context = getContext<
    Readable<ActorSheetContextV1 | ContainerSheetContext>
  >(CONSTANTS.SVELTE_CONTEXT.CONTEXT);

  $: currencies = Object.keys(CONFIG.DND5E.currencies).map((key) => ({
    key: key,
    value: (document.system.currency[key] ?? 0) as number,
  }));

  function confirmConvertCurrency() {
    new dnd5e.applications.CurrencyManager(document).render(true);
  }

  function abbreviateCurrency(currencyKey: string) {
    return CONFIG.DND5E.currencies[currencyKey]?.abbreviation ?? currencyKey;
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="inventory-currency">
  <ol class="currency">
    {#each currencies as currency}
      <li
        class="currency-item {currency.key}"
        title={$context.config.currencies[currency.key]?.label}
      >
        <TextInput
          {document}
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class="currency-convert"
        title={localize('DND5E.CurrencyManager.Title')}
        on:click|stopPropagation|preventDefault={() =>
          $context.editable && confirmConvertCurrency()}
      >
        <i class="fas fa-coins" />
      </a>
    </li>
  </ol>
</div>
