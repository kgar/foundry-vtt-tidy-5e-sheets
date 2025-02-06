<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import ItemPriceSummary from './parts/header/ItemPriceSummary.svelte';
  import ItemWeightSummary from './parts/header/ItemWeightSummary.svelte';
  import ItemQuantitySummary from './parts/header/ItemQuantitySummary.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $state(CONSTANTS.TAB_CONTAINER_CONTENTS);

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
    {#if context.item.hasLimitedUses}
      <ItemChargesSummary />
    {/if}

    {#if context.item.hasRecharge}
      <ItemRechargeSummary />
    {/if}

    <ItemPriceSummary />

    <ItemWeightSummary />

    <ItemQuantitySummary />
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
