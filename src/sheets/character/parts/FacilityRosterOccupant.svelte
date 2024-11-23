<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e, CharacterSheetContext } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let hoveredFacilityOccupant = getContext<Writable<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );

  export let occupant: Actor5e;
  export let type: string;
  export let index: number;
  export let prop: string;
  export let facilityId: string;
  export let facilityName: string;

  function onRosterMemberClicked(
    event: (MouseEvent | PointerEvent) & { currentTarget: HTMLElement },
  ): any {
    if ($context.unlocked) {
      EventHelper.triggerContextMenu(event, '[data-actor-uuid]');
      return;
    }
    occupant.sheet.render(true);
  }

  const localize = FoundryAdapter.localize;
</script>

<li
  class="roster-member {type} occupant-with-menu"
  class:highlight={$hoveredFacilityOccupant ===
    `${facilityId}-${index}-${occupant.uuid}`}
  class:unlocked={$context.unlocked}
  data-actor-uuid={occupant.uuid}
  data-tooltip={localize('TIDY5E.Facilities.Roster.MemberLabel', {
    actorName: occupant.name,
    facilityName: facilityName,
  })}
  data-facility-id={facilityId}
  data-facility-name={facilityName}
  data-prop={prop}
  data-index={index}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
  on:mouseenter={() =>
    ($hoveredFacilityOccupant = `${facilityId}-${index}-${occupant.uuid}`)}
  on:mouseleave={() => ($hoveredFacilityOccupant = '')}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a on:click={(ev) => onRosterMemberClicked(ev)}>
    <img src={occupant.img} alt={occupant.name} />
    {#if $context.unlocked}
      <i class="fa-solid fa-cog occupant-menu-icon"></i>
    {/if}
  </a>
</li>
