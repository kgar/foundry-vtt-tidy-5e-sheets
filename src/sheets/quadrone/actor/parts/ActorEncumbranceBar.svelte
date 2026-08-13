<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import WeightDistributionTooltip from 'src/tooltips/WeightDistributionTooltip.svelte';
  import type { Actor5e, EncumbranceContext } from 'src/types/types';

  type Props = {
    actor: Actor5e;
    // Get encumbrance from the system: `attributes.encumbrance`, or
    // `VehicleData#getEncumbrance()` which adjusts max/pct for draft animals.
    encumbrance: EncumbranceContext;
    hasBreakpoints?: boolean;
  };

  let { actor, encumbrance, hasBreakpoints = true }: Props = $props();

  let percentage = $derived(Math.round(encumbrance.pct));

  // Stops are percentages of max, computed in `AttributesFields.prepareEncumbrance()`.
  // When max is infinite they are 0, not the old 33/66 CSS defaults.
  let encumberedStop = $derived(encumbrance.stops?.encumbered ?? 0);
  let heavilyEncumberedStop = $derived(
    encumbrance.stops?.heavilyEncumbered ?? 0,
  );

  let barSeverity = $derived(
    percentage > heavilyEncumberedStop
      ? `high`
      : percentage > encumberedStop
        ? `medium`
        : `low`,
  );

  let readableValue = $derived(FoundryAdapter.formatNumber((encumbrance.value ?? 0).toNearest(0.1)));

  let encumbranceMaxText = $derived(
    encumbrance.max === Infinity ? '∞' : FoundryAdapter.formatNumber(encumbrance.max),
  );

  let weightDistributionTooltip: WeightDistributionTooltip;
</script>

<WeightDistributionTooltip
  bind:this={weightDistributionTooltip}
  sheetDocument={actor}
  fullWeight={encumbrance.value}
  currencyWeight={actor.system.currencyWeight}
/>

<div
  class={[
    'meter progress encumbrance theme-dark',
    { empty: (encumbrance.value ?? 0) === 0 },
    barSeverity,
  ]}
  role="meter"
  aria-valuemin="0"
  aria-valuenow={encumbrance.pct}
  aria-valuetext={(encumbrance.value ?? 0).toString()}
  aria-valuemax={encumbrance.max}
  style="--bar-percentage: {percentage}%; --encumbrance-low: {encumberedStop}%; --encumbrance-high: {heavilyEncumberedStop}%;"
  data-tooltip-direction="UP"
  onmouseover={(ev) => weightDistributionTooltip.tryShow(ev)}
  onfocus={(ev) => weightDistributionTooltip.tryShow(ev)}
>
  <div class="label">
    <i class="fas fa-weight-hanging text-label-icon"></i>
    <span class="value font-weight-label">{readableValue}</span>
    <span class="separator">/</span>
    <span class="max color-text-default">{encumbranceMaxText}</span>
  </div>

  {#if hasBreakpoints}
    <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i>
    <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i>
    <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i>
    <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
  {/if}
</div>
