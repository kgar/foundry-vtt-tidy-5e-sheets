<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { isNil } from 'src/utils/data';
    import { coalesce } from 'src/utils/formatting';

  let { rowDocument: activity, rowContext }: ColumnCellProps = $props();

  let inferredActivation = $derived(activity.activation);

  let abbrOrLabel = $derived(
    FoundryAdapter.getActivationText(inferredActivation?.type),
  );

  let text = $derived(coalesce(abbrOrLabel.abbreviation, abbrOrLabel.label, ""));

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

{#if !isNil(text, '')}
  <span class="break-word" data-tooltip={tooltipContent}>
    {inferredActivation?.value ?? ''}&nbsp;
    {localize(text)}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
