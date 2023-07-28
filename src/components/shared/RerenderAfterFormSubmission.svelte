<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { SheetStats } from 'src/types/types';

  let stats = getContext<Readable<SheetStats>>('stats');
</script>

{#key $stats.lastSubmissionTime}
  <slot />
{/key}
