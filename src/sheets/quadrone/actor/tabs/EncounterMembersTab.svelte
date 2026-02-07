<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import { EncounterMemberColumnRuntime } from 'src/runtime/tables/EncounterMemberColumnRuntime.svelte';
  import EncounterMemberNameCell from '../encounter-parts/EncounterMemberNameColumn.svelte';
  import MembersTabSidebar from '../encounter-parts/members-tab-sidebar/MembersTabSidebar.svelte';
  import EncounterXPBudgetBar from '../encounter-parts/EncounterXPBudgetBar.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import GroupMemberHpTooltip from 'src/tooltips/GroupMemberHpTooltip.svelte';
  import { setContext } from 'svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());
  let npcs = $derived(context.members.npc);

  let hpTooltip = $state<GroupMemberHpTooltip | undefined>();
  setContext(CONSTANTS.SVELTE_CONTEXT.HP_TOOLTIP, () => hpTooltip);

  const localize = FoundryAdapter.localize;

  let rowActions: any[] = $derived(
    TableRowActionsRuntime.getEncounterMemberRowActions(context),
  );

  let sectionsContainer: HTMLElement;
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

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);
    return () => {
      observer.disconnect();
    };
  });
</script>

<MembersTabSidebar />

<GroupMemberHpTooltip bind:this={hpTooltip} sheetDocument={context.document} />

<section
  class="group-tab-content group-members-content flexcol"
  bind:this={sectionsContainer}
>
  {#if showSheetPins}
    <SheetPins />
  {/if}

  {#if npcs.length}
    {@const columns = new ColumnsLoadout(
      EncounterMemberColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: CONSTANTS.SHEET_TYPE_ENCOUNTER,
        tabId: CONSTANTS.TAB_MEMBERS,
        sectionKey: CONSTANTS.SHEET_TYPE_NPC,
        rowActions: rowActions,
        section: { ...SheetSections.EMPTY, rowActions },
        sheetDocument: context.actor,
      }),
    )}
    {@const visibleItemCount = npcs.length}
    {@const hiddenColumns = EncounterMemberColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth,
      columns,
    )}

    {#if context.difficulty?.label}
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

    <TidyTable key="npcs">
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true}>
            <h3>
              {localize('DND5E.ENCOUNTER.Tab.Members')}
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
</section>

{#snippet headerColumns(columns: ColumnsLoadout, hiddenColumns: Set<string>)}
  <TidyTableCustomHeaderCells
    {columns}
    {context}
    section={{
      ...SheetSections.EMPTY,
      rowActions: rowActions,
    }}
    {hiddenColumns}
  />
{/snippet}

{#snippet tableRow(
  member: EncounterMemberQuadroneContext,
  columns: ColumnsLoadout,
  hiddenColumns: Set<string>,
)}
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
      {columns}
      ctx={member}
      entry={member.actor}
      section={{
        ...SheetSections.EMPTY,
        rowActions: rowActions,
      }}
      {hiddenColumns}
    />
  </div>
{/snippet}
