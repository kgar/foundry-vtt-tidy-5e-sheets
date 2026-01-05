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
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { VehicleMemberColumnRuntime } from 'src/runtime/tables/VehicleCrewMemberColumnRuntime';
  import { CONSTANTS } from 'src/constants';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getVehicleSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);
    return () => {
      observer.disconnect();
    };
  });

  const noCrew = $derived(
    !context.crew.assigned.members.length &&
      !context.crew.unassigned.members.length,
  );
</script>

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
          name: FoundryAdapter.localize('TIDY5E.Vehicle.Member.Crew.Label'),
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

<div class="tidy-table-container" bind:this={sectionsContainer}>
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

  {#snippet UnassignedNoPassengerView(section: CrewSection | PassengerSection)}
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
    {@const columns = new ColumnsLoadout(
      VehicleMemberColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: context.document.type,
        tabId: CONSTANTS.TAB_VEHICLE_CREW_AND_PASSENGERS,
        sectionKey: section.key,
        rowActions: section.rowActions,
        section: section,
        sheetDocument: context.document,
      }),
    )}
    {@const hiddenColumns = VehicleMemberColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth,
      columns,
    )}
    <TidyTable key={section.key} data-area={section.type}>
      {#snippet header(expanded)}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            {#if showCount}
              <span class="table-header-count">{section.members.length}</span>
            {/if}
          </TidyTableHeaderCell>
          {#each columns.ordered as column}
            {@const hidden = hiddenColumns.has(column.key)}

            <TidyTableHeaderCell
              class={[column.headerClasses, { hidden: hidden }]}
              columnWidth="{column.widthRems}rem"
              data-tidy-column-key={column.key}
            >
              {#if !!column.headerContent}
                {#if column.headerContent.type === 'callback'}
                  {@html column.headerContent.callback?.(
                    context.document,
                    context,
                  )}
                {:else if column.headerContent.type === 'component'}
                  <column.headerContent.component
                    sheetContext={context}
                    sheetDocument={context.document}
                    {section}
                  />
                {:else if column.headerContent.type === 'html'}
                  {@html column.headerContent.html}
                {/if}
              {/if}
            </TidyTableHeaderCell>
          {/each}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each section.members as member}
          {@const assignedItemId =
            'assignedTo' in member ? member.assignedTo?.id : undefined}
          <TidyTableRow
            rowContainerAttributes={{
              ['data-assigned-item-id']: assignedItemId,
              ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER,
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
                onclick={() => member.actor.sheet.render({ force: true })}
              >
                <span class="cell-text">
                  <span class="cell-name">{member.actor.name}</span>
                  <span class="cell-context">{member.subtitle}</span>
                </span>
              </a>
            </TidyTableCell>
            {#each columns.ordered as column}
              {@const hidden = hiddenColumns.has(column.key)}

              <TidyTableCell
                columnWidth="{column.widthRems}rem"
                class={[column.cellClasses, { hidden }]}
                attributes={{ ['data-tidy-column-key']: column.key }}
              >
                {#if column.cellContent.type === 'callback'}
                  {@html column.cellContent.callback?.(
                    context.document,
                    context,
                  )}
                {:else if column.cellContent.type === 'component'}
                  <column.cellContent.component
                    rowContext={member}
                    rowDocument={member.actor}
                    {section}
                  />
                {/if}
              </TidyTableCell>
            {/each}
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
