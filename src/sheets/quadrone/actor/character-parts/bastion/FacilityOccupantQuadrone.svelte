<script lang="ts">
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
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

    const result = await dnd5e.applications.CompendiumBrowser.selectOne(
      {
        filters: {
          locked: {
            documentClass: 'Actor',
            types: new Set(['character', 'npc', 'vehicle', 'group']),
          },
        },
      },
      context.sheet._detachOptions(),
    );

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

  const linkAttributes = $derived(
    context.editable && context.unlocked
      ? {
          'data-action': 'showContextMenu',
          'data-target-selector': '[data-actor-uuid]',
        }
      : context.editable && !context.unlocked
        ? {
            'data-action': 'showDocument',
            'data-uuid': occupant.uuid,
          }
        : {},
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
    data-tidy-draggable
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
    <a class="item-image-link" {...linkAttributes}>
      {#if occupant}
        <img class="item-image" src={imageSrc} alt={name} />
      {:else}
        <i class="fa-solid fa-link-slash broken-link-icon"></i>
      {/if}

      {#if context.unlocked}
        <i class="fa-solid fa-ellipsis-vertical occupant-menu-icon"></i>
      {/if}
    </a>
  </li>
{:else}
  <li class="slot member-slot {type} empty" data-index={index}>
    <a
      onclick={(ev) => context.editable && onSlotClick(ev)}
      class="button button-tertiary button-icon-only"
    >
      <i class={iconClass}></i>
    </a>
  </li>
{/if}
