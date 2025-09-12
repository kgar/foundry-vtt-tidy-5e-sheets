<script lang="ts">
    import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, EncounterMemberQuadroneContext> = $props();
</script>

<span class="font-label-large color-text-default"
  >{FoundryAdapter.formatCr(rowDocument.system.details.cr)}</span
>
