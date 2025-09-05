<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import InspirationBadge from '../../actor/character-parts/InspirationBadge.svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();
</script>

<InspirationBadge
  actor={rowDocument}
  inspirationSource={rowContext.inspirationSource}
/>
