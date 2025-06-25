<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemPriceSummary from './parts/header/ItemPriceSummary.svelte';
  import ItemWeightSummary from './parts/header/ItemWeightSummary.svelte';
  import ItemQuantitySummary from './parts/header/ItemQuantitySummary.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import { isNil } from 'src/utils/data';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $state('');

  $effect(() => {
    selectedTabId = context.currentTabId;
  });

  let itemNameEl: HTMLElement | undefined = $state();

  let consumableTypeConfig = $derived(
    CONFIG.DND5E.consumableTypes[context.system.type.value],
  );

  let typeLabel = $derived(
    consumableTypeConfig?.label ?? context.system.type.value,
  );

  let subtypeLabel = $derived(
    consumableTypeConfig?.subtypes?.[context.system.type.subtype] ??
      context.system.type.subtype,
  );

  let subtitle = $derived(
    [typeLabel, subtypeLabel].filter((x) => !isNil(x, '')).join(', '),
  );
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar sectionLabel={'DND5E.Inventory'} />

<main class="item-content">
  <div class="sheet-header">
    <div class="identity-info">
      <div
        bind:this={itemNameEl}
        class="item-name-wrapper flex-row extra-small-gap align-items-center"
      >
        <ItemName />
      </div>
      <div class="subtitle">{subtitle}</div>
    </div>

    <!-- Header Summary -->
    <div class="item-header-summary">
      {#if context.item.hasLimitedUses}
        <ItemChargesSummary />
      {/if}

      {#if context.item.hasRecharge}
        <ItemRechargeSummary />
      {/if}

      <ItemPriceSummary item={context.item} />
      <ItemWeightSummary />
      <ItemQuantitySummary />
    </div>
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.item.sheet}
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
