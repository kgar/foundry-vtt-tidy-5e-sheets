<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';

  interface Props {
    warnings: any;
  }

  let { warnings }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  function onCloseWarnings(
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLDialogElement;
    },
  ) {
    if (event.target instanceof HTMLDialogElement) {
      event.target.close();
    }

    if (event.target instanceof HTMLAnchorElement) {
      event.target.closest('dialog')?.close();
    }
  }
</script>

<dialog class="warnings active" onclick={(event) => onCloseWarnings(event)}>
  <ol class="unlist">
    {#each warnings as warning, index}
      <li class={warning.type}>
        {#if warning.link}
          <a
            class="inline-transparent-button"
            onclick={(ev) => context.actor.sheet._onWarningLink(ev)}
            data-target={warning.link}
          >
            {warning.message}
          </a>
        {:else}
          {warning.message}
        {/if}
      </li>
    {/each}
  </ol>
</dialog>
