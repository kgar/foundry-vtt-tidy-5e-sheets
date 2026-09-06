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
  import {
    getSheetContext,
    tryGetSheetContext,
  } from 'src/sheets/sheet-context.svelte';
  import { Container } from 'src/features/containers/Container';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showTracker?: boolean;
    showWeightDistributionTooltip?: boolean;
  }

  let {
    container,
    capacity,
    showTracker = true,
    showWeightDistributionTooltip = true,
  }: Props = $props();

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

  let weightDistributionTooltip: WeightDistributionTooltip | undefined =
    $state();

  // Get context so that we can check the sheet and see if container content should be shown.
  const sheetContext = $derived(tryGetSheetContext<{ unlocked?: boolean }>());
  const contentsVisibility = $derived(
    Container.getContentsVisibility(container, {
      unlocked: sheetContext?.unlocked === true,
    }),
  );
</script>

{#if showWeightDistributionTooltip}
  <WeightDistributionTooltip
    bind:this={weightDistributionTooltip}
    sheetDocument={context.document}
    fullWeight={container.system.contentsWeight}
    currencyWeight={container.system.currencyWeight}
  />
{/if}

{#if contentsVisibility !== 'hidden'}
<div
  class={[
    'meter progress capacity theme-dark',
    { empty: (capacity.value ?? 0) === 0 },
    barSeverity,
    { 'gm-secret': contentsVisibility === 'gmSecret' },
  ]}
  role="meter"
  aria-label={localize('DND5E.CONTAINER.FIELDS.capacity.label')}
  aria-valuemin="0"
  aria-valuenow={capacity.pct}
  aria-valuetext={(capacity.value ?? 0).toString()}
  aria-valuemax={capacity.max}
  style="--bar-percentage: {percentage}%;"
  data-tooltip-direction="UP"
  onmouseover={(ev) =>
    showWeightDistributionTooltip && weightDistributionTooltip?.tryShow(ev)}
  onfocus={(ev) =>
    showWeightDistributionTooltip && weightDistributionTooltip?.tryShow(ev)}
>
  {#if showTracker}
    {@render tracker()}
  {/if}
</div>
{/if}

{#snippet tracker()}
  <CapacityTracker {capacity} {container} />
{/snippet}
