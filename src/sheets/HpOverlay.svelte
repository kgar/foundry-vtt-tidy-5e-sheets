<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import { isRealNumber } from 'src/utils/numbers';

  export let useRoundedPortraitStyle: boolean;
  export let actor: Actor5e;

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
</script>

<div class="hp-overlay-wrapper" class:rounded={useRoundedPortraitStyle}>
  <div
    class="hp-overlay"
    style="height: calc(100% - {hpOverlayCalculationCurrent}%)"
  />
  <div class="hp-bar-spacer" />
</div>

<style lang="scss">
  .hp-overlay-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.3125rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &.rounded {
      border-radius: 50%;
    }

    .hp-overlay {
      position: relative;
      bottom: 0;
      background: var(--t5ek-hp-overlay-background);
      transition: height 0.5s ease-in-out;
    }

    .hp-bar-spacer {
      flex: 0 0 1.25rem;
    }
  }
</style>
