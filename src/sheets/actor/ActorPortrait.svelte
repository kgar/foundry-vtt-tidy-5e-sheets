<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import type { ActorSheetContext, ContextMenuOption } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import FloatingContextMenu from 'src/components/context-menu/FloatingContextMenu.svelte';
  import { debug, error } from 'src/utils/logging';
  import { TidyHooks } from 'src/foundry/TidyHooks';

  export let actor: Actor5e;
  export let useHpOverlay: boolean;

  let context = getContext<Readable<ActorSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  $: actorImageTitle = $context.unlocked
    ? `${localize('TIDY5E.EditSheetImageHint')} / ${localize('TIDY5E.SheetImageOptionsHint')}`
    : `${localize('TIDY5E.PreviewSheetImageHint')} / ${localize('TIDY5E.SheetImageOptionsHint')}`;

  function openPortraitPicker(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    if (
      !TidyHooks.tidy5eSheetsPreOpenActorPortraitFilePicker($context, event)
    ) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const current = actor.img;
    const fp = new FilePicker({
      type: 'image',
      current,
      callback: (path: string) => {
        actor.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }

  function onPortraitClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    switch (event.button) {
      case CONSTANTS.MOUSE_BUTTON_MAIN:
        if ($context.unlocked && $context.editable) {
          openPortraitPicker(event);
        } else {
          FoundryAdapter.renderImagePopout($context.actor.img, {
            title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
              subject: $context.actor.name,
            }),
            shareable: true,
            uuid: $context.actor.uuid,
          });
        }
        break;
    }
  }

  let portraitContainer: HTMLElement;
  // TODO: Consider sending context menu options down through document context in the first place.
  let contextMenuOptions: ContextMenuOption[] = [];
  $: {
    try {
      contextMenuOptions = $context.actorPortraitCommands.map((c) => ({
        name: c.label ?? '',
        icon: !isNil(c.iconClass, '') ? `<i class="${c.iconClass}"></i>` : '',
        callback: () => c.execute?.({ actor, context: $context }),
      }));
    } catch (e) {
      error('An error occurred while getting context menu options', false, e);
      debug('Context menu option error troubleshooting info', {
        portraitContainer,
        commands: $context.actorPortraitCommands,
      });
    }
  }
</script>

<FloatingContextMenu
  containingElement={portraitContainer}
  targetSelector="[data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
    .ACTOR_PORTRAIT_CONTAINER}]"
  options={contextMenuOptions}
></FloatingContextMenu>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={portraitContainer}
  class="portrait"
  class:round-portrait={$context.useRoundedPortraitStyle}
  on:mousedown={onPortraitClick}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_CONTAINER}
>
  <div
    class="actor-image-wrap"
    class:overlay={useHpOverlay}
    style="--overlay-height: calc(100% - {$context.healthPercentage}%)"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_HEALTH_OVERLAY}
  >
    <img
      class="actor-image"
      src={actor.img}
      alt={actor.name}
      title={actorImageTitle}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_IMAGE}
    />
  </div>
</div>

<style lang="scss">
  .portrait,
  .actor-image-wrap,
  .actor-image {
    width: 100%;
    height: 100%;
  }

  .portrait {
    border-radius: 0.3125rem;
    overflow: hidden;
  }

  .actor-image-wrap {
    position: relative;
    overflow: hidden;
  }

  .actor-image-wrap.overlay::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: var(--t5e-hp-overlay-background);
    transition: height 0.5s ease-in-out;
    mix-blend-mode: multiply;
    height: var(--overlay-height);
  }

  .actor-image {
    background: var(--t5e-icon-background);
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  .portrait,
  .portrait .actor-image-wrap,
  .portrait .actor-image {
    border-radius: 0.3125rem;
  }

  .portrait.round-portrait,
  .portrait.round-portrait .actor-image-wrap,
  .portrait.round-portrait .actor-image {
    border-radius: 50%;
  }
</style>
