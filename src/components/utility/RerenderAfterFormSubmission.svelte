<script lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import type { SheetStats } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';

  let stats = getContext<SheetStats>(CONSTANTS.SVELTE_CONTEXT.STATS);

  interface Props {
    andOnValueChange?: unknown | null;
    children?: Snippet;
  }

  let { andOnValueChange = null, children }: Props = $props();
</script>

{#key stats.lastSubmissionTime}
  {#key andOnValueChange}
    {@render children?.()}
  {/key}
{/key}
