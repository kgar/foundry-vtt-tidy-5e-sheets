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
    trackerPosition?: 'inside' | 'left';
    showUnits?: boolean;
    showIcon?: boolean;
  }

  let {
    container,
    capacity,
    trackerPosition: trackerPosition = 'inside',
    showUnits = false,
    showIcon = true,
  }: Props = $props();

  let readableValue = $derived(
    container.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? (capacity.value ?? 0).toFixed(1)
      : Math.ceil(capacity.value ?? 0).toString(),
  );

  let percentage = $derived(Math.round(capacity.pct));

  let unitsAbbreviation = $derived(container.system.weight.units);

  const localize = FoundryAdapter.localize;

  let barSeverity = $derived(
    percentage > heavilyEncumberedPct
      ? `high`
      : percentage > encumberedPct
        ? `medium`
        : `low`,
  );

  let capacityMaxText = $derived(
    capacity.max === Infinity ? '∞' : capacity.max,
  );
</script>

{#if trackerPosition === 'left'}
  {@render tracker()}
{/if}

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
  {#if trackerPosition === 'inside'}
    {@render tracker()}
  {/if}
</div>

{#snippet tracker()}
  <div class="label">
    {#if showIcon}
      <i class="fas fa-weight-hanging"></i>
    {/if}
    <span class="value">{readableValue}</span>
    <span class="separator">/</span>
    <span class="max">{capacityMaxText}</span>
    {#if showUnits}
      <span class="units">{unitsAbbreviation}</span>
    {/if}
  </div>
{/snippet}
