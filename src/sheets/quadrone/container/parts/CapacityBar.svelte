<script module lang="ts">
  // TODO: Should I somehow make these thresholds configurable?
  const encumberedPct = (1 / 3) * 100;
  const heavilyEncumberedPct = (2 / 3) * 100;
</script>

<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';
  import CapacityTracker from './CapacityTracker.svelte';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showTracker?: boolean;
  }

  let { container, capacity, showTracker = true }: Props = $props();

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
  class="meter progress theme-dark"
  role="meter"
  aria-label={localize('DND5E.CONTAINER.FIELDS.capacity.label')}
  aria-valuemin="0"
  aria-valuenow={capacity.pct}
  aria-valuetext={(capacity.value ?? 0).toString()}
  aria-valuemax={capacity.max}
  style="--bar-percentage: {percentage}%;"
  data-bar-severity={barSeverity}
>
  {#if showTracker}
    {@render tracker()}
  {/if}
</div>

{#snippet tracker()}
  <CapacityTracker {capacity} {container} />
{/snippet}
