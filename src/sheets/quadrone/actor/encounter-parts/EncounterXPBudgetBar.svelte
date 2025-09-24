<script lang="ts">
  import type { EncounterDifficultyContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;

  type Props = {
    difficulty: EncounterDifficultyContext;
  };

  let { difficulty }: Props = $props();

  let percentage = $derived(Math.round(difficulty.pct));

  let barSeverity = $derived(
    percentage > difficulty.stops.high
      ? `high`
      : percentage > difficulty.stops.low
        ? `medium`
        : `low`,
  );

  let currentXp = $derived((difficulty.value ?? 0).toFixed(0));
</script>

<div
  class={[
    'meter progress encumbrance xp-budget theme-dark flex1',
    { empty: (difficulty.value ?? 0) === 0 },
    barSeverity,
  ]}
  role="meter"
  aria-valuemin="0"
  aria-valuenow={difficulty.pct}
  aria-valuetext={(difficulty.value ?? 0).toString()}
  aria-valuemax={difficulty.max}
  style="--bar-percentage: {percentage}%; --encumbrance-low: {difficulty.stops
    .low}%; --encumbrance-high: {difficulty.stops.high}%;"
  data-tooltip-direction="UP"
>
  <div class="label">
    <span class="font-label-medium color-text-lighter"
      >{localize('DND5E.ExperiencePoints.Abbreviation')}</span
    >
    <span class="value font-weight-label">{currentXp}</span>
  </div>

  <i class="breakpoint encumbrance-low arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-low arrow-down" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-up" role="presentation"></i>
  <i class="breakpoint encumbrance-high arrow-down" role="presentation"></i>
</div>
