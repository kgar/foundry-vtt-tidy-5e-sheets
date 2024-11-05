<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { Inventory } from 'src/features/sections/Inventory';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyHooks } from 'src/foundry/TidyHooks';
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

  const localize = FoundryAdapter.localize;

  function abbreviateCurrency(currencyKey: string) {
    return (
      CONFIG.DND5E.currencies[
        currencyKey as keyof typeof CONFIG.DND5E.currencies
      ]?.abbreviation ?? currencyKey
    );
  }

  function promptCreateInventoryItem() {
    const actor = $context.item.actor;

    const createData = {
      folder: $context.item.folder,
      'system.container': $context.item.id,
    };

    if (!TidyHooks.tidy5eSheetsPreCreateItem(actor, createData, game.user.id)) {
      return;
    }

    Item.implementation.createDialog(createData, {
      parent: actor,
      pack: $context.item.pack,
      types: Inventory.getDefaultInventoryTypes(),
      keepId: true,
    });
  }

  function confirmConvertCurrency() {
    new dnd5e.applications.CurrencyManager(document).render(true);
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
  <a
    class="button icon-button"
    on:click={() => confirmConvertCurrency()}
    title={localize('DND5E.CurrencyManager.Title')}
  >
    <i class="fas fa-database"></i>
  </a>
  <a
    title={localize('DND5E.ItemCreate')}
    class="button icon-button attention"
    on:click={() => promptCreateInventoryItem()}
  >
    <i class="fas fa-plus"></i>
  </a>
</section>
