<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div
  class="encumbrance"
  class:encumbered={$store.encumbrance.encumbered}
  title={localize('T5EK.Encumbrance')}
>
  <span class="encumbrance-bar" style="width:{$store.encumbrance.pct}%" />
  <span class="encumbrance-label"
    >{$store.encumbrance.value} / {$store.encumbrance.max}</span
  >
  <i class="encumbrance-breakpoint encumbrance-33 arrow-up" />
  <i class="encumbrance-breakpoint encumbrance-33 arrow-down" />
  <i class="encumbrance-breakpoint encumbrance-66 arrow-up" />
  <i class="encumbrance-breakpoint encumbrance-66 arrow-down" />
</div>

<style lang="scss">
  .encumbrance {
    background: var(--t5ek-light-color);
    border-radius: 0.3125rem;
    position: relative;
    box-shadow: 0 0 0 0.0625rem var(--t5ek-encumbrance-outline-color) inset;

    .encumbrance-bar {
      position: absolute;
      top: 0.0625rem;
      --count-font: rgba(0, 0, 0, 0.9);
      left: 0.0625rem;
      bottom: 0.0625rem;
      max-width: calc(100% - 0.125rem);
      border: 0.0625rem solid var(--t5ek-encumbrance-bar-outline-color);
      background: var(--t5ek-encumbrance-bar-background);
      border-radius: 0.25rem;
    }

    .encumbrance-label {
      display: block;
      position: relative;
      width: 100%;
      text-align: center;
      font-weight: 700;
      color: var(--t5ek-encumbrance-text-color);
      text-shadow: 0 0 0.125rem #000;
    }

    .encumbrance-breakpoint {
      position: absolute;
      width: 0;
      height: 0;
      transform: translateX(-50%);
      border: 0.25rem solid transparent;
    }

    .encumbrance-33 {
      left: calc(100% / 3);
    }

    .encumbrance-66 {
      left: calc((100% / 3) * 2);
    }

    .arrow-up {
      bottom: 0;
      border-bottom-color: var(--t5ek-encumbrance-outline-color);
    }

    .arrow-down {
      top: 0;
      border-top-color: var(--t5ek-encumbrance-outline-color);
    }
  }
</style>
