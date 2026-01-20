<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { isNil } from 'src/utils/data';

  let { rowDocument: activity, rowContext }: ColumnCellProps = $props();

  let inferredActivation = $derived(activity.activation);

  let abbrOrLabel = $derived(
    FoundryAdapter.getActivationText(inferredActivation?.type),
  );

  let tooltipContent = $derived(
    (inferredActivation?.value ?? '') +
      ' ' +
      (inferredActivation?.condition !== undefined &&
      inferredActivation?.condition !== ''
        ? abbrOrLabel.label + ', ' + inferredActivation?.condition
        : abbrOrLabel.label),
  );

  const localize = FoundryAdapter.localize;
</script>

{#if !isNil(abbrOrLabel.abbreviation, '')}
  <span class="property-time" data-tooltip={tooltipContent}>
    {inferredActivation?.value ?? ''}&nbsp;
    {localize(abbrOrLabel.abbreviation)}
  </span>
{:else if !isNil(abbrOrLabel.label, '')}
  <span class="property-time truncate" data-tooltip={tooltipContent}>
    {inferredActivation?.value ?? ''}&nbsp;
    {localize(abbrOrLabel.label)}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
