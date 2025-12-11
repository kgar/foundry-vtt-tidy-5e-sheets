<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { Actor5e } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';
  import { getContext } from 'svelte';

  interface Props {
    occupant: Actor5e | undefined;
    type: string;
    index: number;
    prop: string;
    facilityId: string;
    facilityName: string;
    uuid: string;
  }

  let { occupant, type, index, prop, facilityId, facilityName, uuid }: Props =
    $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let hoveredFacilityOccupant = getContext<Ref<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );

  function onRosterMemberClicked(
    event: (MouseEvent | PointerEvent) & { currentTarget: HTMLElement },
  ): any {
    if (context.unlocked) {
      EventHelper.triggerContextMenu(event, '[data-actor-uuid]');
      return;
    }
    occupant.sheet.render(true);
  }

  const localize = FoundryAdapter.localize;

  let name = $derived(occupant ? occupant.name : localize('TIDY5E.BrokenLink'));
</script>

<li
  class="roster-member {type} occupant-with-menu"
  class:highlight={hoveredFacilityOccupant.value ===
    `${facilityId}-${index}-${uuid}`}
  class:unlocked={context.unlocked}
  data-actor-uuid={uuid}
  data-tooltip={localize('TIDY5E.Facilities.RosterMember.Label', {
    actorName: name,
    facilityName: facilityName,
  })}
  data-facility-id={facilityId}
  data-facility-name={facilityName}
  data-prop={prop}
  data-index={index}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
  onmouseenter={() =>
    (hoveredFacilityOccupant.value = `${facilityId}-${index}-${uuid}`)}
  onmouseleave={() => (hoveredFacilityOccupant.value = '')}
>
  <a onclick={(ev) => context.editable && onRosterMemberClicked(ev)}>
    {#if occupant}
      <img src={occupant.img} alt={name} />
    {:else}
      <i class="fa-solid fa-link-slash broken-link-icon"></i>
    {/if}
    {#if context.unlocked}
      <i class="fa-solid fa-cog occupant-menu-icon"></i>
    {/if}
  </a>
</li>
