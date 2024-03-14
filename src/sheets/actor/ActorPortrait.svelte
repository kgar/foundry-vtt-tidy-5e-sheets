<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import type { ActorSheetContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let actor: Actor5e;
  export let useHpOverlay: boolean;

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function openPortraitPicker(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    if (
      !Hooks.call('tidy5e-sheet.preOpenActorPortraitFilePicker', context, event)
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
        openPortraitPicker(event);
        break;
    }
  }

  let portraitContainer: HTMLElement;
  onMount(() => {
    new FloatingContextMenu(
      FoundryAdapter.getJqueryWrappedElement(portraitContainer),
      '.portrait',
      [],
      {
        onOpen: () => {
          ui.context.menuItems = $context.actorPortraitCommands.map((c) => ({
            name: c.label,
            icon: !isNil(c.iconClass, '')
              ? `<i class="${c.iconClass}"></i>`
              : '',
            callback: () => c.execute?.({ actor, context: $context }),
          }));
        },
      },
    );
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={portraitContainer}
  class="portrait"
  class:round-portrait={$context.useRoundedPortraitStyle}
  on:mousedown={onPortraitClick}
>
  <div
    class="actor-image-wrap"
    class:overlay={useHpOverlay}
    style="--overlay-height: calc(100% - {$context.healthPercentage}%)"
  >
    <img
      class="actor-image"
      src={actor.img}
      alt={actor.name}
      title={localize('TIDY5E.EditActorImage') +
        ' / ' +
        localize('TIDY5E.ShowActorImage')}
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
