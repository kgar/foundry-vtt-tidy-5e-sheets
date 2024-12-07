<script lang="ts">
  import NpcSheetFull from './NpcSheetFull.svelte';
  import NpcSheetLimited from './NpcSheetLimited.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getNpcSheetContext();
</script>

{#if context.showLimitedSheet}
  <NpcSheetLimited />
{:else}
  <NpcSheetFull />
{/if}
