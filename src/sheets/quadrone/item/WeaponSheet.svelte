<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import ItemPriceSummary from './parts/header/ItemPriceSummary.svelte';
  import ItemWeightSummary from './parts/header/ItemWeightSummary.svelte';
  import ItemQuantitySummary from './parts/header/ItemQuantitySummary.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ItemContext } from 'src/features/item/ItemContext';
  import { formatAsModifier } from 'src/utils/formatting';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  let localize = FoundryAdapter.localize;

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));

  // Recreate the system subtitle so we can hide bonuses that spoil magical unidentified items.
  let subtitleSegments = $derived.by(() => {
    let segments = [localize(CONFIG.Item.typeLabels.weapon)];

    if (context.item.system.type?.label) {
      segments.push(context.item.system.type.label);
    }

    if (context.isIdentified || gmEditMode) {
      const toHit = formatAsModifier(ItemContext.getToHit(context.item) ?? '0');

      segments.push(
        localize('EDITOR.DND5E.Inline.AttackLong', {
          formula: toHit,
        }),
      );
    }

    return segments;
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar />

<main class="item-content">
  <div
    bind:this={itemNameEl}
    class="item-name-wrapper flex-row extra-small-gap align-items-center"
  >
    <ItemName />
  </div>

  <div class="subtitle">
    {#each subtitleSegments as segment, i (segment)}
      {#if i > 0}
        <div class="divider-dot"></div>
      {/if}
      <span class="font-label-medium color-text-gold">{segment}</span>
    {/each}
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
