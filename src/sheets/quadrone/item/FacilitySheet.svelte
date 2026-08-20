<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { isNil } from 'src/utils/data';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemChargesSummary from './parts/header/ItemChargesSummary.svelte';
  import ItemRechargeSummary from './parts/header/ItemRechargeSummary.svelte';
  import {
    componentWithProps,
    type ComponentWithProps,
  } from 'src/utils/component';
  import { getTidyFacilityIcon } from 'src/features/facility/facility';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { setContext, type Snippet } from 'svelte';
  import OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';
  import FacilityOccupantQuadrone from '../actor/character-parts/bastion/FacilityOccupantQuadrone.svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { dropzoneClass } from 'src/features/drag-and-drop/drag-and-drop';

  let context = $derived(getItemSheetContextQuadrone());

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  let localize = FoundryAdapter.localize;

  let subtitle = $derived.by(() => {
    let result: string[] = [
      context.item.system.type.label,
      CONFIG.DND5E.facilities.sizes[context.item.system.size].label,
      localize('DND5E.FACILITY.Squares', {
        squares: context.system.squares,
      }),
    ];

    return result.filter((x) => !isNil(x, '')).join(', ');
  });

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

  let facilitySidebarPills = $derived.by(() => {
    let result: Snippet[] = [];

    if (!isNil(context.system.hirelings.max)) {
      result.push(hirelingsPill);
    }

    if (!isNil(context.system.defenders.max)) {
      result.push(defendersPill);
    }

    return result;
  });

  let effectiveOrderValue = $derived(context.system.progress.value ?? 0);
  let effectiveOrderMax = $derived(context.system.progress.max ?? 0);
  let icon = $derived(getTidyFacilityIcon(context.system.progress.order));

  let facilityIsDisabled = $derived(context.system.disabled === true);

  let occupantSummaryTooltip: OccupantSummaryTooltip;

  let hoveredFacilityOccupant = $state<Ref<string>>({
    value: '',
  });

  setContext<Ref<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
    hoveredFacilityOccupant,
  );
</script>

<OccupantSummaryTooltip
  bind:this={occupantSummaryTooltip}
  sheetDocument={context.document}
/>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    {#if !isNil(context.system.progress?.order, '') && effectiveOrderMax > 0}
      {const pct = $derived((effectiveOrderValue / effectiveOrderMax) * 100)}
      <div>
        <h4>
          {#if icon?.type === 'fa-icon-class'}
            <i class={icon.className}></i>
          {:else if icon?.type === 'dnd5e-icon'}
            <Dnd5eIcon src={icon.src}></Dnd5eIcon>
          {/if}
          <span class="text-normal">
            {CONFIG.DND5E.facilities.orders[context.system.progress.order]
              ?.label ?? context.system.progress.order}
          </span>
        </h4>
        <ul class="pills stacked">
          <li>
            <span
              class={[
                'pill meter progress facility theme-dark',
                {
                  empty: effectiveOrderValue === 0,
                  disabled: facilityIsDisabled,
                },
              ]}
              role="meter"
              aria-label={localize('DND5E.CONTAINER.FIELDS.capacity.label')}
              aria-valuemin="0"
              aria-valuenow={pct}
              aria-valuetext={effectiveOrderValue.toString()}
              aria-valuemax={effectiveOrderMax}
              style="--bar-percentage: {pct.toFixed(0)}%;"
            >
              <span class="label">
                <span class="value font-weight-label"
                  >{context.system.progress.value ?? 0}</span
                >
                <span class="separator">/</span>
                <span class="max color-text-default"
                  >{context.system.progress.max ?? 0}</span
                >
              </span>
            </span>
          </li>
          {#if !!context.system.craft && ['craft', 'harvest'].includes(context.system.progress.order)}
            <li>
              <a
                class={[
                  'pill interactive wrapped',
                  { disabled: facilityIsDisabled },
                ]}
                data-action="showDocument"
                data-uuid={context.system.craft.item}
              >
                {#if !isNil(context.system.craft.item, '')}
                  {#await fromUuid(context.system.craft.item) then item}
                    <span class="font-weight-label">{item?.name}</span>
                  {/await}
                {/if}
                <span>
                  <i class="fa-solid fa-xmark text-normal separator"></i>
                  <span class="font-weight-label"
                    >{context.system.craft.quantity}</span
                  >
                </span>
              </a>
            </li>
          {/if}
        </ul>
      </div>
    {/if}
    {#if facilitySidebarPills.length}
      <div>
        <h4>
          {localize('TYPES.Item.facility')}
        </h4>
        <ul class="pills stacked">
          {#each facilitySidebarPills as pill}
            {@render pill()}
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Hireling Management -->
    {#if context.document.actor && context.facilityContext?.hirelings.length}
      <div
        data-prop="system.hirelings"
        data-facility-type="hireling"
        {@attach dropzoneClass('occupant-dropzone')}
        data-item-id={context.item.id}
        data-facility-id={context.item.id}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
        class="facility-occupants"
      >
        <h4>
          {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
        </h4>
        <ul class="occupants hirelings unlist">
          {#each context.facilityContext.hirelings as { actor, uuid }, index}
            <FacilityOccupantQuadrone
              occupant={actor}
              {index}
              type="hireling"
              iconClass="far fa-user"
              facilityId={context.facilityContext.id}
              facilityName={context.facilityContext.name}
              {uuid}
            ></FacilityOccupantQuadrone>
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Defender Management -->
    {#if context.document.actor && context.facilityContext?.defenders.length}
      <div
        data-prop="system.defenders"
        data-facility-type="defender"
        {@attach dropzoneClass('occupant-dropzone')}
        data-item-id={context.item.id}
        data-facility-id={context.item.id}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
        class="facility-occupants"
      >
        <h4>
          {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
        </h4>
        <ul class="occupants defenders unlist">
          {#each context.facilityContext.defenders as { actor, uuid }, index}
            <FacilityOccupantQuadrone
              occupant={actor}
              {index}
              type="defender"
              iconClass="far fa-shield"
              facilityId={context.facilityContext.id}
              facilityName={context.facilityContext.name}
              {uuid}
            ></FacilityOccupantQuadrone>
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Creature Management -->
    {#if context.document.actor && context.facilityContext?.creatures.length}
      <div
        data-prop="system.creature"
        data-facility-type="creature"
        {@attach dropzoneClass('occupant-dropzone')}
        data-item-id={context.item.id}
        data-facility-id={context.item.id}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
        class="facility-occupants"
      >
        <h4>
          {localize('TIDY5E.Facilities.Creatures.Label')}
        </h4>
        <ul class="occupants creatures unlist" data-prop="system.trade.creatures">
          {#each context.facilityContext.creatures as { actor, uuid }, index}
            <FacilityOccupantQuadrone
              occupant={actor}
              {index}
              type="creature"
              iconClass="far fa-horse-head"
              facilityId={context.facilityContext.id}
              facilityName={context.facilityContext.name}
              {uuid}
            ></FacilityOccupantQuadrone>
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}
</Sidebar>

{#snippet hirelingsPill()}
  <li>
    <span
      class="pill centered"
      onmouseover={(ev) =>
        occupantSummaryTooltip.tryShow(
          ev,
          Array.from(context.item.system.hirelings.value ?? []),
          localize('TIDY5E.Facilities.Hirelings.Label'),
        )}
    >
      <span class="text-normal">
        {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
      </span>
      <span>
        <span>
          {context.system.hirelings.value?.length ?? 0}
        </span>
        <span class="separator">/</span>
        <span>
          {context.system.hirelings.max}
        </span>
      </span>
    </span>
  </li>
{/snippet}
{#snippet defendersPill()}
  <li>
    <span
      class="pill centered"
      onmouseover={(ev) =>
        occupantSummaryTooltip.tryShow(
          ev,
          Array.from(context.item.system.defenders.value ?? []),
          localize('TIDY5E.Facilities.Defenders.Label'),
        )}
    >
      <span class="text-normal">
        {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
      </span>
      <span>
        <span>
          {context.system.defenders.value?.length ?? 0}
        </span>
        <span class="separator">/</span>
        <span>
          {context.system.defenders.max}
        </span>
      </span>
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
