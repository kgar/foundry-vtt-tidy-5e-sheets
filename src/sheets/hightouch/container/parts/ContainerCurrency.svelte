<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { ContainerSheetHightouchContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ContainerSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: currencies = Object.keys(CONFIG.DND5E.currencies).map((key) => ({
    key: key,
    value: $context.system.currency[key] as number,
  }));

  function abbreviateCurrency(currencyKey: string) {
    return (
      CONFIG.DND5E.currencies[
        currencyKey as keyof typeof CONFIG.DND5E.currencies
      ]?.abbreviation ?? currencyKey
    );
  }
</script>

<section class="currency-tracker">
  {#each currencies as currency}
    <label class="input-group">
      <TextInput
        document={$context.document}
        field="system.currency.{currency.key}"
        id="{$context.document.id}-system.currency.{currency.key}"
        value={currency.value}
        allowDeltaChanges={true}
        selectOnFocus={true}
        disabled={!$context.editable || $context.lockMoneyChanges}
        class="currency-item currency-{currency.key}"
        placeholder="0"
      />
      <span class="denomination {currency.key}" data-denom={currency.key}>
        {abbreviateCurrency(currency.key)}
      </span>
    </label>
  {/each}
  <!-- CURRENCY CONVERT Button? -->
  <!-- ITEM ADD Button -->
</section>
