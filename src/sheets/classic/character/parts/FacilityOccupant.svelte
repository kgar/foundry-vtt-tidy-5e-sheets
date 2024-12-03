<script lang="ts">
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e, CharacterSheetContext } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';

  export let occupant: Actor5e | undefined;
  export let index: number;
  export let type: string;
  export let iconClass: string;
  export let facilityId: string;
  export let facilityName: string;
  export let prop: string;

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  function onOccupantClick(
    event: (MouseEvent | PointerEvent) & { currentTarget: HTMLElement },
  ) {
    if ($context.unlocked) {
      EventHelper.triggerContextMenu(event, '[data-actor-uuid]');
      return;
    }
    occupant.sheet.render(true);
  }

  async function onSlotClick(ev: Event) {
    if (
      !TidyHooks.tidy5eSheetsFacilityEmptyOccupantSlotClicked(
        ev,
        $context.actor.items.get(facilityId),
        type,
        prop,
      )
    ) {
      return;
    }

    const result = await dnd5e.applications.CompendiumBrowser.selectOne({
      filters: {
        locked: {
          documentClass: 'Actor',
          types: new Set(['character', 'npc', 'vehicle', 'group']),
        },
      },
    });

    if (result) {
      $context.actor.sheet._onDropActorAddToFacility(
        $context.actor.items.get(facilityId),
        prop,
        result,
      );
    }
  }

  let hoveredFacilityOccupant = getContext<Writable<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );
</script>

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
    class:unlocked={$context.unlocked}
    class="slot occupant-slot {type} {imageTypeClassName} occupant-with-menu"
    data-actor-uuid={occupant.uuid}
    data-tooltip={occupant.name}
    data-facility-id={facilityId}
    data-facility-name={facilityName}
    data-prop={prop}
    data-index={index}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
    on:mouseenter={() =>
      ($hoveredFacilityOccupant = `${facilityId}-${index}-${occupant.uuid}`)}
    on:mouseleave={() => ($hoveredFacilityOccupant = '')}
  >
    <a on:click={(ev) => $context.editable && onOccupantClick(ev)}>
      <img src={imageSrc} alt={occupant.name} />

      {#if $context.unlocked}
        <i class="fa-solid fa-cog occupant-menu-icon"></i>
      {/if}
    </a>
  </li>
{:else}
  <li class="slot occupant-slot {type} empty" data-index={index}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={(ev) => $context.editable && onSlotClick(ev)}>
      <i class={iconClass}></i>
    </a>
  </li>
{/if}
