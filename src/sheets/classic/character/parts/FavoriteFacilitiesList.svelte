<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e, type FacilitySection } from 'src/types/types';
  import ItemName from '../../../../components/item-list/ItemName.svelte';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from '../../../../components/item-list/ItemUseButton.svelte';
  import { getContext, tick } from 'svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import FacilityOrderProgressMeter from './FacilityOrderProgressMeter.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getThemeV2 } from 'src/theme/theme';

  interface Props {
    section: FacilitySection;
  }

  let { section }: Props = $props();

  let context = $derived(getCharacterSheetContext());

  let itemEntries = $derived(
    section.items.map((item) => ({ item, ctx: context.itemContext[item.id] })),
  );

  const searchResults = getSearchResultsContext();

  const ordersWidth = '10rem';
  const defendersWidth = '2.5rem';
  const hirelingsWidth = '2.5rem';
  const creaturesWidth = '2.5rem';

  const localize = FoundryAdapter.localize;

  let occupantSummaryTooltip: OccupantSummaryTooltip;
</script>

<OccupantSummaryTooltip
  sheetDocument={context.document}
  bind:this={occupantSummaryTooltip}
/>

<section class="facility-list-section">
  <ItemTable key={section.key}>
    {#snippet header()}
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
    {/snippet}
    {#snippet body()}
      {#each itemEntries as { item, ctx } (item.id)}
        {@const disabledClass =
          ctx?.chosen?.disabled === true ? 'disabled' : ''}

        <ItemTableRow
          {item}
          cssClass="favorite-facility-row {disabledClass}"
          onMouseDown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: item.uuid,
          }}
          hidden={!searchResults.show(item.uuid)}
          favoriteId={ctx.favoriteId}
        >
          {#snippet children({ toggleSummary })}
            <!-- Name -->
            <ItemTableCell primary={true}>
              <ItemUseButton
                disabled={!context.editable &&
                  (!ctx?.chosen?.disabled || FoundryAdapter.userIsGm())}
                {item}
              ></ItemUseButton>
              <ItemName onToggle={() => toggleSummary(context.actor)} {item}>
                <span
                  class="truncate flex-1"
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
                onmouseover={(ev) =>
                  occupantSummaryTooltip.tryShow(
                    ev,
                    item.system.defenders.value ?? [],
                    localize('TIDY5E.Facilities.Defenders.Label'),
                  )}
                data-tooltip-direction="UP"
              >
                {#if item.system.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && item.system.defenders.max}
                  {item.system.defenders.value.length}/{item.system.defenders
                    .max}
                {:else}
                  —
                {/if}
              </div>
            </ItemTableCell>
            <!-- Hirelings -->
            <ItemTableCell baseWidth={hirelingsWidth}>
              <div
                onmouseover={(ev) =>
                  occupantSummaryTooltip.tryShow(
                    ev,
                    item.system.hirelings.value ?? [],
                    localize('TIDY5E.Facilities.Hirelings.Label'),
                  )}
                data-tooltip-direction="UP"
              >
                {#if item.system.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && item.system.hirelings.max}
                  {item.system.hirelings.value.length}/{item.system.hirelings
                    .max}
                {:else}
                  —
                {/if}
              </div>
            </ItemTableCell>
            <!-- Creatures -->
            <ItemTableCell baseWidth={creaturesWidth}>
              <div
                onmouseover={(ev) =>
                  occupantSummaryTooltip.tryShow(
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
          {/snippet}
        </ItemTableRow>
      {/each}
    {/snippet}
  </ItemTable>
</section>
