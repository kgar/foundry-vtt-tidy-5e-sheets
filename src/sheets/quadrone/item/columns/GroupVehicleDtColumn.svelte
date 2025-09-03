<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();
</script>

<span
  class="font-data-large color-text-{rowDocument.system.attributes.hp.dt
    ? 'default'
    : 'lightest'}">{rowDocument.system.attributes.hp.dt ?? '—'}</span
>
