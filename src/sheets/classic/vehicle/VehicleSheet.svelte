<script lang="ts">
  import type { VehicleSheetContext } from 'src/types/types';
  import VehicleSheetFull from './VehicleSheetFull.svelte';
  import VehicleSheetLimited from './VehicleSheetLimited.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getSheetContext<VehicleSheetContext>());
</script>

{#if context.showLimitedSheet}
  <VehicleSheetLimited />
{:else}
  <VehicleSheetFull />
{/if}
