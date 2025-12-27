<script lang="ts">
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';
  import { EventHelper } from 'src/utils/events';
  import { getContext } from 'svelte';
  import { getCharacterSheetContext, getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    occupant: Actor5e | undefined;
    uuid: string | undefined;
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
    uuid,
  }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

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

  let hoveredFacilityOccupant = getContext<Ref<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );

  let localize = FoundryAdapter.localize;
</script>

{#if uuid}
  {@const imageTypeClassName = occupant?.token ? 'token' : 'portrait'}
  {@const imageSrc =
    imageTypeClassName == 'token' ? occupant?.token.img : occupant?.img}
  {@const name = occupant ? occupant.name : localize('TIDY5E.BrokenLink')}

  <li
    class:highlight={hoveredFacilityOccupant.value ===
      `${facilityId}-${index}-${uuid}`}
    class:unlocked={context.unlocked}
    class="slot member-slot {type} {imageTypeClassName} occupant-with-menu"
    data-actor-uuid={uuid}
    data-tooltip={name}
    data-facility-id={facilityId}
    data-facility-name={facilityName}
    data-prop={prop}
    data-index={index}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS}
    onmouseenter={() =>
      (hoveredFacilityOccupant.value = `${facilityId}-${index}-${uuid}`)}
    onmouseleave={() => (hoveredFacilityOccupant.value = '')}
  >
    <a onclick={(ev) => context.editable && onOccupantClick(ev)}>
      {#if occupant}
        <img src={imageSrc} alt={name} />
      {:else}
        <i class="fa-solid fa-link-slash broken-link-icon"></i>
      {/if}

      {#if context.unlocked}
        <i class="fa-solid fa-cog occupant-menu-icon"></i>
      {/if}
    </a>
  </li>
{:else}
  <li class="slot member-slot {type} empty" data-index={index}>
    <a onclick={(ev) => context.editable && onSlotClick(ev)}
      class="button button-tertiary button-icon-only">
      <i class={iconClass}></i>
    </a>
  </li>
{/if}
