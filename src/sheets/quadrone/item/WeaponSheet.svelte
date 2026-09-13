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
  import { isNil } from 'src/utils/data';
  import { dropzoneClass } from 'src/features/drag-and-drop/drag-and-drop';
  import OccupantSlot from '../shared/OccupantSlot.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  let localize = FoundryAdapter.localize;

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));
  let identified = $derived(context.isIdentified !== false);

  // Hide attack bonuses on unidentified items so magical weapons aren't spoiled..
  let unidentifiedSubtitle = $derived(
    [localize(CONFIG.Item.typeLabels.weapon), context.item.system.type?.label]
      .filter((label) => !isNil(label, ''))
      .join(', '),
  );

  let subtitle = $derived(
    identified || gmEditMode ? context.subtitle : unidentifiedSubtitle,
  );
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
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
              action="assignCrew"
              addLabel={localize('TIDY5E.COMMON.Action.AddNamed', {
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

<main class="item-content">
  <div
    bind:this={itemNameEl}
    class="item-name-wrapper flex-row extra-small-gap align-items-center"
  >
    <ItemName />
  </div>
  <div class="subtitle">{subtitle}</div>

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
