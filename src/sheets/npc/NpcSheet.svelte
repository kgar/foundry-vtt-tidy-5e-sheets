<script lang="ts">
    import type { NpcSheetContext } from 'src/types/types';
    import { getContext } from 'svelte';
    import type { Readable } from 'svelte/store';
    import NpcSheetFull from './NpcSheetFull.svelte';
    import NpcSheetLimited from './NpcSheetLimited.svelte';
  
    let store = getContext<Readable<NpcSheetContext>>('store');
    export let selectedTabId: string;
  </script>
  
  {#if $store.showLimitedSheet}
    <NpcSheetLimited />
  {:else}
    <NpcSheetFull {selectedTabId} />
  {/if}
  