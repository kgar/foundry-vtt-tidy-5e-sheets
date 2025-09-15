<script lang="ts">
  import type { ActorAttributeEncumbrance } from 'src/foundry/dnd5e.types';
  import type { Actor5e } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { EncounterMembersQuadroneContext } from 'src/types/types';

  const localize = FoundryAdapter.localize;

  type Props = {
    encounter: EncounterMembersQuadroneContext;
  };

  let { encounter }: Props = $props();

  // TODO: Switch to
  // Debug: Manual encumbrance values
  let encumbrance: ActorAttributeEncumbrance = {
    value: 2950,      // Current XP value
    max: 8800,         // Max XP value  
    pct: 33.5,        // Percentage (45.5%)
    stops: {
      encumbered: 35.3,           // Medium threshold, this is from a table
      heavilyEncumbered: 64.7,    // High threshold, this is from a table
    },
    thresholds: {
      encumbered: 2933.3,
      heavilyEncumbered: 5866.1,
      maximum: 8800,
    },
    mod: 0,
    encumbered: false,
  };
  

  let percentage = $derived(Math.round(encumbrance.pct));

  let barSeverity = $derived(
    percentage > encumbrance.stops.heavilyEncumbered
      ? `high`
      : percentage > encumbrance.stops.encumbered
        ? `medium`
        : `low`,
  );

  let currentXp = $derived((encumbrance.value ?? 0).toFixed(0));

  let maxXp = $derived(
    encumbrance.max === Infinity ? '∞' : encumbrance.max,
  );

  // let weightDistributionTooltip: WeightDistributionTooltip;
</script>

<!-- <WeightDistributionTooltip
  bind:this={weightDistributionTooltip}
  sheetDocument={actor}
  fullWeight={actor.system.attributes.encumbrance.value}
  currencyWeight={actor.system.currencyWeight}
/> -->

<div
  class={[
    'meter progress encumbrance xp-budget theme-dark flex1',
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

>
<!--   onmouseover={(ev) => weightDistributionTooltip.tryShow(ev)}
  onfocus={(ev) => weightDistributionTooltip.tryShow(ev)} -->
  <div class="label">
    <span class="font-label-medium color-text-lighter">{localize('DND5E.ExperiencePoints.Abbreviation')}</span>
    <span class="value font-weight-label">{currentXp}</span>
    <span class="separator">/</span>
    <span class="max color-text-default">{maxXp}</span>
    <!-- <span class="units color-text-lightest">{unitsAbbreviation}</span> -->
  </div>

  <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
</div>
