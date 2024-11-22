<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';

  export let actor: Actor5e | undefined;
  export let index: number;
  export let type: string;
  export let iconClass: string;
  export let facilityId: string;
  export let facilityName: string;
  export let prop: string;

  function onOccupantClick() {
    actor.sheet.render(true);
    // TODO: handle when unlocked, and show context menu options.
  }
</script>

<!-- TODO: When unlocked, include overlay with left/right click for context menu with options Edit and "Remove from {FacilityName}" -->
<!-- TODO: When Svelte 5, inline into Bastion tab as snippet -->
{#if actor}
  {@const imageTypeClassName = actor.token ? 'token' : 'portrait'}
  {@const imageSrc =
    imageTypeClassName == 'token' ? actor.token.img : actor.img}
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <a
    data-actor-uuid={actor.uuid}
    class="slot occupant-slot {type} {imageTypeClassName}"
    data-index={index}
    data-tooltip={actor.name}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
    data-facility-id={facilityId}
    data-facility-name={facilityName}
    data-prop={prop}
    on:click={() => onOccupantClick()}
  >
    <img src={imageSrc} alt={actor.name} />
  </a>
{:else}
  <div class="slot occupant-slot {type} empty" data-index={index}>
    <i class={iconClass}></i>
  </div>
{/if}
