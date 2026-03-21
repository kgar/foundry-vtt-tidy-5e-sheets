<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { isNil } from 'src/utils/data';
  import { firstOfSet } from 'src/utils/set';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  const localize = FoundryAdapter.localize;

  let inferredActivation = $derived(
    item.system.activities
      ? firstOfSet<any>(item.system.activities)?.activation
      : '',
  );

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

  function getFullLabel() {
    return [inferredActivation?.value, localize(abbrOrLabel.label)].filterJoin(
      ' ',
    );
  }
</script>

{#if !isNil(abbrOrLabel.abbreviation, '')}
  <span class="overflow-wrap-anywhere" data-tooltip={tooltipContent}>
    {inferredActivation?.value ?? ''}&nbsp;
    {localize(abbrOrLabel.abbreviation)}
  </span>
{:else if !isNil(abbrOrLabel.label, '')}
  {@const fullLabel = getFullLabel()}
  <span class="overflow-wrap-anywhere" data-tooltip={tooltipContent}>
    {fullLabel}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
