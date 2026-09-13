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
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { isNil } from 'src/utils/data';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import type { Snippet } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import OccupantSlot from 'src/sheets/quadrone/shared/OccupantSlot.svelte';
  import { dropzoneClass } from 'src/features/drag-and-drop/drag-and-drop';

  let context = $derived(getItemSheetContextQuadrone());

  let localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  let subtitle = $derived(
    [
      context.item.system.type?.label,
      context.sheet._shouldShowAc() ? context.labels.armor : null,
    ]
      .filter((x) => !isNil(x, ''))
      .join(', '),
  );

  let armorPills = $derived.by(() => {
    if (!context.sheet._shouldShowAc()) {
      return [];
    }

    let result: Snippet[] = [];

    result.push(acPill);

    result.push(dexModPill);

    if (!isNil(context.source.strength, '')) {
      result.push(strengthRequirementPill);
    }

    return result;
  });
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    {#if armorPills.length}
      <div>
        <h4>{localize('DND5E.Armor')}</h4>
        <ul class="pills stacked">
          {#each armorPills as pill}
            {@render pill()}
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Crew Management -->
    {#if context.vehicleCrew?.length}
      <div
        data-crew-list
        data-item-id={context.item.id}
        {@attach dropzoneClass('occupant-dropzone')}
        class="occupants-list"
      >
        <h4>
          {localize('DND5E.VEHICLE.Crew.Label')}
        </h4>
        <ul class="occupants crew unlist">
          {#each context.vehicleCrew as { actor, uuid }}
            <OccupantSlot
              occupant={actor}
              {uuid}
              type="crew"
              iconClass="far fa-user"
              contextMenuType={CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER}
              addAction="assignCrew"
              addLabel={localize('TIDY5E.AddSpecific', {
                name: localize('DND5E.VEHICLE.Crew.Label'),
              })}
              attributes={{ 'data-uuid': uuid }}
            />
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}
</Sidebar>

{#snippet acPill()}
  <li class="pill centered">
    <span class="text-normal">
      {localize('DND5E.AC')}
    </span>
    <span>
      {context.source.armor.value}
    </span>
  </li>
{/snippet}
{#snippet dexModPill()}
  <li class="pill centered">
    <span class="text-normal">
      {localize('DND5E.ItemEquipmentDexModAbbr')}
    </span>
    <span>
      {context.source.armor.dex ?? '∞'}
    </span>
  </li>
{/snippet}
{#snippet strengthRequirementPill()}
  <li class="pill centered">
    <span class="text-normal">
      {localize('DND5E.AbilityStr')}
    </span>
    <span>
      {context.source.strength}
    </span>
  </li>
{/snippet}

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
