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

<!-- TODO: Static "Pins" for Crew and Passengers -->
<div class="tidy-table-container" bind:this={sectionsContainer}>
  {@render CrewPassengerTable(
    context.crew.unassigned,
    false,
    UnassignedNoCrewView,
  )}

  {#snippet UnassignedNoCrewView(section: CrewSection | PassengerSection)}
    Unassigned Empty State here
  {/snippet}

  {@render CrewPassengerTable(context.crew.assigned, true)}

  {@render CrewPassengerTable(
    context.passengers,
    false,
    UnassignedNoPassengerView,
  )}

  {#snippet UnassignedNoPassengerView(section: CrewSection | PassengerSection)}
    Passenger Empty State here
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
    {@const hiddenColumns =
      VehicleMemberColumnRuntime.determineHiddenColumns(
        sectionsInlineWidth,
        columns,
      )}
    <TidyTable key={section.key} data-key={section.type}>
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
          <TidyTableRow>
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
