<script lang="ts">
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
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);
  let itemNameEl: HTMLElement | undefined = $state();

  const lootTypeConfig = $derived(
    CONFIG.DND5E.lootTypes[context.system.type.value],
  );

  const typeLabel = $derived(
    lootTypeConfig?.label ?? context.system.type.value,
  );

  const subtypeLabel = $derived(
    lootTypeConfig?.subtypes?.[context.system.type.subtype] ??
      context.system.type.subtype,
  );

  const subtitle = $derived(
    [typeLabel, subtypeLabel].filter((x) => !isNil(x, '')).join(', '),
  );
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4>{localize('TYPES.Item.loot')}</h4>
      <ul class="pills stacked">
        <li>
          <!--svelte-ignore a11y_missing_attribute-->
          <a
            role="button"
            tabindex="0"
            class="pill interactive centered wrapped copy-to-clipboard"
            data-action="copyValue"
            data-value={context.item.system.identifier}
            aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
          >
            <span class="text-normal">
              {localize('DND5E.Identifier')}
            </span>
            <span class="hyphens-auto">
              {context.item.system.identifier}
            </span>
          </a>
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
      <div class="subtitle">{subtitle}</div>
    </div>

    <!-- Header Summary -->
    <div class="item-header-summary">
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
