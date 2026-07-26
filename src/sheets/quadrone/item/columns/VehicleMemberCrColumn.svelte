<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';

  let {
    rowDocument,
  }: {
    rowDocument: Actor5e;
  } = $props();
</script>

{#if rowDocument.system.isNPC}
  <span class="cr-value font-default-medium color-text-default"
    >{FoundryAdapter.formatCr(rowDocument.system.details.cr)}</span
  >
{/if}
