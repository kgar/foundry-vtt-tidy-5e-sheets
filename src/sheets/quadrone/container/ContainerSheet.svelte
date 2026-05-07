<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import Sidebar from '../item/parts/Sidebar.svelte';
  import ItemNameHeaderOrchestrator from '../item/parts/ItemNameHeaderOrchestrator.svelte';
  import ItemPriceSummary from '../item/parts/header/ItemPriceSummary.svelte';
  import ItemWeightSummary from '../item/parts/header/ItemWeightSummary.svelte';
  import ItemName from '../item/parts/header/ItemName.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  const context = $derived(getContainerSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let itemNameEl: HTMLElement | undefined = $state();

  let holdsMarkup = $derived.by(() => {
    return localize('TIDY5E.Containers.HoldsNumberUnits', {
      holdsElementStart: '<span class="color-text-lighter fw-normal">',
      holdsElementEnd: '</span>',
      numberElementStart: '<span>',
      number: FoundryAdapter.formatNumber(context.capacity.max),
      numberElementEnd: '</span>',
      unitsElementStart: '<span class="color-text-lighter fw-normal">',
      units: context.capacity.units ?? '',
      unitsElementEnd: '</span>',
    });
  });

  const value = $derived(
    FoundryAdapter.formatNumber(context.capacity.value.toNearest(0.01)),
  );

  const max = $derived(
    context.capacity.max === Infinity
      ? '∞'
      : FoundryAdapter.formatNumber(context.capacity.max.toNearest(0.01)),
  );

  let currencies = $derived(context.currencies);
  let hasCurrency = $derived(currencies.some((c) => c.value > 0));
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4>{localize('TYPES.Item.container')}</h4>
      <div class="pills stacked">
        <li class="pill">
          <span>
            {@html holdsMarkup}
          </span>
        </li>
      </div>
    </div>

    <div>
      <h4 class="currency-header">
        <span>{localize('DND5E.Currency')}</span>
        {#if context.editable}
          <button
            type="button"
            class={[
              'button button-icon-only currency-conversion',
              { disabled: !context.editable },
            ]}
            data-action="currency"
            data-tooltip="DND5E.CurrencyManager.Title"
          >
            <i class="fas fa-database"></i>
          </button>
        {/if}
      </h4>
      <div class="currencies">
        {#each context.currencies as currency (currency.key)}
          <label class="input-group">
            <i class="currency {currency.key}" aria-label={currency.key}></i>
            <TextInputQuadrone
              document={context.document}
              field="system.currency.{currency.key}"
              id="{context.document.id}-system.currency.{currency.key}"
              value={currency.value}
              enableDeltaChanges={true}
              selectOnFocus={true}
              disabled={!context.editable || context.lockMoneyChanges}
              class="currency-item currency-{currency.key}"
              placeholder="0"
            />
            <span class="denomination {currency.key}" data-denom={currency.key}>
              {currency.abbr}
            </span>
          </label>
        {/each}
        {#if hasCurrency && context.item.actor}
          <button
            data-item-id={context.item.id}
            type="button"
            tabindex="0"
            class="button button-secondary transfer-currency flex1"
            data-action="transfer-currency"
            aria-label={FoundryAdapter.localize(
              'DND5E.CurrencyManager.Transfer.Label',
            )}
            data-tooltip=""
          >
            <i class="fas fa-person-arrow-up-from-line"></i>
            {FoundryAdapter.localize('DND5E.CurrencyManager.Transfer.Label')}
          </button>
        {/if}
      </div>
    </div>
  {/snippet}
</Sidebar>

<main class="item-content">
  <div
    bind:this={itemNameEl}
    class="item-name-wrapper flex-row extra-small-gap align-items-center"
  >
    <ItemName />
  </div>

  <!-- Header Summary -->
  <div class="item-header-summary">
    <!-- Item Capacity -->
    <div class="item-capacity">
      <i class="fa-solid fa-scale-unbalanced item-capacity-icon text-label-icon"
      ></i>
      <div class="item-capacity-counter">
        <span class="capacity-value text-data">{value}</span>
        <div class="separator">/</div>
        <span class="capacity-max text-data">{max}</span>
        {#if context.capacity.units}
          <span class="capacity-units color-text-lighter">
            {context.capacity.units}
          </span>
        {/if}
      </div>
    </div>

    <ItemPriceSummary item={context.item} />

    <ItemWeightSummary />
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.sheet}
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
