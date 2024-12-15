<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ContainerSheetClassicContext,
    Item5e,
  } from 'src/types/item.types';
  import type { Actor5e } from 'src/types/types';
  import type { ActorSheetContextV1 } from 'src/types/types';

  interface Props {
    document: Actor5e | Item5e;
  }

  let { document }: Props = $props();

  let context = $derived(getSheetContext<
    ActorSheetContextV1 | ContainerSheetClassicContext
  >());

  let currencies = $derived(
    Object.keys(CONFIG.DND5E.currencies).map((key) => ({
      key: key,
      value: (document.system.currency[key] ?? 0) as number,
    })),
  );

  function confirmConvertCurrency() {
    new dnd5e.applications.CurrencyManager(document).render(true);
  }

  function abbreviateCurrency(currencyKey: string) {
    return (
      CONFIG.DND5E.currencies[
        currencyKey as keyof typeof CONFIG.DND5E.currencies
      ]?.abbreviation ?? currencyKey
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="inventory-currency">
  <ol class="currency">
    {#each currencies as currency}
      <li
        class="currency-item {currency.key}"
        title={context.config.currencies[currency.key]?.label}
      >
        <TextInput
          {document}
          field="system.currency.{currency.key}"
          id="{document.id}-system.currency.{currency.key}"
          value={currency.value}
          allowDeltaChanges={true}
          selectOnFocus={true}
          disabled={!context.editable || context.lockMoneyChanges}
        />
        <label
          for="{document.id}-system.currency.{currency.key}"
          class="denomination {currency.key}"
          data-denom={currency.key}>{abbreviateCurrency(currency.key)}</label
        >
      </li>
    {/each}
    <li class="currency-item convert">
      <button
        type="button"
        class="currency-convert"
        title={localize('DND5E.CurrencyManager.Title')}
        onclick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          confirmConvertCurrency();
        }}
        disabled={!context.editable}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-coins"></i>
      </button>
    </li>
  </ol>
</div>
