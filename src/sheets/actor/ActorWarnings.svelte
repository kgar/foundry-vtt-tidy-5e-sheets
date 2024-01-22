<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let warnings: any;

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

<ol class="warnings">
  {#each warnings as warning}
    <li class="notification {warning.type}">
      {#if warning.link}
        <button
          type="button"
          class="inline-transparent-button"
          on:click={(ev) => $context.actor.sheet._onWarningLink(ev)}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
          data-target={warning.link}>{warning.message}</button
        >
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

    button {
      color: inherit;
    }
  }
</style>
