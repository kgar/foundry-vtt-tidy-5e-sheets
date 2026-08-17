<script lang="ts">
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import ItemRollButton from 'src/sheets/quadrone/shared/ItemRollButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import { CONSTANTS } from 'src/constants';
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
    { disabled: chosen.disabled, building: chosen.building.built === false },
  ]}
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
        const document = game.documents.get(chosen.id);
        if (document) {
          document.render(true);
        }
      }} 
    />
  <!-- <div class="tidy-table-cell facility-image-container">
    <img class="facility-image" src={img} alt={chosen.name} />
  </div> -->

  <TidyTableCell primary={true} class="text-cell item-label flexcol">
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      class="facility-name"
      role="button"
      data-keyboard-focus
      tabindex={0}
      data-action={context.editable ? 'useMemberFacility' : undefined}
      data-member-uuid={memberUuid}
      data-facility-id={chosen.id}
    >
      <h4 class="font-label-medium">{chosen.name}</h4>
    </a>
    <span class="subtitle font-label-medium color-text-lighter">
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
