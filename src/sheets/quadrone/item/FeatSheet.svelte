<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import {
    componentWithProps,
    type ComponentWithProps,
  } from 'src/utils/component';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import { isNil } from 'src/utils/data';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  let summarySections = $derived.by(() => {
    let result: ComponentWithProps<any>[] = [];

    if (context.item.hasLimitedUses) {
      result.push(componentWithProps(ItemChargesSummary, {}));
    }

    if (context.item.hasRecharge) {
      result.push(componentWithProps(ItemRechargeSummary, {}));
    }

    return result;
  });

  let subtitle = $derived.by(() => {
    let segments: string[] = [
      context.system.type.label,
      context.labels.featType,
      context.system.requirements,
    ];

    return segments.filter((x) => !isNil(x, '')).join(', ');
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar />

<main class="item-content">
  <div class="sheet-header">
    <div class="identity-info">
      <div
        bind:this={itemNameEl}
        class="item-name-wrapper flex-row extra-small-gap align-items-center"
      >
        <ItemName />
      </div>
      <div class="subtitle">
        {subtitle}
      </div>
    </div>
  </div>

  <!-- Header Summary -->
  {#if summarySections.length}
    <div class="item-header-summary">
      {#each summarySections as summarySection}
        <summarySection.component {...summarySection.props} />
      {/each}
    </div>
  {/if}

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
