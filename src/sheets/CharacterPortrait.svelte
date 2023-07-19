<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import type { SheetFunctions } from 'src/types/types';

  export let sheetFunctions: SheetFunctions;
  export let actor: Actor5e;

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
        sheetFunctions.submit();
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

<div class="portrait">
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
