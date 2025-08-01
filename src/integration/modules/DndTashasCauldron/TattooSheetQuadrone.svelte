<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from '../../../sheets/quadrone/item/parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from '../../../sheets/quadrone/item/parts/Sidebar.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemPriceSummary from '../../../sheets/quadrone/item/parts/header/ItemPriceSummary.svelte';
  import ItemWeightSummary from '../../../sheets/quadrone/item/parts/header/ItemWeightSummary.svelte';
  import ItemQuantitySummary from '../../../sheets/quadrone/item/parts/header/ItemQuantitySummary.svelte';
  import ItemChargesSummary from '../../../sheets/quadrone/item/parts/header/ItemChargesSummary.svelte';
  import ItemName from '../../../sheets/quadrone/item/parts/header/ItemName.svelte';
  import ItemRechargeSummary from '../../../sheets/quadrone/item/parts/header/ItemRechargeSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $state('');

  $effect(() => {
    selectedTabId = context.currentTabId;
  });

  let itemNameEl: HTMLElement | undefined = $state();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived.by(() => {
    let result: string[] = [
      localize(CONFIG.TCOE.tattooTypes[context.source.type.value]?.label),
    ];

    if (context.system.isSpellwrought) {
      result.push(CONFIG.DND5E.spellLevels[context.source.level]);
    }

    return result.join(', ');
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar includeSidebarProperties={false} />

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
    sheet={context.sheet}
    tabContext={{ context, item: context.item }}
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
