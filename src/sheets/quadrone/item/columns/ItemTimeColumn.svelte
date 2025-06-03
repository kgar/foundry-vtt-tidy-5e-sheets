<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/item/item.types';
  import { isNil } from 'src/utils/data';
  import { firstOfSet } from 'src/utils/set';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  let inferredActivation = $derived(
    item.system.activities
      ? firstOfSet<any>(item.system.activities)?.activation?.type
      : '',
  );

  let abbrOrLabel = $derived(
    FoundryAdapter.localize(
      FoundryAdapter.getActivationAbbreviation(inferredActivation),
    ),
  );
</script>

{#if !isNil(abbrOrLabel, '')}
  {abbrOrLabel}
{:else}
  <span class="color-text-disabled">—</span>
{/if}
