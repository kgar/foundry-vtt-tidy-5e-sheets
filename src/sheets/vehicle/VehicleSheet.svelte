<script lang="ts">
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import VehicleSheetFull from './VehicleSheetFull.svelte';
  import VehicleSheetLimited from './VehicleSheetLimited.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<VehicleSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

{#if $context.showLimitedSheet}
  <VehicleSheetLimited />
{:else}
  <VehicleSheetFull />
{/if}
