<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { isNil } from 'src/utils/data';
  import { firstOfSet } from 'src/utils/set';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  let inferredActivation = $derived(
    item.system.activities
      ? firstOfSet<any>(item.system.activities)?.activation
      : '',
  );

  let abbrOrLabel = $derived(
    FoundryAdapter.getActivationText(inferredActivation?.type),
  );

  const localize = FoundryAdapter.localize;
</script>

{#if !isNil(abbrOrLabel.abbreviation, '')}
  {inferredActivation?.value ?? ''}<span data-tooltip={abbrOrLabel.label}
    >{localize(abbrOrLabel.abbreviation)}</span
  >
{:else if !isNil(abbrOrLabel.label, '')}
  {inferredActivation?.value ?? ''} {localize(abbrOrLabel.label)}
{:else}
  <span class="color-text-disabled">—</span>
{/if}
