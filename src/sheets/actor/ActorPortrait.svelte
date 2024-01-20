<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let actor: Actor5e;
  export let useHpOverlay: boolean;

  let context = getContext<Readable<ActorSheetContext>>('context');

  let showPortraitMenu = false;
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
      case CONSTANTS.MOUSE_BUTTON_AUXILIARY:
        break;
      case CONSTANTS.MOUSE_BUTTON_SECONDARY:
        showPortraitMenu = !showPortraitMenu;
        break;
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
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
      title={localize('T5EK.EditActorImage') +
        ' / ' +
        localize('T5EK.ShowActorImage')}
    />
  </div>
  {#if showPortraitMenu}
    <div class="portrait-menu">
      {#each $context.actorPortraitCommands as command}
        <button
          type="button"
          class="portrait-menu-item"
          on:mousedown={(ev) => ev.stopImmediatePropagation()}
          on:click={(ev) => command.execute?.({ actor, context: $context })}
          title={command.tooltip}
        >
          {#if command.iconClass}
            <i class={command.iconClass}></i>
          {/if}
          {localize(command.label ?? '')}
        </button>
      {/each}
    </div>
  {/if}
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
    background: var(--t5ek-hp-overlay-background);
    transition: height 0.5s ease-in-out;
    mix-blend-mode: multiply;
    height: var(--overlay-height);
  }

  .actor-image {
    background: var(--t5ek-icon-background);
    box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
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

  .portrait-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.75rem;
    line-height: 1;
    white-space: nowrap;
    display: flex;
    flex-direction: column;

    .portrait-menu-item {
      background: var(--t5ek-background);
      color: var(--t5ek-primary-font-color);
      border: none;
      margin: 0.0625rem 0;
      padding: 0.25rem 0.375rem;
      line-height: 1;
      font-size: 0.75rem;
      border: 0.0625rem solid var(--t5ek-light-color);
      border-radius: 0.3125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;

      &:hover {
        background: var(--t5ek-background);
        color: var(--t5ek-primary-accent-color);
      }
    }
  }
</style>
