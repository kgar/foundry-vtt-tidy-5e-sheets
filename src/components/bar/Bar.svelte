<script lang="ts">
  import { getPercentage } from 'src/utils/numbers';

  interface Props {
    value?: number | null | undefined;
    max?: number | null | undefined;
    percentage?: number | null;
    color?: string;
    cssClass?: string | null;
  }

  let {
    value = null,
    max = null,
    percentage = null,
    color = 'var(--t5e-hp-bar-color)',
    cssClass = null,
  }: Props = $props();

  let barPercentage = $derived(percentage ?? getPercentage(value, max));
</script>

<div
  class="bar {cssClass}"
  style="width: {barPercentage}%; --bar-color: {color}"
></div>

<style lang="less">
  .bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--bar-color);
    transition: width 0.5s ease;
  }
</style>
