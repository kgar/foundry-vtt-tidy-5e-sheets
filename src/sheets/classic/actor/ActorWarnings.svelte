<script lang="ts">
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';

  interface Props {
    warnings: any;
  }

  let { warnings }: Props = $props();

  let context = getSheetContext<ActorSheetContextV1>();
</script>

<ol class="warnings">
  {#each warnings as warning}
    <li class="notification {warning.type}">
      {#if warning.link}
        <button
          type="button"
          class="inline-transparent-button"
          onclick={(ev) => context.actor.sheet._onWarningLink(ev)}
          tabindex={settings.useAccessibleKeyboardSupport ? 0 : -1}
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
