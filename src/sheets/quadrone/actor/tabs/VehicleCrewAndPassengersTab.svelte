<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { VehicleMemberColumnRuntime } from 'src/runtime/tables/VehicleCrewMemberColumnRuntime';
  import { CONSTANTS } from 'src/constants';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import SectionActionsColumnHeader from '../../item/columns/SectionActionsColumnHeader.svelte';
  import TableRowActions from '../../../../components/table-quadrone/parts/TableRowActions.svelte';
  import type { ActorRowActionPropsData } from 'src/types/types';

  let context = $derived(getVehicleSheetQuadroneContext());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const localize = FoundryAdapter.localize;

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }
</script>

<div class="tab-content">
  <div class="sheet-pins" data-tidy-sheet-part="sheet-pins">
    <div
      class={[
        'sheet-pin',
        {
          'pin-warning':
            context.system.crew.value.length > context.system.crew.max,
        },
      ]}
      data-area={CONSTANTS.SECTION_TYPE_CREW}
    >
      <div class="pin-details">
        <div class="pin-name-container">
          <span
            class="font-label-medium pin-name truncate flex1"
            data-tooltip="DND5E.VEHICLE.FIELDS.crew.max.label"
          >
            {localize('DND5E.VEHICLE.FIELDS.crew.max.label')}
          </span>
        </div>
        <span class="inline-uses color-text-default">
          <span
            class={[
              'uses-value',
              { diminished: context.system.crew.value.length < 1 },
            ]}
          >
            {context.system.crew.value.length}
          </span>
          <span class="divider color-text-gold-emphasis">/</span>
          <TextInputQuadrone
            class={[
              'uses-max',
              { uninput: !context.unlocked },
              { diminished: context.system.crew.max < 1 },
            ]}
            document={context.document}
            field="system.crew.max"
            value={context.system.crew.max}
            placeholder="—"
          />
        </span>
        {#if context.crewBrokenLinks.length && context.editable}
          <a data-action="removeBrokenLinks">
            <i class="fa-solid fa-link-broken"></i>
            {localize('TIDY5E.Vehicle.RemoveBrokenLinks', {
              value: context.crewBrokenLinks.length,
            })}
          </a>
        {/if}
      </div>
      {#if context.system.crew.max > 0}
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          role="button"
          tabindex="0"
          class="button button-icon-only button-borderless highlight-on-hover"
          data-action="browseActors"
          aria-label={FoundryAdapter.localize('TIDY5E.CompendiumBrowser', {
            name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
          })}
          data-tooltip=""
        >
          <i class="fas fa-user-magnifying-glass"></i>
        </a>
      {/if}
    </div>

    <div
      class={[
        'sheet-pin',
        {
          'pin-warning':
            context.system.passengers.value.length >
            context.system.passengers.max,
        },
      ]}
      data-area={CONSTANTS.SECTION_TYPE_PASSENGERS}
    >
      <div class="pin-details">
        <div class="pin-name-container">
          <span
            class="font-label-medium pin-name truncate flex1"
            data-tooltip="DND5E.VEHICLE.FIELDS.passengers.max.label"
          >
            {localize('DND5E.VEHICLE.FIELDS.passengers.max.label')}
          </span>
        </div>
        <span class="inline-uses color-text-default">
          <span
            class={[
              'uses-value',
              { diminished: context.system.passengers.value.length < 1 },
            ]}
          >
            {context.system.passengers.value.length}
          </span>
          <span class="divider color-text-gold-emphasis">/</span>
          <TextInputQuadrone
            class={[
              'uses-max',
              { uninput: !context.unlocked },
              { diminished: context.system.passengers.max < 1 },
            ]}
            document={context.document}
            field="system.passengers.max"
            value={context.system.passengers.max}
            placeholder="—"
          />
        </span>
        {#if context.passengerBrokenLinks.length && context.editable}
          <a data-action="removeBrokenLinks">
            <i class="fa-solid fa-link-broken"></i>
            {localize('TIDY5E.Vehicle.RemoveBrokenLinks', {
              value: context.passengerBrokenLinks.length,
            })}
          </a>
        {/if}
      </div>
      {#if context.system.passengers.max > 0}
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          role="button"
          tabindex="0"
          class="button button-icon-only button-borderless highlight-on-hover"
          data-action="browseActors"
          aria-label={FoundryAdapter.localize('TIDY5E.CompendiumBrowser', {
            name: FoundryAdapter.localize(
              'TIDY5E.Vehicle.Member.Passenger.Label',
            ),
          })}
          data-tooltip=""
        >
          <i class="fas fa-user-magnifying-glass"></i>
        </a>
      {/if}
    </div>
  </div>

  <div class="tidy-table-container" {@attach observeResize(onResize)}>
    {#each context.crewAndPassengers as section (section.key)}
      {#if section.members.length || section.showEmptyState}
        {const rowActionInfo = $derived(
          TableRowActionsRuntime.getRowActionWidthInfo(
            section.members,
            (entry) => entry.rowActions,
          ),
        )}

        {const hiddenColumns = $derived(
          VehicleMemberColumnRuntime.determineHiddenColumns(
            sectionsInlineWidth - rowActionInfo.widthPx,
            section.columns,
          ),
        )}
        <TidyTable key={section.key} data-area={section.type}>
          {#snippet header(expanded)}
            <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
              <TidyTableHeaderCell primary={true} class="header-label-cell">
                <h3>
                  {localize(section.label)}
                </h3>
                {#if section.showCount}
                  <span class="table-header-count"
                    >{section.members.length}</span
                  >
                {/if}
              </TidyTableHeaderCell>

              <TidyTableCustomHeaderCells
                {context}
                {hiddenColumns}
                {section}
                {expanded}
              />

              <TidyTableHeaderCell
                class="header-cell-actions"
                columnWidth="{rowActionInfo.widthRems}rem"
                data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
              >
                <SectionActionsColumnHeader
                  {section}
                  sheetDocument={context.document}
                  maxRowActionsCount={rowActionInfo.maxRowActionsCount}
                />
              </TidyTableHeaderCell>
            </TidyTableHeaderRow>
          {/snippet}
          {#snippet body()}
            {#each section.members as member}
              {const assignedItemId = $derived(
                'assignedTo' in member ? member.assignedTo?.id : undefined,
              )}
              <TidyTableRow
                rowContainerAttributes={{
                  ['data-assigned-item-id']: assignedItemId,
                  ['data-context-menu']:
                    CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER,
                  ['data-uuid']: member.actor.uuid,
                  ['data-quantity']: member.quantity,
                }}
                rowAttributes={{
                  ['data-tidy-draggable']: true,
                }}
              >
                <img
                  class="item-image"
                  alt={member.actor.name}
                  src={member.actor.img}
                />

                <TidyTableCell primary={true} class="item-label text-cell">
                  <a
                    class="item-name"
                    role="button"
                    data-keyboard-focus
                    tabindex="0"
                    data-action="showDocument"
                    data-uuid={member.actor.uuid}
                  >
                    <span class="cell-text">
                      <span class="cell-name">{member.actor.name}</span>
                      <span class="cell-context">{member.subtitle}</span>
                    </span>
                  </a>
                </TidyTableCell>
                <TidyTableCustomCells
                  {context}
                  ctx={member}
                  entry={member.actor}
                  {hiddenColumns}
                  {section}
                />

                <TidyTableCell
                  columnWidth="{rowActionInfo.widthRems}rem"
                  class="tidy-table-actions"
                  attributes={{
                    ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
                  }}
                >
                  {const data = $derived<ActorRowActionPropsData>({
                    actor: member.actor,
                    ctx: member,
                  })}
                  <TableRowActions rowActions={member.rowActions} {data} />
                </TidyTableCell>
              </TidyTableRow>
            {:else}
              {#if section.type === 'crew'}
                {@render UnassignedNoCrewView()}
              {:else if section.type === 'passengers'}
                {@render UnassignedNoPassengerView()}
              {/if}
            {/each}
          {/snippet}
        </TidyTable>
      {/if}
    {/each}

    {#snippet UnassignedNoCrewView()}
      <div class="inventory-empty empty-state-container">
        <button
          type="button"
          class="button button-tertiary"
          data-action="browseActors"
        >
          <i class="fas fa-plus"></i>
          {localize('TIDY5E.Vehicle.Unassigned.EmptyState')}
        </button>
      </div>
    {/snippet}

    {#snippet UnassignedNoPassengerView()}
      <div class="inventory-empty empty-state-container">
        <button
          type="button"
          class="button button-tertiary"
          data-action="browseActors"
        >
          <i class="fas fa-plus"></i>
          {localize('TIDY5E.Vehicle.Passenger.EmptyState')}
        </button>
      </div>
    {/snippet}
  </div>
</div>
