<script lang="ts">
  import type { ActorAttributeEncumbrance } from 'src/foundry/dnd5e.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
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

  let readableValue = $derived((encumbrance.value ?? 0).toFixed(1));

  let encumbranceMaxText = $derived(
    encumbrance.max === Infinity ? '∞' : encumbrance.max,
  );
</script>

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
