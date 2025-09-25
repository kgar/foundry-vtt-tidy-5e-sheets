<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    EncounterMemberQuadroneContext | EncounterPlaceholderQuadroneContext
  > = $props();
</script>

{#if rowContext.type === 'member'}
  <span class="cr-value font-label-large color-text-default"
    >{FoundryAdapter.formatCr(rowDocument.system.details.cr)}</span
  >
{/if}
