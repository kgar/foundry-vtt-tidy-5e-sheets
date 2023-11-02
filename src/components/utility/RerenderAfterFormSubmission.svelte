<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { SheetStats } from 'src/types/types';

  let stats = getContext<Readable<SheetStats>>('stats');

  export let andOnValueChange: unknown | null = null;
</script>

{#key $stats.lastSubmissionTime}
  {#key andOnValueChange}
    <slot />
  {/key}
{/key}
