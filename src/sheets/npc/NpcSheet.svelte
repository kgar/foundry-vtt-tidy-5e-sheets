<script lang="ts">
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcSheetFull from './NpcSheetFull.svelte';
  import NpcSheetLimited from './NpcSheetLimited.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

{#if $context.showLimitedSheet}
  <NpcSheetLimited />
{:else}
  <NpcSheetFull />
{/if}
