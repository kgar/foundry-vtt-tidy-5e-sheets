<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';
  import EncounterMemberNameCell from '../encounter-parts/EncounterMemberNameColumn.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { EncounterMemberColumnRuntime } from 'src/runtime/tables/EncounterMemberColumnRuntime.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());
  let npcs = $derived(context.members.npc);

  const localize = FoundryAdapter.localize;
  let rowActions: any[] = $derived(
    TableRowActionsRuntime.getEncounterCombatRowActions(context),
  );

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
</script>

<aside class="sidebar flexcol">
  <button class="button">
    <i class="fas fa-dice-d20"></i>
    {localize('DND5E.InitiativeRoll')}
  </button>
  <button class="button">
    <i class="fas fa-swords"></i>
    {localize('TIDY5E.Encounter.AddToCombatTracker.Label')}
  </button>
  <button class="button">
    <i class="fas fa-circle-dashed"></i>
    {localize('TIDY5E.Encounter.AddAPlaceholder.Label')}
  </button>
</aside>

<section
  class="group-tab-content group-members-content flexcol"
  bind:this={sectionsContainer}
>
  {#if npcs.length}
    {@const columns = new ColumnsLoadout(
      EncounterMemberColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: CONSTANTS.SHEET_TYPE_ENCOUNTER,
        tabId: CONSTANTS.TAB_ACTOR_COMBAT,
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

  <!-- TODO: Extract a single Members table where you can specify the tab ID and pass a snippet for the primary column cell content. -->
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
    </div>
  {/snippet}
</section>
