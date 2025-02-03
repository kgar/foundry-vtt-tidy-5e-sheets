<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import Sidebar from '../item/parts/Sidebar.svelte';
  import ItemNameHeaderOrchestrator from '../item/parts/ItemNameHeaderOrchestrator.svelte';

  let context = $derived(getContainerSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let denomination = $derived(
    CONFIG.DND5E.currencies[context.system.price.denomination],
  );

  let itemValueText = $derived(
    FoundryAdapter.formatNumber(context.system.price?.value),
  );

  let itemNameEl: HTMLElement | undefined = $state();

  let holdsMarkup = $derived.by(() => {
    return localize('TIDY5E.Containers.HoldsNumberUnits', {
      holdsElementStart: '<span class="text-secondary fw-normal">',
      holdsElementEnd: '</span>',
      numberElementStart: '<span>',
      numberElementEnd: '</span>',
      number: context.capacity.max,
      unitsElementStart: '<span class="text-secondary fw-normal">',
      unitsElementEnd: '</span>',
      units: context.capacity.units,
    });
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet itemSpecificSnippet()}
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
        <a
          class="button icon-button currency-conversion"
          class:disabled={!context.editable}
          onclick={() =>
            context.owner &&
            new dnd5e.applications.CurrencyManager(context.document).render(
              true,
            )}
          title={localize('DND5E.CurrencyManager.Title')}
        >
          <i class="fas fa-database"></i>
        </a>
      </h4>
      <div class="currencies">
        {#each context.currencies as currency (currency.key)}
          <label class="input-group">
            <i class="currency {currency.key}" aria-label={currency.key}></i>
            <TextInput
              document={context.document}
              field="system.currency.{currency.key}"
              id="{context.document.id}-system.currency.{currency.key}"
              value={currency.value}
              allowDeltaChanges={true}
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
    <!-- Name -->
    {#if context.unlocked}
      <TextInput
        field="name"
        document={context.item}
        value={context.item.name}
        class="document-name"
      />
    {:else}
      <div class="document-name">{context.item.name ?? ''}</div>
    {/if}
  </div>

  <!-- Header Summary -->
  <div class="item-header-summary">
    <!-- Value -->
    <div class="item-value">
      <!-- Currency Image -->
      <i
        class="currency {context.system?.price?.denomination ?? ''}"
        aria-label={denomination?.label ?? ''}
      ></i>
      <span class="item-value-number">
        <!-- Value Text -->
        <span class="text-default">
          {itemValueText}
        </span>
        <!-- Denom -->
        <span class="item-value-denomination text-lighter">
          {denomination?.abbreviation ?? ''}
        </span>
      </span>
    </div>

    <div class="item-header-summary-separator" role="presentation"></div>

    <!-- Weight -->
    <div class="item-weight">
      <i class="fas fa-weight-hanging item-weight-icon text-lightest"></i>
      <span class="item-weight-value">
        {context.system.weight?.value}
      </span>
    </div>

    <!-- <div class="item-header-summary-separator" role="presentation"></div> -->

    <!-- Quantity -->
    <!-- <div class="item-quantity">
      <span class="item-quantity-label text-lighter">
        {localize('DND5E.Quantity')}
      </span>
      <span class="item-quantity-value">
        {context.system.quantity}
      </span>
    </div> -->
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.item.sheet}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
