<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
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

  let context = $derived(getEncounterSheetQuadroneContext());
  let npcs = $derived(context.members.npc);
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  let hpTooltip = $state<GroupMemberHpTooltip | undefined>();
  setContext(CONSTANTS.SVELTE_CONTEXT.HP_TOOLTIP, () => hpTooltip);

  const localize = FoundryAdapter.localize;

  let rowActions: any[] = $derived(
    TableRowActionsRuntime.getEncounterMemberRowActions(context),
  );

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

    {#if npcs.length}
      {const visibleItemCount = $derived(npcs.length)}

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
          <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
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
  </div>
</div>
{#snippet headerColumns(hiddenColumns: Set<string>)}
  <TidyTableCustomHeaderCells
    {context}
    section={{
      ...SheetSections.EMPTY,
    }}
    {hiddenColumns}
  />
{/snippet}

{#snippet tableRow(
  member: EncounterMemberQuadroneContext,
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
      ctx={member}
      entry={member.actor}
      section={{
        ...SheetSections.EMPTY,
      }}
      {hiddenColumns}
    />
  </div>
{/snippet}
