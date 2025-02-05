<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

  let denomination = $derived(
    CONFIG.DND5E.currencies[context.system.price.denomination],
  );

  let itemValueText = $derived(
    FoundryAdapter.formatNumber(context.system.price?.value),
  );

  let itemNameEl: HTMLElement | undefined = $state();
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar />

<main class="item-content">
  <div
    bind:this={itemNameEl}
    class="item-name-wrapper flex-row extra-small-gap align-items-center"
  >
    <!-- Name -->
    {#if context.unlocked}
      <TextInputQuadrone
        field="name"
        document={context.item}
        value={context.name.editable}
        class="document-name"
      />
    {:else}
      <div class="document-name">{context.item.name}</div>
    {/if}
  </div>

  <div class="subtitle">
    {context.subtitle}
  </div>

  <!-- Header Summary -->
  <div class="item-header-summary">
    <!-- Charges -->
    <!-- TODO: Ensure the limited uses code is centrally shared, and let all the consumers pull from that central location, using the item itself to derive the limited uses. -->
    <!-- TODO: Support Recharge UI -->
    <!-- TODO: CachedFor/LinkedUses support -->

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

    <div class="item-header-summary-separator" role="presentation"></div>

    <!-- Quantity -->
    <div class="item-quantity">
      <span class="item-quantity-label text-lighter">
        {localize('DND5E.Quantity')}
      </span>
      <span class="item-quantity-value">
        {context.system.quantity}
      </span>
    </div>
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
