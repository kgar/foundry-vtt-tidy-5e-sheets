<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    progress: {
      value: number;
      max: number;
      pct: number;
      order: string;
    };
  }

  let { progress }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getGroupSheetQuadroneContext());

  // Nudging an order along is a GM correction, so it stays out of the way
  // until the sheet is unlocked. Facilities without an order have nothing to
  // step. The sheet re-checks all of this before it writes.
  let canAdjustProgress = $derived(
    FoundryAdapter.userIsGm() && context.unlocked && progress.max > 0,
  );
</script>

{#snippet meter()}
  <div
    class="meter progress facility-progress theme-dark"
    role="meter"
    aria-valuemin="0"
    aria-valuenow={progress.pct}
    aria-valuetext={progress.value?.toString()}
    aria-valuemax={progress.max}
    style="--bar-percentage: {progress.pct}%"
    data-tooltip={localize('DND5E.TimeDay')}
  >
    <div class="label">
      <span class="counter">
        <span class="value font-data-medium">{progress.value}</span><span
          class="separator">&sol;</span
        ><span class="max font-label-medium color-text-lighter"
          >{progress.max}</span
        >
      </span>
    </div>
  </div>
{/snippet}

{#if progress.order}
  {#if canAdjustProgress}
    <div class="facility-progress-adjust tidy-inline-quantity-tracker">
      <!-- svelte-ignore a11y_missing_attribute -->
      <a
        class={['command decrementer', { disabled: progress.value <= 0 }]}
        role="button"
        tabindex={0}
        data-action="adjustMemberFacilityProgress"
        data-value="-1"
        aria-label={localize('DND5E.FACILITY.Progress')}
      >
        <i class="fa-solid fa-minus"></i>
      </a>

      {@render meter()}

      <!-- svelte-ignore a11y_missing_attribute -->
      <a
        class={['command incrementer', { disabled: progress.value >= progress.max }]}
        role="button"
        tabindex={0}
        data-action="adjustMemberFacilityProgress"
        data-value="1"
        aria-label={localize('DND5E.FACILITY.Progress')}
      >
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>
  {:else}
    {@render meter()}
  {/if}
{/if}