<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let occupant: Actor5e | undefined;
  export let index: number;
  export let type: string;
  export let iconClass: string;
  export let facilityId: string;
  export let facilityName: string;
  export let prop: string;

  function onOccupantClick() {
    occupant.sheet.render(true);
    // TODO: handle when unlocked, and show context menu options.
  }

  let hoveredFacilityOccupant = getContext<Writable<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );
</script>

<!-- TODO: When unlocked, include overlay with left/right click for context menu with options Edit and "Remove from {FacilityName}" -->
<!-- TODO: When Svelte 5, inline into Bastion tab as snippet -->
{#if occupant}
  {@const imageTypeClassName = occupant.token ? 'token' : 'portrait'}
  {@const imageSrc =
    imageTypeClassName == 'token' ? occupant.token.img : occupant.img}
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <li
    class:highlight={$hoveredFacilityOccupant ===
      `${facilityId}-${index}-${occupant.uuid}`}
    class="slot occupant-slot {type} {imageTypeClassName}"
    data-actor-uuid={occupant.uuid}
    data-tooltip={occupant.name}
    data-facility-id={facilityId}
    data-facility-name={facilityName}
    data-prop={prop}
    data-index={index}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
    on:click={() => onOccupantClick()}
    on:mouseenter={() =>
      ($hoveredFacilityOccupant = `${facilityId}-${index}-${occupant.uuid}`)}
    on:mouseleave={() => ($hoveredFacilityOccupant = '')}
  >
    <a>
      <img src={imageSrc} alt={occupant.name} />
    </a>
  </li>
{:else}
  <div class="slot occupant-slot {type} empty" data-index={index}>
    <i class={iconClass}></i>
  </div>
{/if}
