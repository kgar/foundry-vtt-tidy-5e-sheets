<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, EncounterMemberQuadroneContext> = $props();
</script>

<span class="font-label-large color-text-default"
  >{rowDocument.system.attributes.cr.value}</span
>
