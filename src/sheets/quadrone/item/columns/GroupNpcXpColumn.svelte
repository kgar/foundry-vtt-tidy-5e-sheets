<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    EncounterMemberQuadroneContext,
    GroupMemberQuadroneContext,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext: _,
  }: ColumnCellProps<
    any,
    GroupMemberQuadroneContext | EncounterMemberQuadroneContext
  > = $props();
</script>

<span class="font-label-large color-text-default"
  >{rowDocument.system.details.xp.value.toLocaleString()}</span
>
