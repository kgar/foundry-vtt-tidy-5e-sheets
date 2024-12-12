<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showLabel?: boolean;
  }

  let { container, capacity, showLabel = true }: Props = $props();

  let readableValue = $derived(
    container.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? (capacity.value ?? 0).toFixed(2)
      : Math.ceil(capacity.value ?? 0),
  );

  let capacityLabel = $derived(
    `${readableValue}/${capacity.max} ${capacity.units}`,
  );

  let percentage = $derived(Math.round(capacity.pct));
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
  style="--percentage: {percentage}%"
  class:empty={percentage === 0}
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
    background: var(--t5e-light-color);
    border: 0.0625rem solid var(--t5e-separator-color);

    &:not(.empty)::before {
      content: '';
      position: absolute;
      inline-size: var(--percentage);
      inset: 0;
      max-inline-size: calc(100% - 0.25rem);
      margin: 0.0625rem;
      border: 0.0625rem solid var(--t5e-encumbrance-bar-outline-color);
      border-radius: 0.125rem;
      background: var(--t5e-encumbrance-bar-background);
      transition: width 0.5s ease;
    }

    .capacity-label {
      font-size: 0.75rem;
      display: block;
      position: relative;
      width: 100%;
      text-align: center;
      color: var(--t5e-encumbrance-text-color);
      text-shadow:
        0 0 0.125rem var(--t5e-encumbrance-bar-text-shadow-color),
        0 0 0.125rem var(--t5e-encumbrance-bar-text-shadow-color),
        0 0 0.125rem var(--t5e-encumbrance-bar-text-shadow-color);
    }
  }
</style>
