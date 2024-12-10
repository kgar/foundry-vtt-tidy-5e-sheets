<script lang="ts">
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';
  import { getContext } from 'svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
    import type { ContextPrimitive } from 'src/features/reactivity/reactivity.types';

  interface Props {
    occupant: Actor5e | undefined;
    index: number;
    type: string;
    iconClass: string;
    facilityId: string;
    facilityName: string;
    prop: string;
  }

  let {
    occupant,
    index,
    type,
    iconClass,
    facilityId,
    facilityName,
    prop,
  }: Props = $props();

  let context = $derived(getCharacterSheetContext());

  function onOccupantClick(
    event: (MouseEvent | PointerEvent) & { currentTarget: HTMLElement },
  ) {
    if (context.unlocked) {
      EventHelper.triggerContextMenu(event, '[data-actor-uuid]');
      return;
    }
    occupant.sheet.render(true);
  }

  async function onSlotClick(ev: Event) {
    if (
      !TidyHooks.tidy5eSheetsFacilityEmptyOccupantSlotClicked(
        ev,
        context.actor.items.get(facilityId),
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
      context.actor.sheet._onDropActorAddToFacility(
        context.actor.items.get(facilityId),
        prop,
        result,
      );
    }
  }

  let hoveredFacilityOccupant = getContext<ContextPrimitive<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );
</script>

{#if occupant}
  {@const imageTypeClassName = occupant.token ? 'token' : 'portrait'}
  {@const imageSrc =
    imageTypeClassName == 'token' ? occupant.token.img : occupant.img}
  <!-- svelte-ignore a11y_missing_attribute -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <li
    class:highlight={hoveredFacilityOccupant.value ===
      `${facilityId}-${index}-${occupant.uuid}`}
    class:unlocked={context.unlocked}
    class="slot occupant-slot {type} {imageTypeClassName} occupant-with-menu"
    data-actor-uuid={occupant.uuid}
    data-tooltip={occupant.name}
    data-facility-id={facilityId}
    data-facility-name={facilityName}
    data-prop={prop}
    data-index={index}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
    onmouseenter={() =>
      (hoveredFacilityOccupant.value = `${facilityId}-${index}-${occupant.uuid}`)}
    onmouseleave={() => (hoveredFacilityOccupant.value = '')}
  >
    <a onclick={(ev) => context.editable && onOccupantClick(ev)}>
      <img src={imageSrc} alt={occupant.name} />

      {#if context.unlocked}
        <i class="fa-solid fa-cog occupant-menu-icon"></i>
      {/if}
    </a>
  </li>
{:else}
  <li class="slot occupant-slot {type} empty" data-index={index}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_missing_attribute -->
    <a onclick={(ev) => context.editable && onSlotClick(ev)}>
      <i class={iconClass}></i>
    </a>
  </li>
{/if}
