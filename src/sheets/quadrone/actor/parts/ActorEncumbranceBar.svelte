<script lang="ts">
  import type { ActorAttributeEncumbrance } from 'src/foundry/dnd5e.types';
  import WeightDistributionTooltip from 'src/tooltips/WeightDistributionTooltip.svelte';
  import type { Actor5e } from 'src/types/types';

  type Props = {
    actor: Actor5e;
  };

  let { actor }: Props = $props();

  let encumbrance = $derived<ActorAttributeEncumbrance>(
    actor.system.attributes.encumbrance,
  );

  let percentage = $derived(Math.round(encumbrance.pct));

  let barSeverity = $derived(
    percentage > encumbrance.stops.heavilyEncumbered
      ? `high`
      : percentage > encumbrance.stops.encumbered
        ? `medium`
        : `low`,
  );

  let readableValue = $derived((encumbrance.value ?? 0).toFixed(1));

  let encumbranceMaxText = $derived(
    encumbrance.max === Infinity ? '∞' : encumbrance.max,
  );

  let weightDistributionTooltip: WeightDistributionTooltip;
</script>

<WeightDistributionTooltip
  bind:this={weightDistributionTooltip}
  sheetDocument={actor}
  fullWeight={actor.system.attributes.encumbrance.value}
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
  style="--bar-percentage: {percentage}%; --encumbrance-low: {encumbrance.stops
    .encumbered}%; --encumbrance-high: {encumbrance.stops.heavilyEncumbered}%;"
  data-tooltip-direction="UP"
  onmouseover={(ev) => weightDistributionTooltip.tryShow(ev)}
  onfocus={(ev) => weightDistributionTooltip.tryShow(ev)}
>
  <div class="label">
    <i class="fas fa-weight-hanging text-label-icon"></i>
    <span class="value font-weight-label">{readableValue}</span>
    <span class="separator">/</span>
    <span class="max color-text-default">{encumbranceMaxText}</span>
    <!-- <span class="units color-text-lightest">{unitsAbbreviation}</span> -->
  </div>

  <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
</div>
