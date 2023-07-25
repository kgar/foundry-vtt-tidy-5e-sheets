<script lang="ts">
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContext } from '../types/types';

  export let store: Readable<ActorSheetContext>;
</script>

{#if $store}
  <div style="overflow-y: scroll">
    <h1>Hello, world!</h1>

    <p>This is the new sheet of {$store.actor.name}</p>

    <p>
      Was this inspired? Let's see: <label
        ><input
          type="checkbox"
          checked={$store.actor.system.attributes.inspiration}
          on:change={(event) =>
            $store.actor.update({
              'system.attributes.inspiration': event.currentTarget.checked,
            })}
        /> Is Inspired</label
      >
    </p>
    <p>I see the checkbox, but what does the data say?</p>
    <p>
      Is Inspired: {$store.actor.system.attributes.inspiration
        ? 'Yes!'
        : "That's gonna be a no from me, dawg."}
    </p>
  </div>
{:else}
  <i>Loading...</i>
{/if}
