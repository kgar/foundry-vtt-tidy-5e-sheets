<script lang="ts">
  import type { Actor5e, GroupMemberQuadroneContext } from 'src/types/types';
  import InspirationBadge from '../../actor/character-parts/InspirationBadge.svelte';

  let {
    rowDocument,
    rowContext,
  }: {
    rowDocument: Actor5e;
    rowContext: GroupMemberQuadroneContext;
  } = $props();
</script>

{#if 'inspiration' in rowDocument.system.attributes}
  <InspirationBadge
    actor={rowDocument}
    inspirationSource={rowContext.inspirationSource}
  />
{/if}
