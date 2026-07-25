<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import { isNil } from 'src/utils/data';

  let { rowDocument }: { rowDocument: Item5e } = $props();
</script>

{#if !isNil(rowDocument.system.requirements, '')}
  {rowDocument.system.requirements}
{:else}
  <span class="color-text-disabled">—</span>
{/if}
