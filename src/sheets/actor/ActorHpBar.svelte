<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
    import { clamp, isRealNumber } from 'src/utils/numbers';

  export let actor: Actor5e;

  $: hpBarCalculationCurrent =
    (100 /
      ((isRealNumber(actor.system?.attributes?.hp?.max)
        ? actor.system.attributes.hp.max
        : 1) +
        (isRealNumber(actor.system?.attributes?.hp?.tempmax)
          ? actor.system.attributes.hp.tempmax
          : 0))) *
      (isRealNumber(actor.system?.attributes?.hp?.value)
        ? actor.system.attributes.hp.value!
        : 0) +
    (isRealNumber(actor.system?.attributes?.hp?.temp)
      ? actor.system.attributes.hp.temp
      : 0);
  $: clampedHpBarCalculationCurrent = clamp(hpBarCalculationCurrent, 0, 100);
</script>

<div class="hp-bar" style="width: calc({clampedHpBarCalculationCurrent}%)" />

<style lang="scss">
  .hp-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: -1;
    background: var(--t5ek-hp-bar-color);
    transition: width 0.5s ease;
  }
</style>
