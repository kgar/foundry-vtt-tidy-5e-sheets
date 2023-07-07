<script lang="ts">
  import type { Actor5e } from 'src/foundry/foundry-adapter';
  import { isRealNumber } from 'src/utils/numbers';

  export let useRoundedPortraitStyle: boolean;
  export let actor: Actor5e;

  const hpOverlayCalculationCurrent =
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
</script>

<div
  class="hp-overlay-wrapper"
  class:rounded={useRoundedPortraitStyle}
  data-border="0px"
>
  <div
    class="hp-overlay"
    style="background: linear-gradient(
            0deg,
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 0, 0, 1) calc(100% - {hpOverlayCalculationCurrent}%),
             rgba(255, 255, 255, 1) calc(100% - {hpOverlayCalculationCurrent}%),
             rgba(255, 255, 255, 1) 100%);"
  />
</div>

<style lang="scss">
  .hp-overlay-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;

    &::before {
      content: '';
      display: block;
      background: transparent;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      border-radius: 50%;
      border: 0px solid #fff;
      border-width: var(--t5e-pc-border);
      z-index: 1;
    }

    .hp-overlay {
      height: calc(100% - 20px);
    }
  }

  .rounded {
    border-radius: 50%;
  }
</style>
