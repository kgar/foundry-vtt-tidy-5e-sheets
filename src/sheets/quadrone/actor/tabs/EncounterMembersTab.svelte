<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import TableRowActionsRuntime from 'src/runtime/table-row-actions/TableRowActionsRuntime.svelte';
  import EncounterMemberNameCell from '../encounter-parts/EncounterMemberNameColumn.svelte';
  import MembersTabSidebar from '../encounter-parts/members-tab-sidebar/MembersTabSidebar.svelte';
  import EncounterXPBudgetBar from '../encounter-parts/EncounterXPBudgetBar.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import GroupMemberHpTooltip from 'src/tooltips/GroupMemberHpTooltip.svelte';
  import { setContext } from 'svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import { EncounterMemberColumnRuntime } from 'src/runtime/table-columns/EncounterMemberColumnRuntime.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TableRowActions from '../../../../components/table-quadrone/parts/TableRowActions.svelte';
  import MemberActionsColumnHeader from '../../item/columns/MemberActionsColumnHeader.svelte';
  import type { ActorRowActionPropsData } from 'src/types/types';

  let context = $derived(getEncounterSheetQuadroneContext());

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

  let showSheetPins = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      CONSTANTS.TAB_MEMBERS,
      'showSheetPins',
    ) ?? true,
  );
</script>

<MembersTabSidebar />

<GroupMemberHpTooltip bind:this={hpTooltip} sheetDocument={context.document} />

<div class="tab-right-column">
  <div class="tab-content" {@attach observeResize(onResize)}>
    {#if showSheetPins}
      <SheetPins />
    {/if}

    {#if context.memberContext.npc.length && context.difficulty?.label}
      <div class="difficulty-row flexrow">
        <div
          class="pill pill-medium flexshrink"
          data-tooltip="{localize('TIDY5E.Difficulty')}: {context.difficulty
            .label}"
        >
          {context.difficulty.label}
        </div>

        <EncounterXPBudgetBar difficulty={context.difficulty} />
      </div>
    {/if}

    {#if context.memberContext.npc.length && context.difficulty?.label}
      <div class="difficulty-row flexrow">
        <div
          class="pill pill-medium flexshrink"
          data-tooltip="{localize('TIDY5E.Difficulty')}: {context.difficulty
            .label}"
        >
          {context.difficulty.label}
        </div>

        <EncounterXPBudgetBar difficulty={context.difficulty} />
      </div>
    {/if}

    {#each context.members as section (section.key)}
      {#if section.show && section.members.length}
        {const visibleItemCount = $derived(section.members.length)}

        {const rowActionInfo = $derived(
          TableRowActionsRuntime.getRowActionWidthInfo(
            section.members,
            (entry) => entry.rowActions,
          ),
        )}

        {const hiddenColumns = $derived(
          EncounterMemberColumnRuntime.determineHiddenColumns(
            sectionsInlineWidth - rowActionInfo.widthPx,
            section.columns,
          ),
        )}

        <TidyTable key={section.key}>
          {#snippet header()}
            <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
              <TidyTableHeaderCell primary={true}>
                <h3>
                  {localize(section.label)}
                  <span class="table-header-count">{visibleItemCount}</span>
                </h3>
              </TidyTableHeaderCell>

              <TidyTableCustomHeaderCells {context} {section} {hiddenColumns} />

              <TidyTableHeaderCell
                class="header-cell-actions"
                columnWidth="{rowActionInfo.widthRems}rem"
                data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
              >
                <MemberActionsColumnHeader
                  {section}
                  sheetDocument={context.document}
                  sheetContext={context}
                />
              </TidyTableHeaderCell>
            </TidyTableHeaderRow>
          {/snippet}
          {#snippet body()}
            {#each section.members as member}
              <div
                class="tidy-table-row group-member"
                style:--t5e-theme-color-default={member.accentColor}
                style:--t5e-theme-color-highlight={member.highlightColor}
                style:--t5e-member-color-hover={member.highlightColor}
                data-tidy-draggable
                data-member-uuid={member.actor.uuid}
                data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ENCOUNTER_MEMBER}
              >
                <EncounterMemberNameCell {member} />

                <TidyTableCustomCells
                  {context}
                  ctx={member}
                  entry={member.actor}
                  {section}
                  {hiddenColumns}
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
              </div>
            {/each}
          {/snippet}
        </TidyTable>
      {/if}
    {/each}
  </div>
</div>
