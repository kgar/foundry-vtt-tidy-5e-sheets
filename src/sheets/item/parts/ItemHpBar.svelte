<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import { clamp, isRealNumber } from 'src/utils/numbers';

  export let item: Item5e;

  $: hpBarCalculationCurrent =
    (100 / (isRealNumber(item.system.hp.max) ? item.system.hp.max : 1)) *
    (isRealNumber(item.system.hp.value) ? item.system.hp.value : 0);
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
