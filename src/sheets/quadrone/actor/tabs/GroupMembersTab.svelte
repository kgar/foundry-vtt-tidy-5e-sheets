<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import MembersTabSidebar from '../group-parts/members-tab-sidebar/MembersTabSidebar.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type {
    Actor5e,
    GroupMemberQuadroneContext,
    GroupMemberSection,
  } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import GroupMemberNameCell from '../group-parts/GroupMemberNameColumn.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import { GroupMemberColumnRuntime } from 'src/runtime/tables/GroupMemberColumnRuntime.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { createSearchResultsState } from 'src/features/search/search.svelte';
  import { isNil } from 'src/utils/data';
  import GroupMembersActionBar from '../../shared/GroupMembersActionBar.svelte';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let rowActions: any[] = $derived(
    TableRowActionsRuntime.getGroupMemberRowActions(context),
  );

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  const showSheetPin = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      CONSTANTS.TAB_MEMBERS,
      'showSheetPins',
    ) ?? true,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();

  let sections: GroupMemberSection[] = $derived(
    SheetSections.configureGroupMembers(
      context.members.sections,
      CONSTANTS.TAB_MEMBERS,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[CONSTANTS.TAB_MEMBERS],
    ),
  );

  const tabOptionGroups = $derived([
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(
          context.document.type,
          CONSTANTS.TAB_MEMBERS,
        ),
      ],
    },
  ]);

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);
    return () => {
      observer.disconnect();
    };
  });

  $effect(() => {
    searchResults.uuids = !isNil(searchCriteria)
      ? new Set(
          context.system.members
            .filter((m: Actor5e) =>
              m.actor.name.toLowerCase().includes(searchCriteria),
            )
            .map((m: Actor5e) => m.actor.uuid),
        )
      : undefined;
  });
</script>

<MembersTabSidebar />

<section
  class="group-tab-content group-members-content flexcol"
  bind:this={sectionsContainer}
>
  <GroupMembersActionBar
    bind:searchCriteria
    {sections}
    tabId={CONSTANTS.TAB_MEMBERS}
    {tabOptionGroups}
  />

  {#if showSheetPin}
    <SheetPins />
  {/if}

  {#each sections as section (section.key)}
    {@const hasViewableItems =
      !searchResults.uuids ||
      section.members.some((m) => searchResults.uuids?.has(m.actor.uuid))}
    {#if section.show && hasViewableItems}
      {@const columns = new ColumnsLoadout(
        GroupMemberColumnRuntime.getConfiguredColumnSpecifications({
          sheetType: CONSTANTS.SHEET_TYPE_GROUP,
          tabId: CONSTANTS.TAB_MEMBERS,
          sectionKey: section.key,
          rowActions: rowActions,
          section: { ...SheetSections.EMPTY, rowActions },
          sheetDocument: context.actor,
        }),
      )}
      {@const visibleItemCount = section.members.length}
      {@const hiddenColumns = GroupMemberColumnRuntime.determineHiddenColumns(
        sectionsInlineWidth,
        columns,
      )}

      <TidyTable key={section.key}>
        {#snippet header()}
          <TidyTableHeaderRow class="theme-dark">
            <TidyTableHeaderCell primary={true}>
              <h3>
                {localize(section.label)}
                <span class="table-header-count">{visibleItemCount}</span>
              </h3>
            </TidyTableHeaderCell>
            {@render headerColumns(columns, hiddenColumns)}
          </TidyTableHeaderRow>
        {/snippet}
        {#snippet body()}
          {#each section.members as member}
            {@render tableRow(member, columns, hiddenColumns)}
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}

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
    class={[
      'tidy-table-row group-member',
      {
        hidden: searchResults.uuids && !searchResults.show(member.actor.uuid),
      },
    ]}
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
