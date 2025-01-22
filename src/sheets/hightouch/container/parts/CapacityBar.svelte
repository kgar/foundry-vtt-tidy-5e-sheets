<script module lang="ts">
  // TODO: Should I somehow make these thresholds configurable?
  const encumberedPct = (1 / 3) * 100;
  const heavilyEncumberedPct = (2 / 3) * 100;
</script>

<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
  }

  let { container, capacity }: Props = $props();

  let readableValue = $derived(
    container.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? (capacity.value ?? 0).toFixed(1)
      : Math.ceil(capacity.value ?? 0).toString(),
  );

  let percentage = $derived(Math.round(capacity.pct));

  const localize = FoundryAdapter.localize;

  let barSeverity = $derived(
    percentage > heavilyEncumberedPct
      ? `high`
      : percentage > encumberedPct
        ? `medium`
        : `low`,
  );
</script>

<div
  class="meter progress"
  role="meter"
  aria-label={localize('DND5E.CONTAINER.FIELDS.capacity.label')}
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
