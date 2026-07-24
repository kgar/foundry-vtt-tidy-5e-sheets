<script lang="ts">
  import type { ColumnCellProps } from 'src/types/columns.types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();
</script>

<span class="font-label-large color-text-default"
  >{rowDocument.system.attributes.ac.value}</span
>
