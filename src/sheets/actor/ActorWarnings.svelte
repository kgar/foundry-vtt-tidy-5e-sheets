<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let warnings: any;

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<ol class="warnings">
  {#each warnings as warning}
    <li class="notification {warning.type}">
      {#if true}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="warning-link inline-transparent-button"
          on:click={(ev) => $context.actor.sheet._onWarningLink(ev)}
          data-target={warning.link}
          >{warning.message}
        </a>
      {:else}
        {warning.message}
      {/if}
    </li>
  {/each}
</ol>

<style lang="scss">
  .warnings {
    list-style: none;
    padding: 0;
    margin: 0;

    .notification {
      margin: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .warning-link {
      color: inherit;
    }
  }
</style>
