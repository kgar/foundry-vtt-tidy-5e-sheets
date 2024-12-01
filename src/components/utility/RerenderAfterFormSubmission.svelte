<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { SheetStats } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';

  let stats = getContext<Readable<SheetStats>>(CONSTANTS.SVELTE_CONTEXT.STATS);

  interface Props {
    andOnValueChange?: unknown | null;
    children?: import('svelte').Snippet;
  }

  let { andOnValueChange = null, children }: Props = $props();
</script>

{#key $stats.lastSubmissionTime}
  {#key andOnValueChange}
    {@render children?.()}
  {/key}
{/key}
