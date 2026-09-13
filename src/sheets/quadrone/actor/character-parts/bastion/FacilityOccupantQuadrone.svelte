<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';
  import OccupantSlot from 'src/sheets/quadrone/shared/OccupantSlot.svelte';

  interface Props {
    occupant: Actor5e | undefined;
    uuid: string | undefined;
    index: number;
    type: string;
    iconClass: string;
    facilityId: string;
    facilityName: string;
  }

  let {
    occupant,
    index,
    type,
    iconClass,
    facilityId,
    facilityName,
    uuid,
  }: Props = $props();
</script>

<OccupantSlot
  {occupant}
  {uuid}
  {type}
  {iconClass}
  contextMenuType={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
  action="addOccupant"
  attributes={{
    'data-actor-uuid': uuid,
    'data-facility-name': facilityName,
    'data-index': index,
  }}
  highlightKey="{facilityId}-{index}-{uuid}"
  draggable
/>
