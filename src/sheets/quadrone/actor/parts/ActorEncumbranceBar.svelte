<script lang="ts">
  import type { ActorAttributeEncumbrance } from 'src/foundry/dnd5e.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import WeightDistributionTooltip from 'src/tooltips/WeightDistributionTooltip.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let encumbrance = $derived<ActorAttributeEncumbrance>(
    context.system.attributes.encumbrance,
  );

  let percentage = $derived(Math.round(encumbrance.pct));

  let barSeverity = $derived(
    percentage > encumbrance.stops.heavilyEncumbered
      ? `high`
      : percentage > encumbrance.stops.encumbered
        ? `medium`
        : `low`,
  );

  function formatWeight(value: number): string {
    const rounded = Math.round((value ?? 0) * 100) / 100;
    return rounded.toFixed(2).replace(/\.0+$/, '').replace(/\.$/, '');
  }

  let readableValue = $derived(formatWeight(encumbrance.value ?? 0));

  let encumbranceMaxText = $derived(
    encumbrance.max === Infinity ? '∞' : encumbrance.max,
  );

  let weightDistributionTooltip: WeightDistributionTooltip;
  let unitsAbbreviation = $derived(FoundryAdapter.getWeightUnit());
</script>

<WeightDistributionTooltip
  bind:this={weightDistributionTooltip}
  sheetDocument={context.actor}
  fullWeight={context.system.attributes.encumbrance.value}
  currencyWeight={context.system.currencyWeight}
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
    <span class="units color-text-lightest">{unitsAbbreviation}</span>
  </div>

  <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
</div>
