<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import MembersTabSidebar from '../group-parts/members-tab-sidebar/MembersTabSidebar.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type {
    Actor5e,
    GroupMemberQuadroneContext,
    GroupMemberSection,
    TidySectionBase,
  } from 'src/types/types';
  import GroupMemberNameCell from '../group-parts/GroupMemberNameColumn.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { createSearchResultsState } from 'src/features/search/search.svelte';
  import { isNil } from 'src/utils/data';
  import GroupMembersActionBar from '../../shared/GroupMembersActionBar.svelte';
  import GroupMemberHpTooltip from 'src/tooltips/GroupMemberHpTooltip.svelte';
  import { setContext } from 'svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { GroupMemberColumnRuntime } from 'src/runtime/tables/GroupMemberColumnRuntime.svelte';
  import TableRowActionsRuntime, {
    type ActorTableActionData,
  } from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import MemberActionsColumnHeader from '../../item/columns/MemberActionsColumnHeader.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TableRowActions from 'src/components/table-quadrone/parts/TableRowActions.svelte';

  let context = $derived(getGroupSheetQuadroneContext());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );
  let hpTooltip = $state<GroupMemberHpTooltip | undefined>();
  setContext(CONSTANTS.SVELTE_CONTEXT.HP_TOOLTIP, () => hpTooltip);

  const localize = FoundryAdapter.localize;

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  const showSheetPins = $derived(
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
      context.members,
      CONSTANTS.TAB_MEMBERS,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[CONSTANTS.TAB_MEMBERS],
    ),
  );

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

<GroupMemberHpTooltip bind:this={hpTooltip} sheetDocument={context.document} />

<div class="tab-right-column">
  <GroupMembersActionBar
    bind:searchCriteria
    {sections}
    tabId={CONSTANTS.TAB_MEMBERS}
  />

  <div class="tab-content" {@attach observeResize(onResize)}>
    {#if showSheetPins}
      <SheetPins />
    {/if}

    {#each sections as section (section.key)}
      {const hasViewableItems = $derived(
        !searchResults.uuids ||
          section.members.some((m) => searchResults.uuids?.has(m.actor.uuid)),
      )}
      {#if section.show && hasViewableItems}
        {const visibleItemCount = $derived(section.members.length)}

        {const rowActionInfo = $derived(
          TableRowActionsRuntime.getRowActionWidthInfo(
            section.members,
            (entry) => entry.rowActions,
          ),
        )}

        {const hiddenColumns = $derived(
          GroupMemberColumnRuntime.determineHiddenColumns(
            sectionsInlineWidth - rowActionInfo.widthPx,
            section.columns,
          ),
        )}

        <TidyTable key={section.key} data-custom-section={section.custom}>
          {#snippet header()}
            <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
              <TidyTableHeaderCell primary={true}>
                <h3>
                  {localize(section.label)}
                  <span class="table-header-count">{visibleItemCount}</span>
                </h3>
              </TidyTableHeaderCell>
              <TidyTableCustomHeaderCells {context} {hiddenColumns} {section} />
              <TidyTableHeaderCell
                class="header-cell-actions"
                columnWidth="{rowActionInfo.widthRems}rem"
                data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
              ></TidyTableHeaderCell>
            </TidyTableHeaderRow>
          {/snippet}
          {#snippet body()}
            {#each section.members as member}
              <div
                class={[
                  'tidy-table-row group-member',
                  {
                    hidden:
                      searchResults.uuids &&
                      !searchResults.show(member.actor.uuid),
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
                      ['data-tidy-column-key']:
                        CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
                    }}
                  >
                    {const data = $derived<ActorTableActionData>({
                      actor: member.actor,
                      ctx: member,
                    })}
                    <TableRowActions rowActions={member.rowActions} {data} />
                  </TidyTableCell>
                {/if}
              </div>
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
  </div>
</div>
