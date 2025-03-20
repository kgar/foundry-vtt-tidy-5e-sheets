<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showIcon?: boolean;
  }

  let { container, capacity, showIcon = true }: Props = $props();

  let readableValue = $derived(
    container.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? (capacity.value ?? 0).toFixed(1)
      : Math.ceil(capacity.value ?? 0).toString(),
  );

  let capacityMaxText = $derived(
    capacity.max === Infinity ? '∞' : capacity.max,
  );

  let unitsAbbreviation = $derived(container.system.weight.units);
</script>

<div class="label">
  {#if showIcon}
    <i class="fas fa-weight-hanging text-label-icon"></i>
  {/if}
  <span class="value text-data">{readableValue}</span>
  <span class="separator">/</span>
  <span class="max text-data">{capacityMaxText}</span>
  <span class="units text-label">{unitsAbbreviation}</span>
</div>
