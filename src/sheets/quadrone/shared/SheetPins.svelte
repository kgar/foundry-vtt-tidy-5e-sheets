<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import SheetPinItem from './SheetPinItem.svelte';
  import SheetPinActivity from './SheetPinActivity.svelte';
  import { error } from 'src/utils/logging';

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext
      >(),
    );
</script>

{#if context.sheetPins.length}
  <div class="sheet-pins">
    {#each context.sheetPins as ctx (ctx.id)}
      <svelte:boundary
        onerror={(e) =>
          error('An error occurred while rendering an attribute pin', false, e)}
      >
        {#if ctx.type === 'item'}
          <SheetPinItem {ctx} />
        {:else if ctx.type === 'activity'}
          <SheetPinActivity {ctx} />
        {/if}
      </svelte:boundary>
    {/each}
  </div>
{/if}
