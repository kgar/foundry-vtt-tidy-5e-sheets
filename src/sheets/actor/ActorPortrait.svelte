<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';

  export let actor: Actor5e;
  export let useRoundedPortraitStyle: boolean;

  let showPortraitMenu = false;
  const localize = FoundryAdapter.localize;

  function openPortraitPicker(target: HTMLImageElement) {
    const rect = target.getBoundingClientRect();
    const current = actor.img;
    const fp = new FilePicker({
      type: 'image',
      current,
      callback: (path) => {
        target.src = path;
        actor.sheet.submit();
        actor.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }

  function onPortraitClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLImageElement }
  ) {
    switch (event.button) {
      case CONSTANTS.MOUSE_BUTTON_MAIN:
        // showPortraitMenu = false;
        openPortraitPicker(event.currentTarget);
        break;
      case CONSTANTS.MOUSE_BUTTON_AUXILIARY:
        break;
      case CONSTANTS.MOUSE_BUTTON_SECONDARY:
        showPortraitMenu = !showPortraitMenu;
        break;
    }
  }
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="portrait" class:round-portrait={useRoundedPortraitStyle}>
  <img
    class="player-image"
    src={actor.img}
    alt={actor.name}
    title={localize('T5EK.EditActorImage') +
      ' / ' +
      localize('T5EK.ShowActorImage')}
    on:mousedown={onPortraitClick}
  />
  {#if showPortraitMenu}
    <div class="portrait-menu">
      <a
        class="portrait-menu-item"
        on:click={() =>
          new ImagePopout(actor.img, {
            title: 'Portrait: ' + actor.name,
            shareable: true,
            uuid: actor.uuid,
          }).render(true)}>{localize('T5EK.ShowPortraitArt')}</a
      >
      <a
        class="portrait-menu-item"
        on:click={() =>
          new ImagePopout(actor.prototypeToken.texture.src, {
            title: 'Portrait: ' + actor.name,
            shareable: true,
            uuid: actor.uuid,
          }).render(true)}>{localize('T5EK.ShowTokenArt')}</a
      >
    </div>
  {/if}
</div>

<style lang="scss">
  .portrait {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid var(--t5e-icon-outline);
    position: relative;
    mix-blend-mode: multiply;
    z-index: 2;

    .portrait-menu {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
      display: flex;
      flex-direction: column;

      .portrait-menu-item {
        background: var(--t5e-background);
        color: var(--t5e-primary-font);
        border: none;
        margin: 1px 0;
        padding: 4px 6px;
        line-height: 1;
        font-size: 12px;
        border: 1px solid var(--t5e-light-color);
        border-radius: 5px;
        text-align: center;

        &:hover {
          background: var(--t5e-background);
          color: var(--t5e-primary-accent);
        }
      }
    }
  }

  .player-image {
    background: var(--t5e-icon-background);
    box-shadow: 0 0 10px var(--t5e-icon-shadow) inset;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  .portrait.round-portrait,
  .portrait.round-portrait .player-image {
    border-radius: 50%;
  }
</style>
