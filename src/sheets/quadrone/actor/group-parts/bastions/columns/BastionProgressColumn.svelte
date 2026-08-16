<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    progress: {
      value: number;
      max: number;
      pct: number;
    };
  }

  let { progress }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div
  class="meter progress facility-progress"
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
