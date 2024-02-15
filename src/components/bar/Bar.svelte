<script lang="ts">
  import { getPercentage } from 'src/utils/numbers';

  export let value: number | null | undefined = null;
  export let max: number | null | undefined = null;
  export let percentage: number | null = null;
  export let color: string = 'var(--t5e-hp-bar-color)';
  export let cssClass: string | null = null;

  $: barPercentage = percentage ?? getPercentage(value, max);
</script>

<div
  class="bar {cssClass}"
  style="width: {barPercentage}%; --bar-color: {color}"
/>

<style lang="scss">
  .bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--bar-color);
    transition: width 0.5s ease;
  }
</style>
