<script lang="ts">
  import ItemNameHeaderOrchestrator from 'src/sheets/quadrone/item/parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from 'src/sheets/quadrone/item/parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { isNil } from 'src/utils/data';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import ItemChargesSummary from 'src/sheets/quadrone/item/parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from 'src/sheets/quadrone/item/parts/header/ItemRechargeSummary.svelte';
  import ItemName from 'src/sheets/quadrone/item/parts/header/ItemName.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();
  
    let powerSpecialtiesConfig = $derived(
      CONFIG.MCDM.specialties[context.system.specialty],
    );

  let subtitle = $derived(
    [context.labels.level, context.labels.school]
      .filter((x) => !isNil(x))
      .join(', '),
  );

  let itemHeaderSummaries = $derived.by(() => {
    let result = [];
    if (context.item.hasLimitedUses) {
      result.push(chargesSummaryItem);
    }

    if (context.item.hasRecharge) {
      result.push(rechargeSummaryItem);
    }

    return result;
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar includeSidebarProperties={false}>
  {#snippet belowStateSwitches()}
    <div>
      <h4>
        {localize('TYPES.Item.mcdm-class-bundle.power')}
      </h4>
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
    {#if !context.unlocked}
      <div class="common-fields">
        {#if powerSpecialtiesConfig}
          <div
            class="school"
            aria-label={powerSpecialtiesConfig.label}
            data-tooltip={powerSpecialtiesConfig.label}
          >
            <Dnd5eIcon src={powerSpecialtiesConfig.icon} />
          </div>
        {/if}
      </div>
    {/if}

    {#if itemHeaderSummaries.length}
      <div class="item-header-summary">
        {#each itemHeaderSummaries as summaryItem}
          {@render summaryItem()}
        {/each}
      </div>
    {/if}
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

{#snippet chargesSummaryItem()}
  <ItemChargesSummary />
{/snippet}
{#snippet rechargeSummaryItem()}
  <ItemRechargeSummary />
{/snippet}
