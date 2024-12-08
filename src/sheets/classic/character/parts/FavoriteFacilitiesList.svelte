<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type Actor5e,
    type CharacterSheetContext,
    type FacilitySection,
  } from 'src/types/types';
  import ItemName from '../../../../components/item-list/ItemName.svelte';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from '../../../../components/item-list/ItemUseButton.svelte';
  import { getContext, tick } from 'svelte';
  import type { Readable } from 'svelte/store';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import type { Item5e } from 'src/types/item.types';
  import FacilityOrderProgressMeter from './FacilityOrderProgressMeter.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  export let section: FacilitySection;
  export let items: Item5e[];

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  const ordersWidth = '10rem';
  const defendersWidth = '2.5rem';
  const hirelingsWidth = '2.5rem';
  const creaturesWidth = '2.5rem';

  const localize = FoundryAdapter.localize;

  let occupantSummaryTooltip: OccupantSummaryTooltip;

  async function showOccupantSummaryTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
    uuids: string[],
    title: string,
  ) {
    if (!uuids.length) {
      return;
    }

    const occupants: Actor5e[] = [];
    for (const uuid of uuids) {
      occupants.push(await fromUuid(uuid));
    }

    occupantSummaryTooltip.$set({ occupants: occupants, title: title });

    await tick();

    Tooltip.show(event?.currentTarget, occupantSummaryTooltip.getMarkup());
  }
</script>

<div class="hidden">
  <OccupantSummaryTooltip bind:this={occupantSummaryTooltip} />
</div>

<section class="facility-list-section">
  <ItemTable key={section.key}>
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <!-- Name -->
        <ItemTableColumn primary={true}>
          {localize(section.label)}
        </ItemTableColumn>
        <!-- Orders -->
        <ItemTableColumn baseWidth={ordersWidth}>
          {localize('DND5E.FACILITY.FIELDS.order.label')}
        </ItemTableColumn>
        <!-- Defenders -->
        <ItemTableColumn
          baseWidth={defendersWidth}
          title={localize('TIDY5E.Facilities.Defenders.Label')}
        >
          <i class="fas fa-shield"></i>
        </ItemTableColumn>
        <!-- Hirelings -->
        <ItemTableColumn
          baseWidth={hirelingsWidth}
          title={localize('TIDY5E.Facilities.Hirelings.Label')}
        >
          <i class="fas fa-user"></i>
        </ItemTableColumn>
        <!-- Creatures -->
        <ItemTableColumn
          baseWidth={creaturesWidth}
          title={localize('TIDY5E.Facilities.Creatures.Label')}
        >
          <i class="fas fa-horse-head"></i>
        </ItemTableColumn>
      </ItemTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      {#each items as item (item.id)}
        {@const ctx = $context.itemContext[item.id]}
        {@const disabledClass =
          ctx?.chosen?.disabled === true ? 'disabled' : ''}

        <ItemTableRow
          {item}
          cssClass="favorite-facility-row {disabledClass}"
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, item)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: item.uuid,
          }}
          let:toggleSummary
          hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
          favoriteId={ctx.favoriteId}
        >
          <!-- Name -->
          <ItemTableCell primary={true}>
            <ItemUseButton
              disabled={!$context.editable &&
                (!ctx?.chosen?.disabled || FoundryAdapter.userIsGm())}
              {item}
            ></ItemUseButton>
            {#if (ctx.activities?.length ?? 0) > 1}
              <InlineToggleControl entityId={item.id} {inlineToggleService} />
            {/if}
            <ItemName on:toggle={() => toggleSummary($context.actor)} {item}>
              <span
                class="truncate"
                data-tidy-item-name={item.name}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                >{item.name}</span
              >
            </ItemName>
          </ItemTableCell>
          <!-- Orders -->
          <ItemTableCell
            baseWidth={ordersWidth}
            cssClass="justify-content-stretch"
          >
            {@const chosen = ctx?.chosen}

            {#if chosen?.progress?.max || chosen?.executing}
              <FacilityOrderProgressMeter class="flex-1" {chosen}
              ></FacilityOrderProgressMeter>
            {/if}
          </ItemTableCell>
          <!-- Defenders -->
          <ItemTableCell baseWidth={defendersWidth}>
            <div
              on:mouseover={(ev) =>
                showOccupantSummaryTooltip(
                  ev,
                  item.system.defenders.value ?? [],
                  localize('TIDY5E.Facilities.Defenders.Label'),
                )}
              data-tooltip-direction="UP"
            >
              {#if item.system.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && item.system.defenders.max}
                {item.system.defenders.value.length}/{item.system.defenders.max}
              {:else}
                —
              {/if}
            </div>
          </ItemTableCell>
          <!-- Hirelings -->
          <ItemTableCell baseWidth={hirelingsWidth}>
            <div
              on:mouseover={(ev) =>
                showOccupantSummaryTooltip(
                  ev,
                  item.system.hirelings.value ?? [],
                  localize('TIDY5E.Facilities.Hirelings.Label'),
                )}
              data-tooltip-direction="UP"
            >
              {#if item.system.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && item.system.hirelings.max}
                {item.system.hirelings.value.length}/{item.system.hirelings.max}
              {:else}
                —
              {/if}
            </div>
          </ItemTableCell>
          <!-- Creatures -->
          <ItemTableCell baseWidth={creaturesWidth}>
            <div
              on:mouseover={(ev) =>
                showOccupantSummaryTooltip(
                  ev,
                  item.system.trade.creatures.value ?? [],
                  localize('TIDY5E.Facilities.Creatures.Label'),
                )}
              data-tooltip-direction="UP"
            >
              {#if item.system.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && item.system.trade.creatures.max}
                {item.system.trade.creatures.value.length}/{item.system.trade
                  .creatures.max}
              {:else}
                —
              {/if}
            </div>
          </ItemTableCell>
        </ItemTableRow>
        {#if (ctx.activities?.length ?? 0) > 1}
          <InlineActivitiesList
            {item}
            activities={ctx.activities}
            {inlineToggleService}
          />
        {/if}
      {/each}
    </svelte:fragment>
  </ItemTable>
</section>
