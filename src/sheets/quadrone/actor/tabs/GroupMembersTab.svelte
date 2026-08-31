<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import MembersTabSidebar from '../group-parts/members-tab-sidebar/MembersTabSidebar.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { Actor5e, GroupMemberSection } from 'src/types/types';
  import GroupMemberNameCell from '../group-parts/GroupMemberNameColumn.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { SectionVisibility } from 'src/features/sections/SectionVisibility';
  import GroupMembersActionBar from '../../shared/GroupMembersActionBar.svelte';
  import GroupMemberHpTooltip from 'src/tooltips/GroupMemberHpTooltip.svelte';
  import { setContext } from 'svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import RowActionsColumn from '../../item/columns/RowActionsColumn.svelte';
  import { GroupMemberColumnRuntime } from 'src/runtime/table-columns/GroupMemberColumnRuntime';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import SectionActionsColumnHeader from '../../item/columns/SectionActionsColumnHeader.svelte';

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

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let sections: GroupMemberSection[] = $derived(
    SheetSections.configureGroupMembers(
      context.members,
      CONSTANTS.TAB_MEMBERS,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[CONSTANTS.TAB_MEMBERS],
    ),
  );

  $effect(() => {
    const criteria = searchCriteria.trim().toLowerCase();

    searchResults.criteria = searchCriteria;
    searchResults.uuids =
      criteria !== ''
        ? new Set(
            context.system.members
              .filter((m: Actor5e) =>
                m.actor.name.toLowerCase().includes(criteria),
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
    <SheetPins />

    {#each sections as section (section.key)}
      {const sectionSearchState = $derived(
        SectionVisibility.getMemberSectionSearchState(
          section.members,
          searchResults,
        ),
      )}
      {const showSection = $derived(
        section.show &&
          SectionVisibility.shouldShowMemberSection(sectionSearchState),
      )}
      {#if showSection}
        {const rowActionInfo = $derived(
          RowActionRuntimeBase.getRowActionWidthInfo(
            section.members,
            (entry) => entry.rowActions,
            context.unlocked ? section.sectionActions : [],
          ),
        )}

        {const hiddenColumns = $derived(
          GroupMemberColumnRuntime.determineHiddenColumns(
            sectionsInlineWidth - rowActionInfo.widthPx,
            section.columns,
          ),
        )}

        <TidyTable
          key={section.key}
          data-custom-section={section.custom}
          expandedOverride={sectionSearchState.expandedOverride}
        >
          {#snippet header()}
            <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
              <TidyTableHeaderCell primary={true}>
                <h3>
                  {localize(section.label)}
                  <span class="table-header-count"
                    >{sectionSearchState.visibleItemCount}</span
                  >
                </h3>
              </TidyTableHeaderCell>

              <TidyTableCustomHeaderCells {context} {hiddenColumns} {section} />

              <TidyTableHeaderCell
                class="header-cell-actions"
                columnWidth="{rowActionInfo.widthRems}rem"
                data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
              >
                {#if section.key === CONSTANTS.SHEET_TYPE_NPC && FoundryAdapter.userIsGm()}
                  <!-- kgar: option 2, the least obvious but my top option -->
                  <!-- svelte-ignore a11y_missing_attribute -->
                  <a
                    role="button"
                    tabindex="0"
                    class="tidy-table-button"
                    aria-label={localize('TIDY5E.RefreshGroupNPCs')}
                    data-tooltip={localize('TIDY5E.RefreshNPC')}
                    data-action="refreshActor"
                    data-type="npc"
                  >
                    <i class="fas fa-arrows-rotate-reverse"></i>
                  </a>
                {/if}
                <SectionActionsColumnHeader
                  {section}
                  maxRowActionsCount={rowActionInfo.maxRowActionsCount}
                  sheetDocument={context.document}
                />
              </TidyTableHeaderCell>
            </TidyTableHeaderRow>
          {/snippet}
          {#snippet body()}
            {#each section.members as member}
              <div
                class={[
                  'tidy-table-row group-member',
                  {
                    hidden: !searchResults.show(member.actor.uuid),
                  },
                ]}
                style:--t5e-theme-color-default={member.accentColor}
                style:--t5e-theme-color-highlight={member.highlightColor}
                style:--t5e-member-color-hover={member.highlightColor}
                data-tidy-draggable
                data-uuid={member.actor.uuid}
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

                  <RowActionsColumn
                    columnWidth="{rowActionInfo.widthRems}rem"
                    rowActions={member.rowActions}
                    data={{
                      actor: member.actor,
                      ctx: member,
                    }}
                  />
                {/if}
              </div>
            {/each}
          {/snippet}
        </TidyTable>
        
        <!-- kgar: option 3, probably the most obvious. I'd recommend this over the heade.r -->
        {#if section.key === CONSTANTS.SHEET_TYPE_NPC}
          <button
          type="button"
          class="button long-rest button-gold flexshrink"
          data-action="refreshActor"
          data-type="npc"
          data-tooltip={localize('TIDY5E.RefreshNPC')}
        >
          <i class="fas fa-arrows-rotate-reverse"></i>
          {localize('TIDY5E.RefreshNPC')}
        </button>
        {/if}
      {/if}
    {/each}

    {#if !context.system.members.length}
      <div class="empty-state-container empty-state-description">
        {localize('TIDY5E.Group.EmptyMembersTabHint')}
      </div>
    {/if}
  </div>
</div>
