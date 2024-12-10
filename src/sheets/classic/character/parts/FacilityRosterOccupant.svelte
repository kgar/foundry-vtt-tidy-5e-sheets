<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ContextPrimitive } from 'src/features/reactivity/reactivity.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Actor5e } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';
  import { getContext } from 'svelte';

  interface Props {
    occupant: Actor5e;
    type: string;
    index: number;
    prop: string;
    facilityId: string;
    facilityName: string;
  }

  let { occupant, type, index, prop, facilityId, facilityName }: Props =
    $props();

  let context = $derived(getCharacterSheetContext());

  let hoveredFacilityOccupant = getContext<ContextPrimitive<string>>(
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
</script>

<li
  class="roster-member {type} occupant-with-menu"
  class:highlight={hoveredFacilityOccupant.value ===
    `${facilityId}-${index}-${occupant.uuid}`}
  class:unlocked={context.unlocked}
  data-actor-uuid={occupant.uuid}
  data-tooltip={localize('TIDY5E.Facilities.RosterMember.Label', {
    actorName: occupant.name,
    facilityName: facilityName,
  })}
  data-facility-id={facilityId}
  data-facility-name={facilityName}
  data-prop={prop}
  data-index={index}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
  onmouseenter={() =>
    (hoveredFacilityOccupant.value = `${facilityId}-${index}-${occupant.uuid}`)}
  onmouseleave={() => (hoveredFacilityOccupant.value = '')}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_missing_attribute -->
  <a onclick={(ev) => context.editable && onRosterMemberClicked(ev)}>
    <img src={occupant.img} alt={occupant.name} />
    {#if context.unlocked}
      <i class="fa-solid fa-cog occupant-menu-icon"></i>
    {/if}
  </a>
</li>
