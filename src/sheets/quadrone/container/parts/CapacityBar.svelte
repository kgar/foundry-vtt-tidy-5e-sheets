<script module lang="ts">
  // TODO: Should I somehow make these thresholds configurable?
  const encumberedPct = (1 / 3) * 100;
  const heavilyEncumberedPct = (2 / 3) * 100;
</script>

<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetQuadroneContext,
    Item5e,
  } from 'src/types/item.types';
  import type {
    ActorSheetQuadroneContext,
    ContainerCapacityContext,
  } from 'src/types/types';
  import CapacityTracker from './CapacityTracker.svelte';
  import WeightDistributionTooltip from 'src/tooltips/WeightDistributionTooltip.svelte';
  import { systemSettings } from 'src/settings/settings.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import { getThemeV2 } from 'src/theme/theme';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showTracker?: boolean;
  }

  let { container, capacity, showTracker = true }: Props = $props();

  let percentage = $derived(Math.round(capacity.pct));

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext | ContainerSheetQuadroneContext
      >(),
    );

  let barSeverity = $derived(
    percentage > heavilyEncumberedPct
      ? `high`
      : percentage > encumberedPct
        ? `medium`
        : `low`,
  );

  let weightDistributionTooltip: WeightDistributionTooltip;

  function showWeightDistributionTooltip(
    event: Event & { currentTarget: EventTarget & HTMLElement },
  ): any {
    if (!systemSettings.value.currencyWeight) {
      return;
    }

    Tooltip.show(
      event?.currentTarget,
      weightDistributionTooltip.getMarkup(),
      getThemeV2(context.document),
    );
  }
</script>

<div class="hidden">
  <WeightDistributionTooltip
    bind:this={weightDistributionTooltip}
    fullWeight={container.system.contentsWeight}
    currencyWeight={container.system.currencyWeight}
  />
</div>

<div
  class={[
    'meter progress capacity theme-dark',
    { empty: (capacity.value ?? 0) === 0 },
    barSeverity,
  ]}
  role="meter"
  aria-label={localize('DND5E.CONTAINER.FIELDS.capacity.label')}
  aria-valuemin="0"
  aria-valuenow={capacity.pct}
  aria-valuetext={(capacity.value ?? 0).toString()}
  aria-valuemax={capacity.max}
  style="--bar-percentage: {percentage}%;"
  data-tooltip-direction="UP"
  onmouseover={(ev) => showWeightDistributionTooltip(ev)}
  onfocus={(ev) => showWeightDistributionTooltip(ev)}
>
  {#if showTracker}
    {@render tracker()}
  {/if}
</div>

{#snippet tracker()}
  <CapacityTracker {capacity} {container} />
{/snippet}
