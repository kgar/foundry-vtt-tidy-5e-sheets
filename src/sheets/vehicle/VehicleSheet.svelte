<script lang="ts">
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleSheetFull from './VehicleSheetFull.svelte';
  import VehicleSheetLimited from './VehicleSheetLimited.svelte';

  let context = getContext<Readable<VehicleSheetContext>>('context');
</script>

{#if $context.showLimitedSheet}
  <VehicleSheetLimited />
{:else}
  <VehicleSheetFull />
{/if}
