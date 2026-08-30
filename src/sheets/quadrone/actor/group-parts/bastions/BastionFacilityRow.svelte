<script lang="ts">
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import ItemRollButton from 'src/sheets/quadrone/shared/ItemRollButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ChosenFacilityContext,
    GroupMemberBastionQuadroneContext,
  } from 'src/types/types';

  interface Props {
    member: GroupMemberBastionQuadroneContext;
    chosen: ChosenFacilityContext;
    hiddenColumns: Set<string>;
    rowActionWidthRems: number;
  }

  let { member, chosen, hiddenColumns, rowActionWidthRems }: Props = $props();

  const searchResults = getSearchResultsContext();

  let context = $derived(getGroupSheetQuadroneContext());

  let memberUuid = $derived(member.member.actor.uuid);

  let section = $derived({
    key: memberUuid,
    label: member.member.actor.name,
    show: true,
    dataset: {},
    sectionActions: [],
    columns: member.columns,
  });

  // Disabled facilities show the repair icon like on character sheets
  let img = $derived(
    !chosen.disabled
      ? chosen.img
      : CONFIG.DND5E.facilities.orders.repair.icon,
  );
</script>

<div
  class={[
    'tidy-table-row bastion-facility',
    chosen.isSpecial
      ? CONSTANTS.FACILITY_TYPE_SPECIAL
      : CONSTANTS.FACILITY_TYPE_BASIC,
    {
      disabled: chosen.disabled,
      building: chosen.building.built === false,
      hidden: !searchResults.show(chosen.facility.uuid),
    },
  ]}
  style:--t5e-theme-color-default={member.member.accentColor}
  style:--t5e-theme-color-highlight={member.member.highlightColor}
  data-item-id={chosen.id}
  data-facility-id={chosen.id}
  data-member-uuid={memberUuid}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_GROUP_BASTION_FACILITY}
>
  <!-- TODO: Swap to tidy table roll button -->
  <ItemRollButton
    image={img}
    name={chosen.name}
    onclick={(ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      context.sheet.useMemberFacility(member.member.actor, chosen.id, ev);
    }}
  />

  <!-- The whole cell opens the facility, not just the name. -->
  <TidyTableCell
    primary={true}
    class="text-cell item-label flexcol"
    attributes={{
      role: 'button',
      tabindex: 0,
      ['data-keyboard-focus']: '',
      ['data-action']: 'showDocument',
      ['data-uuid']: chosen.facility.uuid,
    }}
  >
    <h4 class="font-label-medium facility-name">{chosen.name}</h4>
    <span class="subtitle font-default-medium color-text-lighter">
      {@html chosen.subtitle}
    </span>
  </TidyTableCell>

  <TidyTableCustomCells
    {context}
    ctx={chosen}
    entry={chosen.facility}
    {section}
    {hiddenColumns}
  />

  <TidyTableCell
    columnWidth="{rowActionWidthRems}rem"
    class="tidy-table-actions"
    attributes={{
      ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
    }}
  >
    <MenuButton targetSelector="[data-context-menu]" />
  </TidyTableCell>
</div>
