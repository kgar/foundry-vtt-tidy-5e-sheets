<script lang="ts">
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleSheetFull from './VehicleSheetFull.svelte';
  import VehicleSheetLimited from './VehicleSheetLimited.svelte';

  let store = getContext<Readable<VehicleSheetContext>>('store');
  export let selectedTabId: string;
</script>

{#if $store.showLimitedSheet}
  <VehicleSheetLimited />
{:else}
  <VehicleSheetFull {selectedTabId} />
{/if}
