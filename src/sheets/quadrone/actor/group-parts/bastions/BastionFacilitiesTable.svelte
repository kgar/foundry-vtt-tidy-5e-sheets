<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { BastionFacilityColumnRuntime } from 'src/runtime/table-columns/BastionFacilityColumnRuntime';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import BastionFacilityRow from './BastionFacilityRow.svelte';
  import BastionMemberRow from './BastionMemberRow.svelte';
  import OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';
  import { setContext } from 'svelte';

  interface Props {
    sectionsInlineWidth: number;
  }

  let { sectionsInlineWidth }: Props = $props();

  let context = $derived(getGroupSheetQuadroneContext());

  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const localize = FoundryAdapter.localize;

  // One tooltip for the whole table; every occupancy cell borrows it.
  let occupantSummaryTooltip = $state<OccupantSummaryTooltip | undefined>();
  setContext(
    CONSTANTS.SVELTE_CONTEXT.OCCUPANT_SUMMARY_TOOLTIP,
    () => occupantSummaryTooltip,
  );

  let members = $derived(context.bastionsContext.members);

  let section = $derived({
    key: 'facilities',
    label: 'TYPES.Item.facilityPl',
    show: true,
    dataset: {},
    sectionActions: [],
    columns:
      members[0]?.columns ?? BastionFacilityColumnRuntime.EMPTY_COLUMN_SPECS,
  });

  // Member and facility rows each carry exactly one action: the context menu opener.
  let rowActionInfo = $derived(
    RowActionRuntimeBase.getRowActionWidthInfo(members, () => []),
  );

  let hiddenColumns = $derived(
    BastionFacilityColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth - rowActionInfo.widthPx,
      section.columns,
    ),
  );

  /** Special facilities first, mirroring the character sheet's bastion tab. */
  function getFacilities(member: (typeof members)[number]) {
    return [
      ...member.facilities.special.builtFacilities,
      ...member.facilities.basic.builtFacilities,
    ];
  }

  let facilityCount = $derived(
    members.reduce((count, member) => count + getFacilities(member).length, 0),
  );
</script>

<OccupantSummaryTooltip
  bind:this={occupantSummaryTooltip}
  sheetDocument={context.document}
/>

<TidyTable key={section.key} class="bastion-facilities">
  {#snippet header()}
    <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
      <TidyTableHeaderCell primary={true}>
        <h3>
          {localize(section.label)}
          <span class="table-header-count">{facilityCount}</span>
        </h3>
      </TidyTableHeaderCell>

      <TidyTableCustomHeaderCells {context} {section} {hiddenColumns} />

      <TidyTableHeaderCell
        class="header-cell-actions"
        columnWidth="{rowActionInfo.widthRems}rem"
        data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
      />
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each members as member (member.member.actor.uuid)}
      <div class="tidy-table-bastion-row">
      {const facilities = $derived(getFacilities(member))}

      <BastionMemberRow
        {member}
        {hiddenColumns}
        rowActionWidthRems={rowActionInfo.widthRems}
      />

      {#each facilities as chosen (chosen.id)}
        <BastionFacilityRow
          {member}
          {chosen}
          {hiddenColumns}
          rowActionWidthRems={rowActionInfo.widthRems}
        />
      {/each}

      {#if !facilities.length}
        <div class="empty-state-container empty-state-description">
          {localize('TIDY5E.Bastion.Group.Facilities.EmptyStateHint')}
        </div>
      {/if}
      </div>
    {/each}
  {/snippet}
</TidyTable>
