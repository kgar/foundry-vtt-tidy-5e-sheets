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
      ? (capacity.value ?? 0).toFixed(1)
      : Math.ceil(capacity.value ?? 0).toString();

  $: percentage = Math.round(capacity.pct);
  
  const localize = FoundryAdapter.localize;

  $: barSeverity =
    percentage > 70 ? `high` : percentage > 30 ? `medium` : `low`;
</script>

<div
  class="meter progress"
  role="meter"
  aria-valuemin="0"
  aria-valuenow={capacity.pct}
  aria-valuetext={readableValue}
  aria-valuemax={capacity.max}
  style="--bar-percentage: {percentage}%;"
  data-bar-severity={barSeverity}
>
  <div class="label">
    <i class="fas fa-weight-hanging"></i>
    <span class="value">{readableValue}</span>
    <span class="separator">/</span>
    <span class="max">{capacity.max}</span>
  </div>
</div>
