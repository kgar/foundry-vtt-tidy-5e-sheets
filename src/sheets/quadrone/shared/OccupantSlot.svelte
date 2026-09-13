<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  interface Props {
    /** The assigned actor. When `uuid` is set without an actor, the link is broken. */
    occupant: Actor5e | undefined;
    /** The assigned actor's UUID. When unset, the slot is empty. */
    uuid: string | undefined;
    /** The kind of occupant, applied as a slot class. */
    type: string;
    /** The icon shown in an empty slot. */
    iconClass: string;
    contextMenuType: string;
    /** The sheet action which fills an empty slot. */
    addAction: string;
    /** Accessible label for filling an empty slot. */
    addLabel?: string;
    /** Data attributes which identify the slot to its context menu and sheet actions. */
    attributes?: Record<string, unknown>;
    /** When set, the slot highlights alongside anything else hovering the same key. */
    highlightKey?: string;
    draggable?: boolean;
  }

  let {
    occupant,
    uuid,
    type,
    iconClass,
    contextMenuType,
    addAction,
    addLabel,
    attributes = {},
    highlightKey,
    draggable = false,
  }: Props = $props();

  let context = $derived(getSheetContext());

  let hoveredOccupant = getContext<Ref<string> | undefined>(
    CONSTANTS.SVELTE_CONTEXT.HOVERED_FACILITY_OCCUPANT,
  );

  // Broken links always offer their menu, so they can be replaced or removed.
  const linkAttributes = $derived(
    context.unlocked || (context.editable && !occupant)
      ? {
          'data-action': 'showContextMenu',
          'data-target-selector': '[data-context-menu]',
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
    {...attributes}
    class={[
      'slot',
      'member-slot',
      type,
      imageTypeClassName,
      'occupant-with-menu',
      {
        broken: !occupant,
        highlight: !!highlightKey && hoveredOccupant?.value === highlightKey,
        unlocked: context.unlocked,
      },
    ]}
    data-tidy-draggable={draggable ? '' : null}
    data-tooltip={name}
    data-context-menu={contextMenuType}
    onmouseenter={() => {
      if (highlightKey && hoveredOccupant) {
        hoveredOccupant.value = highlightKey;
      }
    }}
    onmouseleave={() => {
      if (highlightKey && hoveredOccupant) {
        hoveredOccupant.value = '';
      }
    }}
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
  <li {...attributes} class={['slot', 'member-slot', type, 'empty']}>
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      role="button"
      tabindex="0"
      data-action={addAction}
      aria-label={addLabel}
      data-tooltip={addLabel ? '' : null}
      class="button button-tertiary button-icon-only"
      {@attach InputAttachments.triggerClickOnKeydown}
    >
      <i class={iconClass}></i>
    </a>
  </li>
{/if}
