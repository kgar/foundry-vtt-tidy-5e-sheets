<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupTabSidebar from '../group-parts/group-tab-sidebar/GroupTabSidebar.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import GroupMemberNameCell from '../group-parts/GroupMemberNameColumn.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import { GroupMemberColumnRuntime } from 'src/runtime/tables/GroupMemberColumnRuntime.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let characters = $derived(context.members.character.members);
  let npcs = $derived(context.members.npc.members);
  let vehicles = $derived(context.members.vehicle.members);

  const localize = FoundryAdapter.localize;

  let rowActions: any[] = $derived(
    TableRowActionsRuntime.getGroupMemberRowActions(context),
  );

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);
    console.warn('group resize observer connected!');
    return () => {
      observer.disconnect();
    };
  });
</script>

<GroupTabSidebar />

<section
  class="groups-tab-content group-members-content flexcol"
  bind:this={sectionsContainer}
>
  {sectionsInlineWidth}
  {#if characters.length}
    {@const columns = new ColumnsLoadout(
      GroupMemberColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: CONSTANTS.SHEET_TYPE_GROUP,
        tabId: CONSTANTS.TAB_MEMBERS,
        sectionKey: CONSTANTS.SHEET_TYPE_CHARACTER,
        rowActions: rowActions,
        section: { ...SheetSections.EMPTY, rowActions },
        sheetDocument: context.actor,
      }),
    )}
    {@const visibleItemCount = characters.length}
    {@const hiddenColumns = GroupMemberColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth,
      columns,
    )}

    {JSON.stringify(hiddenColumns.values())}

    <TidyTable key="characters">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.character.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          {@render headerColumns(columns, hiddenColumns)}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each characters as member}
          {@render tableRow(member, columns, hiddenColumns)}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}

  {#if npcs.length}
    {@const columns = new ColumnsLoadout(
      GroupMemberColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: CONSTANTS.SHEET_TYPE_GROUP,
        tabId: CONSTANTS.TAB_MEMBERS,
        sectionKey: CONSTANTS.SHEET_TYPE_NPC,
        rowActions: rowActions,
        section: { ...SheetSections.EMPTY, rowActions },
        sheetDocument: context.actor,
      }),
    )}
    {@const visibleItemCount = npcs.length}
    {@const hiddenColumns = GroupMemberColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth,
      columns,
    )}

    <TidyTable key="npcs">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.npc.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          {@render headerColumns(columns, hiddenColumns)}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each npcs as member}
          {@render tableRow(member, columns, hiddenColumns)}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}

  {#if vehicles.length}
    {@const columns = new ColumnsLoadout(
      GroupMemberColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: CONSTANTS.SHEET_TYPE_GROUP,
        tabId: CONSTANTS.TAB_MEMBERS,
        sectionKey: CONSTANTS.SHEET_TYPE_VEHICLE,
        rowActions: rowActions,
        section: { ...SheetSections.EMPTY, rowActions },
        sheetDocument: context.actor,
      }),
    )}
    {@const visibleItemCount = vehicles.length}
    {@const hiddenColumns = GroupMemberColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth,
      columns,
    )}

    <TidyTable key="vehicles">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.vehicle.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          {@render headerColumns(columns, hiddenColumns)}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each vehicles as member}
          {@render tableRow(member, columns, hiddenColumns)}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}

  {#if !context.system.members.length}
    <div class="empty-state-container empty-state-description">
      {localize('TIDY5E.Group.EmptyMembersTabHint')}
    </div>
  {/if}
</section>

{#snippet headerColumns(columns: ColumnsLoadout, hiddenColumns: Set<string>)}
  {#each columns.ordered as column}
    {@const hidden = hiddenColumns.has(column.key)}
    <TidyTableHeaderCell
      class={[column.headerClasses, { hidden }]}
      columnWidth="{column.widthRems}rem"
      data-tidy-column-key={column.key}
    >
      {#if !!column.headerContent}
        {#if column.headerContent.type === 'callback'}
          {@html column.headerContent.callback?.(context.document, context)}
        {:else if column.headerContent.type === 'component'}
          <column.headerContent.component
            sheetContext={context}
            sheetDocument={context.document}
            section={{
              ...SheetSections.EMPTY,
              rowActions: rowActions,
            }}
          />
        {:else if column.headerContent.type === 'html'}
          {@html column.headerContent.html}
        {/if}
      {/if}
    </TidyTableHeaderCell>
  {/each}
{/snippet}

{#snippet tableRow(
  member: GroupMemberQuadroneContext,
  columns: ColumnsLoadout,
  hiddenColumns: Set<string>,
)}
  <div
    class="tidy-table-row group-member"
    style:--t5e-theme-color-default={member.accentColor}
    style:--t5e-theme-color-highlight={member.highlightColor}
    style:--t5e-member-color-hover={member.highlightColor}
    data-tidy-draggable
    data-member-id={member.actor.id}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER}
  >
    <GroupMemberNameCell {member} />
    {#if member.canObserve}
      {#each columns.ordered as column}
        {@const hidden = hiddenColumns.has(column.key)}
        <TidyTableCell
          columnWidth="{column.widthRems}rem"
          class={[column.cellClasses, { hidden }]}
          attributes={{ ['data-tidy-column-key']: column.key }}
        >
          {#if column.cellContent.type === 'callback'}
            {@html column.cellContent.callback?.(context.document, context)}
          {:else if column.cellContent.type === 'component'}
            <column.cellContent.component
              rowContext={member}
              rowDocument={member.actor}
              section={{
                ...SheetSections.EMPTY,
                rowActions: rowActions,
              }}
            />
          {/if}
        </TidyTableCell>
      {/each}
    {/if}
  </div>
{/snippet}
