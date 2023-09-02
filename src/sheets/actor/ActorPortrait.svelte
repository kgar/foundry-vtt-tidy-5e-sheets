<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import { isRealNumber } from 'src/utils/numbers';

  export let actor: Actor5e;
  export let useRoundedPortraitStyle: boolean;
  export let useHpOverlay: boolean;

  let showPortraitMenu = false;
  const localize = FoundryAdapter.localize;

  $: hpOverlayCalculationCurrent =
    (100 /
      ((isRealNumber(actor.system?.attributes?.hp?.max)
        ? actor.system.attributes.hp.max
        : 1) +
        (isRealNumber(actor.system?.attributes?.hp?.tempmax)
          ? actor.system.attributes.hp.tempmax
          : 0))) *
      (isRealNumber(actor.system?.attributes?.hp?.value)
        ? actor.system.attributes.hp.value
        : 0) +
    (isRealNumber(actor.system?.attributes?.hp?.temp)
      ? actor.system.attributes.hp.temp
      : 0);

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
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="portrait"
  class:round-portrait={useRoundedPortraitStyle}
  on:mousedown={onPortraitClick}
>
  <div
    class="actor-image-wrap"
    class:overlay={useHpOverlay}
    style="--overlay-height: calc(100% - {hpOverlayCalculationCurrent}%)"
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
    box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow) inset;
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
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
    display: flex;
    flex-direction: column;

    .portrait-menu-item {
      background: var(--t5ek-background);
      color: var(--t5ek-primary-font-color);
      border: none;
      margin: 1px 0;
      padding: 4px 6px;
      line-height: 1;
      font-size: 12px;
      border: 1px solid var(--t5ek-light-color);
      border-radius: 5px;
      text-align: center;

      &:hover {
        background: var(--t5ek-background);
        color: var(--t5ek-primary-accent);
      }
    }
  }
</style>
