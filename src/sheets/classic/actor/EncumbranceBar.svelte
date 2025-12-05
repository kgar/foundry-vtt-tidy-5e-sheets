<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { EncumbranceContext } from 'src/types/types';

  interface Props {
    encumbrance: EncumbranceContext;
    showStops?: boolean;
  }

  let { encumbrance, showStops = true }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div
  class="encumbrance"
  class:encumbered={encumbrance.encumbered}
  title={localize('TIDY5E.Encumbrance')}
  style="
    --encumbrance-low: {encumbrance.stops?.encumbered ?? (1 / 3) * 100}%; 
    --encumbrance-high: {encumbrance.stops?.heavilyEncumbered ?? (2 / 3) * 100}%
  "
>
  <span class="encumbrance-bar" style="width:{encumbrance.pct}%"></span>
  <span class="encumbrance-label">{encumbrance.value} / {encumbrance.max}</span>

  {#if showStops}
    <i class="encumbrance-breakpoint encumbrance-low arrow-up"></i>
    <i class="encumbrance-breakpoint encumbrance-low arrow-down"></i>
    <i class="encumbrance-breakpoint encumbrance-high arrow-up"></i>
    <i class="encumbrance-breakpoint encumbrance-high arrow-down"></i>
  {/if}
</div>

<style lang="less">
  .encumbrance {
    background: var(--t5e-light-color);
    border-radius: 0.3125rem;
    position: relative;
    box-shadow: 0 0 0 0.0625rem var(--t5e-encumbrance-outline-color) inset;

    .encumbrance-bar {
      position: absolute;
      top: 0.0625rem;
      left: 0.0625rem;
      bottom: 0.0625rem;
      max-width: calc(100% - 0.125rem);
      border: 0.0625rem solid var(--t5e-encumbrance-bar-outline-color);
      background: var(--t5e-encumbrance-bar-background);
      border-radius: 0.25rem;
      transition: width 0.3s ease;
    }

    .encumbrance-label {
      display: block;
      position: relative;
      width: 100%;
      text-align: center;
      font-weight: 700;
      color: var(--t5e-encumbrance-text-color);
      text-shadow: 0 0 0.125rem var(--t5e-encumbrance-bar-text-shadow-color);
    }

    .encumbrance-breakpoint {
      position: absolute;
      width: 0;
      height: 0;
      transform: translateX(-50%);
      border: 0.25rem solid transparent;
    }

    .encumbrance-low {
      inset-inline-start: var(--encumbrance-low, 33%);
    }

    .encumbrance-high {
      inset-inline-start: var(--encumbrance-high, 66%);
    }

    .arrow-up {
      bottom: 0;
      border-bottom-color: var(--t5e-encumbrance-outline-color);
    }

    .arrow-down {
      top: 0;
      border-top-color: var(--t5e-encumbrance-outline-color);
    }
  }
</style>
