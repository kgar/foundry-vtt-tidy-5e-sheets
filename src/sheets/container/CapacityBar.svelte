<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';

  export let container: Item5e;
  export let capacity: ContainerCapacityContext;
  export let showLabel = true;

  $: readableValue =
    container.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? (capacity.value ?? 0).toFixed(2)
      : Math.ceil(capacity.value ?? 0);

  $: capacityLabel = `${readableValue}/${capacity.max} ${capacity.units}`;

  const localize = FoundryAdapter.localize;
</script>

<div
  class="tidy-capacity"
  role="meter"
  aria-label={localize('DND5E.ItemContainerCapacity')}
  title={capacityLabel}
  aria-valuetext={capacityLabel}
  aria-valuemin="0"
  aria-valuenow={capacity.value}
  aria-valuemax={capacity.max}
  style="--percentage: {Math.round(capacity.pct)}%"
>
  {#if showLabel}
    <span class="capacity-label">
      {capacityLabel}
    </span>
  {/if}
</div>

<style lang="scss">
  .tidy-capacity {
    position: relative;
    height: var(--capacity-bar-height, 1rem);
    border-radius: var(--capacity-bar-container-border-radius, 0.1875rem);
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
      transition: width 0.5s ease;
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
