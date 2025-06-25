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
  import { isNil } from 'src/utils/data';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $state('');

  $effect(() => {
    selectedTabId = context.currentTabId;
  });

  let itemNameEl: HTMLElement | undefined = $state();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived(
    [CONFIG.DND5E.toolTypes[context.item.system.type.value]]
      .filter((x) => !isNil(x, ''))
      .join(', '),
  );

  let toolAbilityLabel = $derived(
    CONFIG.DND5E.abilities[context.item.system.ability]?.label,
  );

  let toolPillValue = $derived(
    !isNil(toolAbilityLabel, '')
      ? toolAbilityLabel
      : FoundryAdapter.localize('DND5E.Default'),
  );
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar sectionLabel={'DND5E.Inventory'}>
  {#snippet belowStateSwitches()}
    <div>
      <h4>{localize('TYPES.Item.tool')}</h4>
      <ul class="pills stacked">
        <li class="pill centered">
          <span class="text-normal">
            {localize('DND5E.Ability')}
          </span>
          <span>
            {toolPillValue}
          </span>
        </li>
      </ul>
    </div>
  {/snippet}
</Sidebar>

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
