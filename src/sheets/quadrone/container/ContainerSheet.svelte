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

  let context = $derived(getContainerSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let itemNameEl: HTMLElement | undefined = $state();

  let holdsMarkup = $derived.by(() => {
    return localize('TIDY5E.Containers.HoldsNumberUnits', {
      holdsElementStart: '<span class="color-text-lighter fw-normal">',
      holdsElementEnd: '</span>',
      numberElementStart: '<span>',
      numberElementEnd: '</span>',
      number: context.capacity.max,
      unitsElementStart: '<span class="color-text-lighter fw-normal">',
      unitsElementEnd: '</span>',
      units: context.capacity.units ?? '',
    });
  });

  function formatWeight(value: number | undefined): string {
    const rounded = Math.round((value ?? 0) * 100) / 100;
    return rounded.toFixed(2).replace(/\.0+$/, '').replace(/\.$/, '');
  }
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
          <a
            class="button button-icon-only currency-conversion"
            class:disabled={!context.editable}
            onclick={() =>
              context.owner &&
              new dnd5e.applications.CurrencyManager({
                document: context.document,
              }).render(true)}
            data-tooltip="DND5E.CurrencyManager.Title"
          >
            <i class="fas fa-database"></i>
          </a>
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
        <span class="capacity-value text-data">{formatWeight(context.capacity.value)}</span>
        <div class="separator">/</div>
        <span class="capacity-max text-data">{formatWeight(context.capacity.max)}</span>
        <span class="color-text-lighter">{context.capacity.units}</span>
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
