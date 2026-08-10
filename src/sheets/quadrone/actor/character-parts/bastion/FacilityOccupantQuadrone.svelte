<script lang="ts">
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

  let context = $derived(getCharacterSheetQuadroneContext());

  let hoveredFacilityOccupant = getContext<Ref<string>>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );

  const linkAttributes = $derived(
    context.unlocked
      ? {
          'data-action': 'showContextMenu',
          'data-target-selector': '[data-actor-uuid]',
        }
      : context.editable && occupant
        ? {
            'data-action': 'showDocument',
            'data-uuid': occupant.uuid,
          }
        : {},
  );

  let localize = FoundryAdapter.localize;
</script>

{#if uuid}
  {const imageTypeClassName = $derived(occupant?.token ? 'token' : 'portrait')}
  {const imageSrc = $derived(
    imageTypeClassName == 'token' ? occupant?.token.img : occupant?.img,
  )}
  {const name = $derived(
    occupant ? occupant.name : localize('TIDY5E.BrokenLink'),
  )}

  <li
    class={[
      'slot',
      'member-slot',
      type,
      imageTypeClassName,
      'occupant-with-menu',
      {
        highlight:
          hoveredFacilityOccupant.value === `${facilityId}-${index}-${uuid}`,
        unlocked: context.unlocked,
      },
    ]}
    data-actor-uuid={uuid}
    data-tidy-draggable
    data-tooltip={name}
    data-facility-name={facilityName}
    data-index={index}
    data-action="addOccupant"
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
      data-action="addOccupant"
      class="button button-tertiary button-icon-only"
    >
      <i class={iconClass}></i>
    </a>
  </li>
{/if}
