<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import GroupTabSidebar from '../group-parts/group-tab-sidebar/GroupTabSidebar.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { GroupMemberColumnRuntime } from 'src/runtime/tables/GroupMemberColumnRuntime.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import GroupMemberNameCell from '../group-parts/GroupMemberNameColumn.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  let characters = $derived(context.members.character.members);
  let npcs = $derived(context.members.npc.members);
  let vehicles = $derived(context.members.vehicle.members);

  const localize = FoundryAdapter.localize;

  let rowActions: any[] = $derived(
    TableRowActionsRuntime.getGroupMemberRowActions(context),
  );
</script>

<GroupTabSidebar />

<section class="groups-tab-content group-members-content flexcol">
  {#if characters.length}
    {@const columns = new ColumnsLoadout(
      GroupMemberColumnRuntime.getConfiguredColumnSpecifications(
        CONSTANTS.SHEET_TYPE_GROUP,
        CONSTANTS.TAB_MEMBERS,
        CONSTANTS.SHEET_TYPE_CHARACTER,
        {
          rowActions: rowActions,
        },
      ),
    )}
    {@const visibleItemCount = characters.length}

    <TidyTable key="characters">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.character.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          {@render headerColumns(columns)}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each characters as member}
          {@render tableRow(member, columns)}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}

  {#if npcs.length}
    {@const columns = new ColumnsLoadout(
      GroupMemberColumnRuntime.getConfiguredColumnSpecifications(
        CONSTANTS.SHEET_TYPE_GROUP,
        CONSTANTS.TAB_MEMBERS,
        CONSTANTS.SHEET_TYPE_NPC,
        {
          rowActions: rowActions,
        },
      ),
    )}
    {@const visibleItemCount = npcs.length}

    <TidyTable key="npcs">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.npc.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          {@render headerColumns(columns)}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each npcs as member}
          {@render tableRow(member, columns)}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}

  {#if vehicles.length}
    {@const columns = new ColumnsLoadout(
      GroupMemberColumnRuntime.getConfiguredColumnSpecifications(
        CONSTANTS.SHEET_TYPE_GROUP,
        CONSTANTS.TAB_MEMBERS,
        CONSTANTS.SHEET_TYPE_VEHICLE,
        {
          rowActions: rowActions,
        },
      ),
    )}
    {@const visibleItemCount = vehicles.length}

    <TidyTable key="vehicles">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize(context.members.vehicle.label)}
              <span class="table-header-count">{visibleItemCount}</span>
            </h3>
          </TidyTableHeaderCell>
          {@render headerColumns(columns)}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each vehicles as member}
          {@render tableRow(member, columns)}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
</section>

{#snippet headerColumns(columns: ColumnsLoadout)}
  {#each columns.ordered as column}
    <TidyTableHeaderCell
      class={[column.headerClasses]}
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

{#snippet tableRow(member: GroupMemberQuadroneContext, columns: ColumnsLoadout)}
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
    {#each columns.ordered as column}
      <TidyTableCell
        columnWidth="{column.widthRems}rem"
        class={[column.cellClasses]}
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
  </div>
{/snippet}
