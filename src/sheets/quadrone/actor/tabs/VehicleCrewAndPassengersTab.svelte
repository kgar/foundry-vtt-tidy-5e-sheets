<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import type { CrewSection, PassengerSection } from 'src/types/types';
  import type { Snippet } from 'svelte';
  import { VehicleMemberColumnRuntime } from 'src/runtime/tables/VehicleCrewMemberColumnRuntime';
  import { CONSTANTS } from 'src/constants';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { foundryCoreSettings } from 'src/settings/settings.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import SectionActionsColumnHeader from '../../item/columns/SectionActionsColumnHeader.svelte';
  import DocumentActionsColumn from '../../item/columns/DocumentActionsColumn.svelte';

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

  const noCrew = $derived(
    !context.crew.assigned.members.length &&
      !context.crew.unassigned.members.length,
  );
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
      data-area="crew"
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
      data-area="passengers"
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
    {@render CrewPassengerTable(
      context.crew.unassigned,
      false,
      UnassignedNoCrewView,
    )}

    {#snippet UnassignedNoCrewView(section: CrewSection | PassengerSection)}
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

    {@render CrewPassengerTable(context.crew.assigned, true)}

    {@render CrewPassengerTable(
      context.passengers,
      false,
      UnassignedNoPassengerView,
    )}

    {#snippet UnassignedNoPassengerView(
      section: CrewSection | PassengerSection,
    )}
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

  {#snippet CrewPassengerTable(
    section: CrewSection | PassengerSection,
    showCount: boolean,
    noMembersView?: Snippet<[CrewSection | PassengerSection]>,
  )}
    {#if section.members.length || noMembersView}
      <!-- TODO: Collapse all this common content down into a single derived call. -->
      {const maxRowActionsCount = $derived(
        Math.max(...section.members.map((member) => member.rowActions.length)),
      )}

      {const rowActionsColumnWidthRems = $derived(
        TableRowActionsRuntime.calculateRowActionWidthRems(maxRowActionsCount),
      )}

      {const rowActionsColumnWidthPx = $derived(
        rowActionsColumnWidthRems * foundryCoreSettings.value.fontSizePx,
      )}

      {const hiddenColumns = $derived(
        VehicleMemberColumnRuntime.determineHiddenColumnsV2(
          sectionsInlineWidth - rowActionsColumnWidthPx,
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
              {#if showCount}
                <span class="table-header-count">{section.members.length}</span>
              {/if}
            </TidyTableHeaderCell>

            <TidyTableCustomHeaderCells
              columnsV2={section.columns}
              {context}
              {hiddenColumns}
              {section}
              {expanded}
            />

            <TidyTableHeaderCell
              class="header-cell-actions"
              columnWidth="{rowActionsColumnWidthRems}rem"
              data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
            >
              <SectionActionsColumnHeader
                {section}
                sheetContext={context}
                sheetDocument={context.document}
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
                columnsV2={section.columns}
                {context}
                ctx={member}
                entry={member.actor}
                {hiddenColumns}
                {section}
              />

              <TidyTableCell
                columnWidth="{rowActionsColumnWidthRems}rem"
                class="tidy-table-actions"
                attributes={{
                  ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
                }}
              >
                <DocumentActionsColumn
                  {section}
                  rowDocument={member.actor}
                  rowContext={member}
                />
              </TidyTableCell>
            </TidyTableRow>
          {:else}
            {@render noMembersView?.(section)}
          {/each}
          {#if noCrew}
            <!-- Unassigned Empty State -->
          {/if}
        {/snippet}
      </TidyTable>
    {/if}
  {/snippet}
</div>
