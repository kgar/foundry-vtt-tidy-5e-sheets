<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ContainerSheetContext>>('context');

  $: readableValue =
    $context.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? ($context.capacity.value ?? 0).toFixed(2)
      : Math.ceil($context.capacity.value ?? 0);

  $: capacityLabel = `${readableValue}/${$context.capacity.max} ${$context.capacity.units}`;

  const localize = FoundryAdapter.localize;
</script>

<div
  class="tidy-capacity"
  role="meter"
  aria-label={localize('DND5E.ItemContainerCapacity')}
  title={capacityLabel}
  aria-valuetext={capacityLabel}
  aria-valuemin="0"
  aria-valuenow={$context.capacity.value}
  aria-valuemax={$context.capacity.max}
  style="--percentage: {Math.round($context.capacity.pct)}%"
>
  <span class="capacity-label">
    {capacityLabel}
  </span>
</div>

<style lang="scss">
  .tidy-capacity {
    position: relative;
    height: 1rem;
    border-radius: 0.1875rem;
    background: var(--t5e-capacity-container-background);
    border: 1px solid var(--t5e-capacity-container-border-color);

    &::before {
      content: '';
      position: absolute;
      inline-size: var(--percentage);
      inset: 0;
      max-inline-size: calc(100% - 4px);
      margin: 1px;
      border: 1px solid var(--t5e-capacity-border-color);
      border-radius: 2px;
      background: var(--t5e-capacity-background);
    }

    .capacity-label {
      font-size: 0.75rem;
      display: block;
      position: relative;
      width: 100%;
      text-align: center;
      color: var(--t5e-capacity-text-color);
      text-shadow:
        0 0 0.125rem var(--t5e-capacity-bar-text-shadow-color),
        0 0 0.125rem var(--t5e-capacity-bar-text-shadow-color),
        0 0 0.125rem var(--t5e-capacity-bar-text-shadow-color);
    }
  }
</style>
